import os, json, random, datetime, time, hashlib
# from dotenv import load_dotenv
from flask import *
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant, ChatGrant
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from flask_mail import Mail, Message
from shortuuid import uuid
# load_dotenv()
twilio_account_sid = "ACdcc4c30adf8b6862f7116d706ee63926"
twilio_api_key_sid = "SK0aa583cb7be367dd489fdfaa413fe028"
twilio_api_key_secret = "eLYs8ji25nuxf50LIDanVGJrPrUB0mzj"
twilio_client = Client(twilio_api_key_sid, twilio_api_key_secret,
                       twilio_account_sid)

app = Flask(__name__)
app.config['SECRET_KEY'] = "drink_cola!"

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'fepzbusiness@gmail.com'
app.config['MAIL_PASSWORD'] = 'fepzmail123'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

with open("db/data.json") as fp:
    data = json.load(fp)
with open("db/FP_codes.json") as fp:
    FP_codes = json.load(fp)

with open("db/status.json") as fp:
    status = json.load(fp)

def get_chatroom(name):
    for conversation in twilio_client.conversations.conversations.stream():
        if conversation.friendly_name == name:
            return conversation

    # a conversation with the given name does not exist ==> create a new one
    return twilio_client.conversations.conversations.create(
        friendly_name=name)

def saveJson():
    with open("db/data.json", "w+") as fp:
        json.dump(data, fp, indent=4)
    with open("db/FP_codes.json", "w+") as fp:
        json.dump(FP_codes, fp, indent=4)
    with open("db/status.json", "w+") as fp:
        json.dump(status, fp, indent=4)



def hasher(text) -> str: h = hashlib.md5(text.encode()); return h.hexdigest()


def auth(username, pw):
    global data
    try:
        if data[username]['pw'] == hasher(pw):
            return True
        return
    except KeyError:
        return

@app.route('/logout')
def logout():
    global data
    cookie = make_response(redirect("/"))
    cookie.set_cookie('name', "")
    cookie.set_cookie('pw', "")
    flash("Logged out!", category="success")
    return cookie

@app.route('/login', methods=['POST'])
def log_in():
    global data
    try:
        name = request.form['name']
        pw = request.form['pw']
        if auth(name, pw):
            cookie = make_response(redirect("/"))
            cookie.set_cookie("name", name)
            cookie.set_cookie("pw", pw)
            
            return cookie
        flash("Username or password incorrect", category="error")
        return redirect("/")
    except:
        return redirect("/")

@app.route('/')
def index():
    global data,posts
    name = request.cookies.get("name")
    pw = request.cookies.get("pw")

    if name != "" and name != None and pw != "" and pw != None:
        if auth(name, pw):

            onlineFriends = [
                user
                for user in status
                if user in data[name]['friends'] and status[user] == "online"
            ]
            data[name]["currentRoom"] = uuid()
            saveJson()
            return render_template(
                "index.html",
                r=random.randint(0,234234),
                friends=data[name]['friends'],
                sent=data[name]['sent'],
                recived=data[name]['recived'],
                onlineFriends=onlineFriends,
                data=data,
                name=name,
                chosenRoom=uuid()
            )
        else:
            return render_template("auth.html", r=random.randint(0, 12132))
    else:
        return render_template("auth.html", r=random.randint(0, 12132)) 


@app.route('/search', methods=['POST'])
def search():
    name = request.cookies.get("name")
    pw = request.cookies.get("pw")
    if auth(name, pw):
        t = request.form['text']
        tl = t.lower()
        res = []
        resData = {}
        for user in data.keys():
            userl = user.lower()
            if userl in tl or tl.endswith(userl) or userl.endswith(tl) or tl.startswith(userl) or userl.startswith(tl) or tl == userl:
                if userl != name.lower():
                    res.append(user)

                    if user in data[name]['sent']: # to check if name sent a friend request to user
                        state = "me_sent"
                    elif user in data[name]['recived']: # to check if user sent friend request name
                        state = "user_sent"
                    elif user in data[name]['friends']: # to check if user and name are friends
                        state = "friends"
                    else:
                        state = "normal" # not friends (else)
                    resData[user] = state

    return jsonify({"res":res, "resData":resData})

