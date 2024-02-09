// injectSidebar.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    let sidebar = document.getElementById('myExtensionSidebar');

    if (request.action === "toggleSidebar") {
        if (!sidebar) {
            fetch(chrome.runtime.getURL('sidebar.html'))
                .then(response => response.text())
                .then(data => {
                    let div = document.createElement('div');
                    div.innerHTML = data;
                    div.id = 'myExtensionSidebar';
                    document.body.appendChild(div);
                    console.log("Sidebar added."); // Log when the sidebar is added
                })
                .catch(error => console.error("Error loading sidebar:", error)); // Log any errors
        } else {
            sidebar.remove();
            console.log("Sidebar removed."); // Log when the sidebar is removed
        }
    } else if (request.action === "displayData" && sidebar) {
        // Update sidebar content with the new data
        const contentDiv = sidebar.querySelector('#sidebarContent'); // Make sure you have an element with this ID in your sidebar.html
        if (contentDiv) {
            contentDiv.textContent = request.data;
            console.log("Sidebar content updated:", request.data); // Log the updated content
        } else {
            console.log("No element with ID 'sidebarContent' found."); // Log if the 'sidebarContent' element is not found
        }
    }
});

window.addEventListener('message', function(event) {
    if (event.data.action && event.data.action === 'closeSidebar') {
        let sidebar = document.getElementById('myExtensionSidebar');
        if (sidebar) {
            sidebar.remove();
        }
    }
});
