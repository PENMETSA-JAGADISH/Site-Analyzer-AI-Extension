
function getDataOfSite() {
    const completeData = {
        title: document.title,
        url: document.location.href,
        allText: document.body.innerText,
        links: Array.from(document.querySelectorAll("a")).map(a => ({
            label: a.innerText.replace(/\s+/g, ' ').trim(),
            href: a.href
        }))
    };

    return completeData; // RETURN OBJECT (not string)
}

chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
    if (req.type === "getSiteData") {
        try {
            const content = getDataOfSite();
            sendResponse(content);
        } catch (err) {
            console.error("Content script error:", err);
            sendResponse({ error: err.message }); // prevents port close
        }
    }
});