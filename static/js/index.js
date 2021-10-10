
    window.addEventListener('load', function(e) {
  if (navigator.onLine) {
    setStatus("online")
  } else {
    setStatus("offline")
  }

  $("#username").val(accName)
  $("#join_leave").click()


  reRender()
}, false);

window.addEventListener('online', function(e) {
    setStatus("online")
}, false);

window.addEventListener('offline', function(e) {
    setStatus("offline")
}, false);

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    setStatus("offline")
    $('body').mousemove(checkunload);
    e.returnValue = '';
});

function checkunload() {   
  $('body').unbind("mousemove");
  //ADD CODE TO RUN IF CANCEL WAS CLICKED
  setStatus("online")
}

function setStatus(status) {
    let formData = new FormData();
    formData.append('status', status);
    fetch("/set-status", {
        method: 'POST',
        body: formData
    })
}



function addFriend(name){

    let formData = new FormData
    formData.append("user", name)
    fetch("/send-req", {method: "POST",body:formData}).then((res) => {
        search(document.getElementById("search-input").value)
    })


}

function removeSentReq(name){

    let formData = new FormData
    formData.append("user", name)
    fetch("/rm-req", {method: "POST",body:formData}).then((res) => {
        search(document.getElementById("search-input").value)
    })

}
function acceptReq(name){
    let currUser = name
    let formData = new FormData
    formData.append("user", name)
    fetch("/accept-req", {method: "POST",body:formData}).then((res) => {
        search(document.getElementById("search-input").value)
    })
    let div = document.createElement("div")
    div.className = "user"
    let btn = document.createElement("span")

    btn.className = "fas fa-user-minus userBtns"
    btn.onclick = () => {
        unfriend(currUser);
        reRender(currUser)
    }
    btn.id = "rm-friend-btn"

    var callBtn = document.createElement("span")
    callBtn.onclick = () => {
        joinPopUp(currUser)
    }
    callBtn.id = "call-btn"
    callBtn.className = "fas fa-phone-alt userBtns"
    let span = document.createElement("span")
    span.innerText = currUser
    let img = document.createElement("img")
    img.src = "/static/images/default.jpg"
    img.draggable = false
    img.className = "pfp"
    div.appendChild(img)
    div.appendChild(span)
    div.appendChild(callBtn)
    div.appendChild(btn)
    document.getElementById("friends-div").appendChild(div)
    var wantedDiv = ""
    for(let i = 0; i<document.getElementById("notis").getElementsByClassName("user").length;i++){
        if(document.getElementById("notis").getElementsByClassName("user")[i].getElementsByTagName("span")[0].innerText == currUser){
            wantedDiv = document.getElementById("notis").getElementsByClassName("user")[i]
	        wantedDiv.parentNode.removeChild(wantedDiv);

        }
    }

    $("#noOnlineFriendsH4").hide()

}
function unfriend(name){

    let formData = new FormData
    formData.append("user", name)
    fetch("/unfriend", {method: "POST",body:formData}).then((res) => {
        search(document.getElementById("search-input").value)
    })

}
function reject(name){

    let formData = new FormData
    formData.append("user", name)
    fetch("/reject", {method: "POST",body:formData}).then((res) => {
        search(document.getElementById("search-input").value)
    })

}