@app.route('/sign-up', methods=['POST', "GET"])
# @limiter.limit("3/day")
def sign_up():
    global data
    try:
        name = request.form['name']
        pw = request.form['pw']
        email = request.form['email']
        if len(name) > 10 or len(pw) > 50:
            flash("Username max length should be 9 and password max length is 50!", category="error")
            return redirect("/")
        birthday = request.form['birthday']
        if name not in data.keys():
            foundEmail = any(data[user]["email"] == email for user in data)

            if foundEmail:
                flash("Email taken.", category="error")
                return redirect("/")
            today = datetime.date.today()
            nowTime = today.strftime("%d/%m/%Y")
            data[name] = {
                "name":name,
                "pw":hasher(pw),
                "email":email,
                "settings":{},
                "birthday":birthday,
                "pfp":"static/images/default.jpg",
                "joined":nowTime,
                "notifications":[],
                "friends":[],
                "recived":[],
                "sent":[],
                "currentRoom": "--",
                "invite":"",
            }
            status[name] = "offline"
            saveJson()

            cookie = make_response(redirect('/'))
            cookie.set_cookie("name", name)
            cookie.set_cookie("pw", pw)
            return cookie
        else:
                flash("Username taken.", category="error")
                return redirect("/")
  

        
    except Exception as E:
        print("ERROR: " + str(E))
        return redirect("/")


@app.route('/change-pfp', methods=['POST'])
def change_pfp():
    try:
        name = request.cookies.get("name")
        pw = request.cookies.get("pw")
        if auth(name, pw):
            pfp = request.files['pfp']
            fileName, ext = os.path.splitext(pfp.filename)
            if data[name]['pfp'][1:] != "static/images/default.jpg" and "images/" not in data[name]['pfp']:
                if data[name]['pfp'][0] == "/":
                    os.remove(data[name]['pfp'][1:])
                else:
                    os.remove(data[name]['pfp'])
            pfp.save("static/pfps/" + name + ext)
            data[name]['pfp'] = "/static/pfps/" + name + ext
            saveJson()
            return jsonify({'r':data[name]['pfp']})
    except KeyError:
        print("error")
        return "False"

@app.route('/login/<room>', methods=['POST'])
def login(room):
    username = request.get_json(force=True).get('username')
    if not username:
        abort(401)

    conversation = get_chatroom(room)
    try:
        conversation.participants.create(identity=username)
    except TwilioRestException as exc:
        # do not error if the user is already in the conversation
        if exc.status != 409:
            raise

    token = AccessToken(twilio_account_sid, twilio_api_key_sid,
                        twilio_api_key_secret, identity=username)
    token.add_grant(VideoGrant(room=room))
    token.add_grant(ChatGrant(service_sid=conversation.chat_service_sid))
    data[username]["currentRoom"] = room
    saveJson()
    return {'token': token.to_jwt(),
            'conversation_sid': conversation.sid}


#region Forgot Password
@app.route('/forgot-password', methods=['POST'])
def forgotPassword():
    #Send the email with the code and save it in a json until they confirm it
    recep = request.form['email']
    foundEmail = any(data[user]["email"] == recep for user in data)
    if not foundEmail:
        return "no user found with that email"

    msg = Message('Reset Password - House Party Clone', sender = 'fepzbusiness@gmail.com', recipients = [recep])
    code = random.sample(range(1000,9999), 1)[0]
    msg.html = f"<h3>Code to reset your House Party Clone password:</h3><br><b><h1> {code} </h1></b>"
    mail.send(msg)
    FP_codes[recep] = code
    saveJson()

    

    return ""



@app.route('/check-fp-code/<email>/<code>', methods = ["GET"])
def check_fp_code(email,code):

    if str(FP_codes[email]) != code:
        return "false"

    FP_codes[email] = "waiting for PW change"
    saveJson()
    return "true"



@app.route('/change-password/<email>', methods = ["POST"])
def change_password(email):
    if FP_codes[email] == "waiting for PW change":
        newPassword = request.form.get('newPassword')
        for user in data:
            if data[user]["email"] == email:
                data[user]["pw"] = hasher(newPassword)
                del FP_codes[email]
                saveJson()
                break

        return "success"
    else:
        return ""
#endregion



@app.route('/send-req', methods=['POST'])
def send_req():
    name = request.cookies.get("name")
    pw = request.cookies.get("pw")
    if auth(name, pw):
        user = request.form['user']
        friends = data[user]['friends']
        if name in friends:
            return ""
        elif name in data[user]["sent"]:
            return ""
        elif name in data[user]['recived']:
            return ""
        else:
            data[user]['recived'].append(name)
            data[name]["sent"].append(user)
            saveJson()
            return "success"

    
    return ""

@app.route('/rm-req', methods=['POST'])
def rm_req():
    user = request.form['user']
    name = request.cookies.get("name")
    pw = request.cookies.get("pw")
    if auth(name, pw):
        friends = data[user]['friends']
        if name in friends:
            return ""
        elif name in data[user]["sent"]:
            return ""
        elif name in data[user]['recived']:
            data[user]['recived'].remove(name)
            data[name]["sent"].remove(user)
            saveJson()
            return "success"
        else:
            return ""

    
    return ""


