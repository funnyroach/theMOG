let activeTabId = null;

document.addEventListener('DOMContentLoaded', function() {
    let activeTabId;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        activeTabId = tabs[0].id;

        document.getElementById('findDataButton').addEventListener('click', function() {
            console.log("Find Data button clicked."); // Log when button is clicked
            chrome.tabs.sendMessage(activeTabId, {message: "getTitles"});
        });

        document.getElementById('toggleSidebarButton').addEventListener('click', function() {
            chrome.tabs.sendMessage(activeTabId, {action: "toggleSidebar"});
        });

        document.getElementById('downloadButton').addEventListener('click', function() {
            console.log("Download button clicked."); // Log when button is clicked
            chrome.tabs.sendMessage(activeTabId, {message: "getFullText"}, function(response) {
                console.log("Response received:", response); // Log the response
                if (response && response.fullText) {
                    chrome.runtime.sendMessage({action: "processText", textData: response.fullText, tabId: activeTabId}, function(apiResponse) {
                        console.log("API Response:", apiResponse); // Log the API response
                    });
                }
            });
        });
        document.getElementById('FindNewsButton').addEventListener('click', function() {
            chrome.tabs.sendMessage(activeTabId, {action: "updateSidebarRSS", tabId: activeTabId}); // This will send a message to background.js to fetch RSS feed
            //chrome.tabs.sendMessage(activeTabId, {action: "updateDashboard"});
            console.log("News Data button clicked.");
        });
    });
});