function search(text){
    if(text == ""){document.getElementById("search-res").innerHTML = ""}
    if(text.replace(/\s/g, '').length != 0){

        let formData = new FormData
        formData.append("text", text)
        fetch("/search", {method:"POST", body:formData}).then((res) => {
            return res.json()
        }).then((data) => {
            let resData = data['resData'] // => {"user1": "normal"}
            data = data['res'] // => [user1, user2, user3, ...]

            document.getElementById("search-res").innerHTML = ""
            if($(".fa-bell:first").css("text-shadow") != "none"){ $("#search-res").html("<hr>")}
            var currUser = "not set"
            for(let i = 0; i < data.length; i++){
                currUser = data[i]
                let div = document.createElement("div")
                div.className = "user"
                /*

                ana => user : remove request (<i class="fas fa-minus-square"></i>)
                user => ana : accept request (<i class="fas fa-user-check"></i>)
                friends : call (<i class="fas fa-phone-alt"></i>), remove friend (<i class="fas fa-user-minus"></i>)
                else: add friend (<i class="fas fa-user-plus"></i>) 
                    
                */
                let btn = document.createElement("span")
                if(resData[data[i]] == "me_sent"){ // i sent him
                    btn.className = "fas fa-minus-square userBtns"
                    btn.onclick = () => {
                        removeSentReq(data[i])
                    }
                    btn.id = "rm-req-btn"
                }
                else if(resData[data[i]] == "user_sent"){ // i sent him
                    btn.className = "fas fa-user-check userBtns"
                    btn.onclick = () => {
                        acceptReq(data[i])
                    }
                    btn.id = "accept-btn"
                    var rejectBtn = document.createElement("span")
                    rejectBtn.onclick = () => {
                        reject(data[i])
                    }
                    rejectBtn.id = "reject-btn"
                    rejectBtn.className = "fas fa-user-minus userBtns"

                    div.style.width = "300px"

                }
                else if(resData[data[i]] == "friends"){ // i sent him
                    btn.className = "fas fa-user-minus userBtns"
                    btn.onclick = () => {
                        unfriend(data[i])
                    }
                    btn.id = "rm-friend-btn"

                    var callBtn = document.createElement("span")
                    callBtn.onclick = () => {
                        joinPopUp(username)
                    }
                    callBtn.id = "call-btn"
                    callBtn.className = "fas fa-phone-alt userBtns"

                }else{
                    btn.className = "fas fa-user-plus userBtns"
                    btn.onclick = () => {
                        console.log(data[i])
                        addFriend(data[i])
                    }
                    btn.id = "add-friend-btn"
                }
                

                let span = document.createElement("span")
                span.innerText = currUser
                let img = document.createElement("img")
                img.src = "/static/images/default.jpg"
                img.draggable = false
                img.className = "pfp"
                div.appendChild(img)
                div.appendChild(span)
                if(resData[currUser] == "friends"){
                    div.appendChild(callBtn)
                }
                if(resData[currUser] == "user_sent"){
                    div.appendChild(rejectBtn)
                }
                div.appendChild(btn)
                document.getElementById("search-res").appendChild(div)
                document.getElementById("search-res").appendChild(document.createElement("br"))
                
    
            }
            if(data.length == 0){
                document.getElementById("search-res").innerHTML = "<h3>No results found!</h3>"
                if($(".fa-bell:first").css("text-shadow") != "none"){ $("#search-res").html("<hr style=\"width:204%\"><h3> No results found!</h3>")}
            }
        
    
        })
    }

    

}


var notiToggle = false;
function Notis (){ 
    notiToggle = !notiToggle;
    $("#notis").slideToggle()
    $("#notis-circle").hide()
    $(".fa-bell").css("text-shadow", notiToggle ? "1px 3px 13px #000000ba": "none" )
    if($("#search-res").html().trim() == ""){
        $("#notis-hr").hide()
    }
    else {
        $("#notis-hr").show()
        

    }
    reRender()
}

