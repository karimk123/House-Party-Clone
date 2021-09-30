
    window.addEventListener('load', function(e) {
  if (navigator.onLine) {
    setStatus("online")
  } else {
    setStatus("offline")
  }
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
        // later
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
            console.log($(".fa-bell:first").css("text-shadow"));
            for(let i = 0; i < data.length; i++){
                var currUser = data[i]
                let div = document.createElement("div")
                div.className = "user"
                console.log(resData[currUser])
                /*

                ana => user : remove request (<i class="fas fa-minus-square"></i>)
                user => ana : accept request (<i class="fas fa-user-check"></i>)
                friends : call (<i class="fas fa-phone-alt"></i>), remove friend (<i class="fas fa-user-minus"></i>)
                else: add friend (<i class="fas fa-user-plus"></i>) 
                    
                */
                let btn = document.createElement("span")
                if(resData[currUser] == "me_sent"){ // i sent him
                    btn.className = "fas fa-minus-square userBtns"
                    btn.onclick = () => {
                        removeSentReq(currUser)
                    }
                    btn.id = "rm-req-btn"
                }
                else if(resData[currUser] == "user_sent"){ // i sent him
                    btn.className = "fas fa-user-check userBtns"
                    btn.onclick = () => {
                        acceptReq(currUser)
                    }
                    btn.id = "accept-btn"
                    var rejectBtn = document.createElement("span")
                    rejectBtn.onclick = () => {
                        reject(currUser)
                    }
                    rejectBtn.id = "reject-btn"
                    rejectBtn.className = "fas fa-user-minus userBtns"

                    div.style.width = "300px"

                }
                else if(resData[currUser] == "friends"){ // i sent him
                    btn.className = "fas fa-user-minus userBtns"
                    btn.onclick = () => {
                        unfriend(currUser)
                    }
                    btn.id = "rm-friend-btn"

                    var callBtn = document.createElement("span")
                    callBtn.onclick = () => {
                        // later
                    }
                    callBtn.id = "call-btn"
                    callBtn.className = "fas fa-phone-alt userBtns"

                }else{
                    btn.className = "fas fa-user-plus userBtns"
                    btn.onclick = () => {
                        addFriend(currUser)
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
}

function reRender(name){
    //document.getElementsByClassName("user")[0].getElementsByTagName("span")[0].innerText
    var div = ""
    for(let i = 0; document.getElementsByClassName("user").length>i;i++){

        if(document.getElementsByClassName("user")[i].getElementsByTagName("span")[0].innerText == name){
            div = document.getElementsByClassName("user")[i]
        }
    }
    console.log(div)
    var element = div
	element.parentNode.removeChild(element);
    
}