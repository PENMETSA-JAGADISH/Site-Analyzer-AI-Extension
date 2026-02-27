const sendBtn = document.getElementById("send-btn");
const textBox = document.getElementById("text-box");
const clearText = document.getElementById("clear-btn");
const usermessage = document.getElementsByClassName("user-message")[0];
const aimessage = document.getElementsByClassName("ai-message")[0];

sendBtn.disabled = true


textBox.addEventListener("input", () => {
    const value = textBox.value.trim();
    sendBtn.disabled = value.length === 0;
});

function putdata(aiResponse){
    aimessage.innerText=aiResponse
}

async function DataPost(userInput, data) {
    try {
        const response = await fetch("http://127.0.0.1:8000/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userinput: userInput,
                web_content: data 
            }),
        });

        const result = await response.json();
        console.log("AI Response:", result.reply);
        putdata(result.reply)
        } catch (error) {
        console.error("Error posting data:", error);
    }
}




sendBtn.addEventListener("click", async () => {
    const userInput = textBox.value.trim();
    textBox.value = "";
    usermessage.innerText=userInput
    aimessage.innerText="Analyzing..."
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    try {
        console.log("Tab URL:", tab.url);
        await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
});
        chrome.tabs.sendMessage(tab.id, { type: "getSiteData" }, (data) => {
            if (chrome.runtime.lastError) {
                console.error("Message Error:", chrome.runtime.lastError.message);
            } else {
                console.log("Extracted Data:", data);
                DataPost(userInput,data)
            }
        });
    } catch (err) {
        console.error("Failed to inject or message:", err);
    }
});



clearText.addEventListener("click", () => {
    textBox.value="";
})