function reRender(){
    fetch("/get-friends").then((res) => {return res.json()}).then((data) => { // load friend list
        data = data['res']
        console.log(data)
        var friendsDiv = document.getElementById("friends-div")
        friendsDiv.innerHTML = "<h4>Friends</h4>"
        $("#noOnlineFriendsH4").hide()
        if(Object.keys(data).length == 0){
            friendsDiv.innerHTML += `<center><h4 id="noOnlineFriendsH4">No friends yet 😢</h4> </center>`
        }else{
            for(let i=0;i<Object.keys(data).length;i++){

               let username = Object.keys(data)[i]
               console.log(username)
               var div = document.createElement("div")
               div.className = "user"
               let img = document.createElement("img")
               img.draggable = false
               img.className = "pfp"
               img.src = `${data[username]['pfp']}`
               div.appendChild(img)
               console.log(div.innerHTML)
            //    if(!div.innerHTML.includes('fa-circle')){
                   
            //        div.innerHTML += '<i class="fas fa-circle" aria-hidden="true"></i>'
            //    }
            let span1 = document.createElement("span")
               span1.innerText = username
               div.appendChild(span1)
                if(data[username]['status'] == "online"){
                    let circle = document.createElement("i")
                    circle.className = "fas fa-circle"
                    div.appendChild(circle)
                    let span2 = document.createElement("span")
                    span2.id = "call-btn"
                    span2.className = "fas fa-phone-alt userBtns"
                    span2.onclick = () => {
                            joinPopUp(username)
                        }
                    div.appendChild(span2)
                }
                else {
                     let circle = document.createElement("i")
                    circle.className = "fas fa-circle"
                    circle.style.color = "red"
                    div.appendChild(circle)
                }
               
               
                let span3 = document.createElement("span")
                span3.onclick = () => {
                    unfriend(username);reRender()
                }
                span3.id = "rm-friend-btn"
                span3.className = "fas fa-user-minus userBtns"
                div.appendChild(span3)
                friendsDiv.appendChild(div)
            }
        }

    })
    

    //////////////////////////////////////


    fetch("/get-reqs").then((res) => {return res.json()}).then((data) => { // load notifications
        data = data['res']
        var notis = document.getElementById("notis")
        notis.innerHTML = "<hr><h3>Friend Requests</h3>"
        if(Object.keys(data).length == 0){
            notis.innerHTML += `<h4>No requests.</h4>`
        }else{
            for(let i=0;i<Object.keys(data).length;i++){

               let username = Object.keys(data)[i]
               let div = document.createElement("div")
               div.className = "user"
               let img = document.createElement("img")
               img.draggable = false
               img.className = "pfp"
               img.src = `${data[username]['pfp']}`
               div.appendChild(img)
                // if(data[username]['status'] == "online"){
                //     let circle = document.createElement("i")
                //     circle.className = "fas fa-circle"
                //     div.appendChild(circle)
                // }
               let span1 = document.createElement("span")
               span1.innerText = username
               div.appendChild(span1)
               let span2 = document.createElement("span")
               span2.onclick = () => {
                    acceptReq(username)
               }
               span2.id = "accept-btn"
               span2.className = "fas fa-user-check userBtns"
               div.appendChild(span2)
                let span3 = document.createElement("span")
                span3.onclick = () => {
                    reject(username);reRender()
                }
                span3.id = "reject-btn"
                span3.className = "fas fa-user-minus userBtns"
                div.appendChild(span3)
                notis.appendChild(div)
            }
        }

    })


}



var callOptionsOPen = false
function joinPopUp(username){
    $("#call-options").show()
    $("#call-options").css("display", "inherit")
    $("#allContent").css("opacity", "0.5")
    callOptionsOPen = true;
    $("#joinBtn")[0].onclick = () => {
        joinUser(username)
    }
    $("#inviteHereBtn")[0].onclick = () => {
        inviteUser(username)
    }
    return
    
}
document.addEventListener('mousedown', function(event) {
    if(!callOptionsOPen)return
var isClickInsideElement = $("#call-options")[0].contains(event.target);
if (!isClickInsideElement) {
    $("#call-options").hide()
    $("#allContent").css("opacity", "1")
}
});
function joinUser(targetName){
    fetch("/get-room-code_user=" + targetName).then((res) => {return res.json()}).then((res) => {
        let targetRoomCode = res["code"]
        connect(accName, targetRoomCode)
    })
}
function inviteUser(username){
    console.log("invite user")
    fetch(`/send-invite=${username}/${chosenRoom}`)
}

function addInvite(room, username){
    alertify.confirm(`${username} invited you to join his party!`,
    function(){
        alertify.success('Joining ' + username);
        connect(accName, room)
    },
    function(){
        alertify.error('You rejected the invite');
    }).set('closable', false).set('movable', false)
}

window.addEventListener("load", () => {
    setInterval(() => {
        fetch("/get-invs").then((res) => {return res.json()}).then((data) => {
            data = data['res']
            if(data != ""){
                addInvite(data['room'], data['user'])
            }
        })
    }, 1500)
})