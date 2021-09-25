function search(text){
    let formData = new FormData
    formData.append("text", text)
    fetch("/search", {method:"POST", body:formData}).then((res) => {
        return res.json()
    }).then((data) => {
        data = data['res'] // => [user1, user2, user3, ...]
    document.getElementById("search-res").innerHTML = ""
	for(let i = 0; i < data.length; i++){
		let currUser = data[i]
        let div = document.createElement("div")
        div.className = "user"
        let h3 = document.createElement("h3")
        h3.innerText = currUser
        let img = document.createElement("img")
        img.src = "/static/images/default.jpg"
        img.draggable = false
        img.className = "pfp"
        div.appendChild(h3)
        div.appendChild(img)
        document.getElementById("search-res").appendChild(div)
        

	}
    })
}