@app.route('/accept-req', methods=['POST'])
def accept_req():
    name = request.cookies.get("name")
    pw = request.cookies.get("pw")
    if auth(name, pw):
        user = request.form['user']
        friends = data[user]['friends']
        if name in friends:
            return ""
        elif name in data[user]["sent"]:
            data[user]["friends"].append(name)
            data[name]["friends"].append(user)
            data[name]["recived"].remove(user)
            data[user]["sent"].remove(name)
            saveJson()
            return "success"
        elif name in data[user]['recived']:
            return ""
        else:
            return ""


    return ""


@app.route('/reject', methods=['POST'])
def rejectReq():
    user = request.form['user']
    name = request.cookies.get("name")
    pw = request.cookies.get("pw")
    if auth(name, pw):
        friends = data[user]['friends']
        if name in friends:
            return ""
        elif name in data[user]["sent"]:
            data[user]["sent"].remove(name)
            data[name]["recived"].remove(user)
            saveJson()
            return ""
        elif name in data[user]['recived']:
            return ""
        else:
            return ""

    
    return ""

@app.route('/unfriend', methods=['POST'])
def unfriend():
    user = request.form['user']
    name = request.cookies.get("name")
    pw = request.cookies.get("pw")
    if auth(name, pw):
        friends = data[user]['friends']
        if name in friends:
            data[user]['friends'].remove(name)
            data[name]["friends"].remove(user)
            saveJson()
            return ""
        elif name in data[user]["sent"]:
            return ""
        elif name in data[user]['recived']:
            return ""
        else:
            return ""

    
    return ""

@app.route('/get-reqs')
def get_friend_requests():
    name = request.cookies.get("name")
    pw = request.cookies.get("pw")
    res = {}
    if auth(name, pw):
        for user in data[name]['recived']:
            res[user] = {
                "status":status[user],
                "pfp":data[user]['pfp'],
                "isbd":data[user]['birthday'].replace("-", "|", 1).split("|")[1] == str(datetime.datetime.now().strftime("%m-%d"))
                }
        return jsonify({"res":res})
    return "False"

@app.route('/set-status', methods=['POST'])
def set_status():
    username = request.cookies.get("name")
    pw = request.cookies.get("pw")
    wantedStatus = request.form.get("status")
    print(username,wantedStatus)
    if auth(username, pw) and wantedStatus in ["online", "offline"]:
        status[username] = wantedStatus
        saveJson()
        return "success"
    
    return "error"

@app.route('/get-friends')
def get_friends():
    name = request.cookies.get("name")
    pw = request.cookies.get("pw")
    res = {}
    if auth(name, pw):
        for friend in data[name]['friends']:
            res[friend] = {
                "status":status[friend],
                "pfp":data[friend]['pfp'],
                "isbd":data[friend]['birthday'].replace("-", "|", 1).split("|")[1] == str(datetime.datetime.now().strftime("%m-%d"))
                }
        return jsonify({"res":res})
    return "False"


@app.route('/get-room-code_user=<targetName>')
def getRoomCode(targetName):
    targetName = targetName.replace(" 🎂", "")

    return jsonify({"code":data[targetName]["currentRoom"]})

@app.route('/flash=<flashMessage>_url=<url>')
def customFlash(flashMessage, url):
    url = "/" if url == "EMPTY" else "/" + url
    flash(flashMessage)
    return redirect(url)

@app.route("/send-invite=<user>/<room>")
def send_invite(user, room):
    name = request.cookies.get("name")
    pw = request.cookies.get("pw")
    if auth(name, pw):
        if user in data.keys():
            data[user]["invite"] = {"user":name,"room":room}
            saveJson()            
            return "success"

@app.route("/get-invs")
def get_invs():
    name = request.cookies.get("name")
    pw = request.cookies.get("pw")
    if auth(name, pw):
        r = data[name]["invite"]
        data[name]["invite"] = ""
        saveJson()
        return jsonify({"res":r})
        

@app.route('/get-user-status_user=<targetUser>')
def getUserStatus(targetUser):
    targetUser = targetUser.replace(" 🎂", "")
    return jsonify({"res":status[targetUser]})

@app.route('/get-user-status-list_list=<friendList>')
def getUserStatusList(friendList):
    friendList = friendList.split(",")
    res = {}
    for friend in friendList:
        res[friend] =  status[friend]

    return jsonify(res) 


@app.route('/generate-room-id')
def generateRoomId():
    generatedUuid = uuid()
    print(generatedUuid)
    return jsonify({"res":generatedUuid})


if __name__ == '__main__':
    app.run(host='localhost', port=8000 ,debug=True)
    # app.run(host='0.0.0.0', port=8080 ,debug=True)

#Made by Fepz (Kar1m, Kimo)