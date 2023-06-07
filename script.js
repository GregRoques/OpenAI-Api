const chatGPT = document.getElementById('chatGPT');
const prompt = document.getElementById('prompt');
const promptType = document.getElementById('GPTselection');
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
    promptType.disabled = true;

    answer.innerHTML = "";
    answer.innerText = "Thinking...";

    const url = "http://localhost:2000/"
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            request: prompt.value,
            request_type: promptType.value
        })
    }

    fetch(url,params )
    .then((res) => res.json())
    .then((data) => {
        answer.innerText= "";
        if(cancelTimeOuts) cancelTimeOuts = false;
        const originalPrompt = prompt.value;
        if(promptType.value == "image"){

            const a = document.createElement('a'); 
            a.href = data;
            a.target = "_blank";

            const img = new Image();
            img.setAttribute("data-src", '')
            img.src = data;
            img.width=200;
            img.height=200;
            img.alt = "OpenAI Generated Image"
            img.title = originalPrompt;
            a.appendChild(img)
            answer.appendChild(a)

            if(img.complete){
                img.classList.add("imgLoaded")
            } else {
                img.addEventListener('load',()=> {
                    img.classList.add("imgLoaded")
                })
            }
        }else{
            answer.innerText = originalPrompt + "\n\n";
            displayResponse(data)
        }
    })
    .catch(e=>{
        answer.innerText = `Error: ${e}`
    })
    .finally(()=>{
        clearPrompt()
    })
})

function clearPrompt(){
    noSubmit = false;
    prompt.readOnly = false;
    promptType.disabled = false;
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
