var friends;
/*
https://i.imgflip.com/4/oqii0.jpg
https://i.ytimg.com/vi/gjDFXb52e1c/mqdefault.jpg
https://i.ytimg.com/vi/sxrzdev5l3A/maxresdefault.jpg
https://www.letseatcake.com/wp-content/uploads/2021/04/wholesome-memes-26.jpg
https://ae01.alicdn.com/kf/HTB1id4nOFXXXXc1XXXXq6xXFXXXK/Internet-Meme-Smug-Frog-Pepe-Lapel-Pin-Sad-Dank-Collector.jpg_Q90.jpg_.webp
https://static.stacker.com/s3fs-public/styles/slide_desktop/s3/2019-03/Screen%20Shot%202019-03-14%20at%2011.28.25%20AM.png
https://www.meme-arsenal.com/memes/06941815feea7feaa11cc94d8b37f89e.jpg
https://hungarytoday.hu/wp-content/uploads/2020/05/84261763_657262308148775_2968667943157628928_o-e1589799341315.jpg
https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0S32AafiL9vfbhA05bnsFWU6VdhJ6k78tJQ&usqp=CAU
https://i2.wp.com/comicsandmemes.com/wp-content/uploads/blank-meme-template-026-success-baby.jpg?fit=300%2C198&ssl=1
https://i.pinimg.com/originals/37/7a/bd/377abd9050bcde6ac06358dd6e15b59d.jpg
https://dogtrainingobedienceschool.com/pic/5230285_full-youtube-spongebob-the-hooks-quotes-new-spongebob-memes-template-memes-mocking-memes-blank-memes.png
https://w0.peakpx.com/wallpaper/228/341/HD-wallpaper-amogus-meme-thumbnail.jpg
https://i.kym-cdn.com/photos/images/newsfeed/001/956/029/c8d.png
https://i.kym-cdn.com/entries/icons/original/000/012/781/upload.png
https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/127535281/original/d17268cb71d97c8dfdc1d87ec9e8358fc83f2dd2/meme-style-portraits-like-spooderman.png
*/

