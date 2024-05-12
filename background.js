chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action === "processText") {
        console.log("Received processText request:", request);

        fetch('https://themog.azurewebsites.net/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: request.textData })
        })
        .then(response => response.json())
        .then(data => {
            // Use the tabId from the request instead of sender.tab.id
            console.log("Sending data to tab ID:", request.tabId);
            chrome.tabs.sendMessage(request.tabId, { action: "updateSidebarAnalyze", data: data.result });
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return true; // Indicate an asynchronous response
    }
    if (request.action === "updateSidebarWithTitles") {
        // Assuming you have the tab ID already (perhaps from an earlier interaction or stored)
        let tabId = sender.tab.id; // or however you have tab ID stored
        chrome.tabs.sendMessage(tabId, {action: "updateSidebar", data: request.titles.join('\n')});
    }
    if (request.action === "updateSidebarRSS") {
        console.log("Received updateSidebarRSS request:", request);
        fetch('https://themog.azurewebsites.net/rssData')
            .then(response => response.json())
            .then(rssData => {
                console.log("RSS Data:", rssData.items); // Check the data in the console
                chrome.tabs.sendMessage(request.tabId, { action: "updateRSS", data: rssData.items }); // Make sure sender.tab.id is available
            })
            .catch(error => console.error('Error fetching RSS data:', error));
    }

    
});

