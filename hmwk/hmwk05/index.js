function loadDoggy(){
    fetch("https://dog.ceo/api/breeds/image/random")
        .then(response => response.json())
        .then(data => {document.getElementById("doggy").src= data.message;})
}
function loadJoke(joke){    
    if(joke=="general"){
        fetch("https://official-joke-api.appspot.com/jokes/general/random")
        .then(response => response.json())
        .then(loadDoggy())
        .then(data => {
            console.log(data[0])
            document.getElementById("setup").innerText= data[0].setup
            document.getElementById("punchline").innerText= data[0].punchline
        })
    }else if(joke=="programming"){
        fetch("https://official-joke-api.appspot.com/jokes/programming/random")
        .then(response => response.json())
        .then(loadDoggy())
        .then(data => {
            console.log(data[0])
            document.getElementById("setup").innerText= data[0].setup
            document.getElementById("punchline").innerText= data[0].punchline
        })
    }else if(joke=="knock-knock"){
        fetch("https://official-joke-api.appspot.com/jokes/knock-knock/random")
        .then(response => response.json())
        .then(loadDoggy())
        .then(data => {
            console.log(data[0])
            document.getElementById("setup").innerText= data[0].setup
            document.getElementById("punchline").innerText= data[0].punchline
        })
    }
    console.log("have not picked a joke")
}