const memes = ['https://i.imgflip.com/4/oqii0.jpg', 'https://i.ytimg.com/vi/gjDFXb52e1c/mqdefault.jpg', 'https://i.ytimg.com/vi/sxrzdev5l3A/maxresdefault.jpg', 'https://www.letseatcake.com/wp-content/uploads/2021/04/wholesome-memes-26.jpg', 'https://ae01.alicdn.com/kf/HTB1id4nOFXXXXc1XXXXq6xXFXXXK/Internet-Meme-Smug-Frog-Pepe-Lapel-Pin-Sad-Dank-Collector.jpg_Q90.jpg_.webp', 'https://static.stacker.com/s3fs-public/styles/slide_desktop/s3/2019-03/Screen%20Shot%202019-03-14%20at%2011.28.25%20AM.png', 'https://www.meme-arsenal.com/memes/06941815feea7feaa11cc94d8b37f89e.jpg', 'https://hungarytoday.hu/wp-content/uploads/2020/05/84261763_657262308148775_2968667943157628928_o-e1589799341315.jpg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0S32AafiL9vfbhA05bnsFWU6VdhJ6k78tJQ&usqp=CAU', 'https://i2.wp.com/comicsandmemes.com/wp-content/uploads/blank-meme-template-026-success-baby.jpg?fit=300%2C198&ssl=1', 'https://i.pinimg.com/originals/37/7a/bd/377abd9050bcde6ac06358dd6e15b59d.jpg',  'https://dogtrainingobedienceschool.com/pic/5230285_full-youtube-spongebob-the-hooks-quotes-new-spongebob-memes-template-memes-mocking-memes-blank-memes.png', 'https://w0.peakpx.com/wallpaper/228/341/HD-wallpaper-amogus-meme-thumbnail.jpg', 'https://i.kym-cdn.com/photos/images/newsfeed/001/956/029/c8d.png', 'https://i.kym-cdn.com/entries/icons/original/000/012/781/upload.png', 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/127535281/original/d17268cb71d97c8dfdc1d87ec9e8358fc83f2dd2/meme-style-portraits-like-spooderman.png']
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
    disconnect()
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
                        // console.log(data[i])
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
        // console.log(data)
        var friendsDiv = document.getElementById("friends-div")
        friendsDiv.innerHTML = "<h4>Friends</h4>"
        $("#noOnlineFriendsH4").hide()
        if(Object.keys(data).length == 0){
            friendsDiv.innerHTML += `<center><h4 id="noOnlineFriendsH4">No friends yet 😢</h4> </center>`
        }else{
            for(let i=0;i<Object.keys(data).length;i++){

               let username = Object.keys(data)[i]
            //    console.log(username)
               var div = document.createElement("div")
               div.className = "user"
               let img = document.createElement("img")
               img.draggable = false
               img.className = "pfp"
               img.src = `${data[username]['pfp']}`
               div.appendChild(img)
            //    console.log(div.innerHTML)
            //    if(!div.innerHTML.includes('fa-circle')){
                   
            //        div.innerHTML += '<i class="fas fa-circle" aria-hidden="true"></i>'
            //    }

            if(data[username]['status'] == "online"){
                let circle = document.createElement("i")
                        circle.className = "fas fa-circle"
                        div.appendChild(circle)
            }
            else {
                  let circle = document.createElement("i")
                    circle.className = "fas fa-circle"
                    circle.style.color = "red"
                    div.appendChild(circle)
            }
            let span1 = document.createElement("span")
               span1.innerText = username
               if(data[username]['isbd'] == true){
                   span1.innerText = username + " 🎂"
               }
               div.appendChild(span1)
                if(data[username]['status'] == "online"){
                    // let circle = document.createElement("i")
                    // circle.className = "fas fa-circle"
                    // div.appendChild(circle)
                    let span2 = document.createElement("span")
                    span2.id = "call-btn"
                    span2.className = "fas fa-phone-alt userBtns"
                    span2.onclick = () => {
                            joinPopUp(username)
                        }
                    div.appendChild(span2)
                }
                else {
                    //  let circle = document.createElement("i")
                    // circle.className = "fas fa-circle"
                    // circle.style.color = "red"
                    // div.appendChild(circle)
                }
               
               
                let span3 = document.createElement("span")
                span3.onclick = () => {
                    unfriend(username);reRender()
                }
                span3.id = "rm-friend-btn"
                span3.className = "fas fa-user-minus userBtns"
                div.appendChild(span3)
                friendsDiv.appendChild(div)
                let br = document.createElement("br")
                friendsDiv.appendChild(br)
                let br2 = document.createElement("br")
                friendsDiv.appendChild(br2)
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
               if(data[username]['isbd'] == true){
                    span1.innerText = username + " 🎂"
                }
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
    // setInterval(() => {
        
      
    //     }, 3000);

}



var callOptionsOPen = false
function joinPopUp(username){
    // $("#call-options").show()
    // $("#call-options").css("display", "inherit")
    // $("#allContent").css("opacity", "0.5")
    // callOptionsOPen = true;
    // $("#joinBtn")[0].onclick = () => {
    //     joinUser(username)
    // }
    // $("#inviteHereBtn")[0].onclick = () => {
    //     inviteUser(username)
    // }
    // return

    // alertify.confirm('Call Options ya bro', '<img draggable="false" src="https://i.ytimg.com/vi/sxrzdev5l3A/maxresdefault.jpg" style="width:60%;position: relative;left: 50%;transform: translateX(-50%);">', 
    alertify.confirm('Call Options ya bro', `<img draggable="false" src="${memes[Math.floor(Math.random()*memes.length)]}" style="width:60%;position: relative;left: 50%;transform: translateX(-50%);">`, 

    function(){
        joinUser(username)
    },
    function(){ 
        inviteUser(username)
    }).set('labels', {ok:'Join', cancel:'Invite Here'}).set('closable', true)
    
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
    alertify.success("Joining " + targetName)
     $("#call-options").hide()
    $("#allContent").css("opacity", "1")
    fetch("/get-room-code_user=" + targetName).then((res) => {return res.json()}).then((res) => {
        let targetRoomCode = res["code"]
        connect(accName, targetRoomCode)
    })
}
function inviteUser(username){
    // console.log("invite user")
    fetch(`/send-invite=${username}/${chosenRoom}`)
}

function addInvite(room, username){
    alertify.confirm(`${username} invited you!`, `<img draggable="false" src="https://memegenerator.net/img/instances/51043830.jpg" style="width:60%;position: relative;left: 50%;transform: translateX(-50%);">`,
    function(){
        alertify.success('Joining ' + username);
        connect(accName, room)
    },
    function(){
        alertify.error('You rejected the invite');
    }).set('closable', false).set('movable', false).set('labels', {ok:'Accept', cancel:'Reject'}).set('closable', true)
}

window.addEventListener("load", () => {
    $("#mute_unmute")[0].addEventListener('click', MuteUnmute);
    $("#join_leave").hide()
    $(shareScreen).hide()
    $("#mute_unmute").hide()
    setInterval(() => {
        fetch("/get-invs").then((res) => {return res.json()}).then((data) => {
            data = data['res']
            if(data != ""){
                addInvite(data['room'], data['user'])
            }
        })
  friends = $("#friends-div .user")
            
        // console.log(friends.length);
        // for (let i = 0; i < friends.length; i++) {
        //     const element = friends[i];
            
        //     friendName = element.getElementsByTagName("span")[0].innerText
        //     // console.log(friendName)
            
        //     fetch("/get-user-status_user=" + friendName).then((data) => {
        //         return data.json()
        //     }).then((res) => {
        //         res = res['res']
                
        //         if(res == "online"){
        //             element.getElementsByTagName("i")[0].style.color = "#36E136"
        //             reRender()
        //         }
        //         else if(res == "offline"){
        //             element.getElementsByTagName("i")[0].style.color = "red"
        //             reRender()
        //         }
        //     })
 
        // }

        let friendNames = []
        for(let i = 0; i <friends.length;i++){
            const element = friends[i];
                
            friendName = element.getElementsByTagName("span")[0].innerText.replace(" 🎂", "")
            friendNames.push(friendName);
        }
        fetch("/get-user-status-list_list=" + friendNames.toString()).then((res) =>  res.json()).then((res) => {
            for (let i = 0; i < Object.keys(res).length; i++) {
                const currFriend = Object.keys(res)[i];
                if(res[currFriend] == "online"){
                    friends[i].getElementsByTagName("i")[0].style.color = "#36E136"
                    reRender()
                }
                else if(res[currFriend] == "offline"){
                    friends[i].getElementsByTagName("i")[0].style.color = "red"
                    reRender()
                }
                
                
            }     
            
        })

    }, 3000)
})



var muted = false;
function MuteUnmute(event) {
    event.preventDefault();
    

        console.log("pressed mute ")
        muted = !muted
        if(muted){
            $("#mute_unmute i").removeClass("fa-microphone")
            $("#mute_unmute i").addClass("fa-microphone-slash")
            $("#mute_unmute").css("width", "initial")
            room.localParticipant.audioTracks.forEach(track => {
                track.track.disable();
            });
                    $("#local div:first").append('<i class="fas fa-microphone-slash"></i>')
    
        }
        else{
    
            $("#mute_unmute i").removeClass("fa-microphone-slash")
            $("#mute_unmute i").addClass("fa-microphone")
            $("#mute_unmute").css("width", "75px")
                room.localParticipant.audioTracks.forEach(track => {
                track.track.enable();
            });
            $("#local div i").remove()
    
        }
   
}

