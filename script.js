const chatGPT = document.getElementById('chatGPT');
const prompt = document.getElementById('prompt');
const answer = document.getElementById('answer');

let noSubmit = false;

let timeOuts = []
let cancelTimeOuts = false;

chatGPT.addEventListener("submit", e=>{
    e.preventDefault();
    if(noSubmit || prompt.value.trim() == ""){
        return false;
    };
    if(timeOuts.length > 0){
        clearTimeOuts();
    }
    noSubmit = true;
    prompt.readOnly = true;
    answer.innerText = "Thinking...";

    const url = "http://localhost:2000/"
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({value: prompt.value})
    }

    fetch(url,params )
    .then((res) => res.json())
    .then((data) => {
        answer.innerText = `${prompt.value}\n\n`;
        if(cancelTimeOuts) cancelTimeOuts = false;
        displayResponse(data)
    })
    .catch(e=>{
        answer.innerText = `Error: ${e.toUpperCase()}`
    })
    .finally(()=>{
        clearPrompt()
    })
})

function clearPrompt(){
    noSubmit = false;
    prompt.readOnly = false;
    prompt.placeholder = "Enter another question/prompt?";
    prompt.value="";
}

function clearTimeOuts(){
    cancelTimeOuts = true;
    answer.innerText = "";

    for(let i = 0; i < timeOuts.length; i++){
        window.clearTimeout(timeOuts[i]);
        if(i == timeOuts.length -1){
            timeOuts = [];
        }
    }
}

function displayResponse(text){
    for(let i = 0; i < text.length; i++){
        if(cancelTimeOuts) return;
        timeOuts.push(setTimeout(()=>{
            answer.innerText += text[i]
            if(i == text.length - 1){
                timeOuts = [];
            }
        }, i * 25));
    }
}