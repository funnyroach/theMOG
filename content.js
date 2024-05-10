chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Message received:", request); // Log the received message

    if (request.message === "getTitles") {
        let titles = [];
        Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach(header => {
            const keywords = ['oil price', 'crude markets', 'production output', 'Gas Demand', 'Drilling Reports', 'Regulatory Changes', 'OPEC Decisions', 'Energy Transition', 'Renewable Energy', 'Investment Trends', 'Exploration Activities', 'Market Forecasts', 'Supply Chain', 'Environmental Impact', 'Technological Innovation', 'Petrol Prices', 'Diesel Fuel', 'Refinery Capacity', 'Fuel Quality', 'Biofuels', 'LNG', 'Liquefied Natural Gas', 'Pipeline Infrastructure', 'Carbon Emissions', 'Geopolitical Risks', 'Drilling Technology', 'Offshore Exploration', 'Shale Gas', 'Oil Reserves', 'Retail Fuel', 'Transportation Sector', 'Energy Policy', 'Global Demand', 'Oil Sands', 'Hydrocarbons', 'Upstream Operations', 'Downstream Operations', 'Commodity Trading', 'Price Volatility', 'Energy Efficiency', 'Clean Energy Initiatives', 'Oilfield Services', 'Petroleum Economics', 'Risk Management', 'Market Dynamics', 'Industry Regulations', 'Alternative Fuels', 'Emission Standards', 'Fuel Subsidies', 'Fuel', 'Petroleum', 'Petrol', 'Energy', 'Oil', 'fuels', 'Drilling', 'Diesel', 'Offshore', 'Downstream', 'Upstream', 'energy security', 'supply disruptions'];
            if (keywords.some(keyword => header.innerText.toLowerCase().includes(keyword.toLowerCase()))) {
                titles.push(header.innerText); // Add title to the array
                header.style.backgroundColor = "yellow"; // Highlight header with yellow background
            }
        chrome.runtime.sendMessage({action: "updateSidebarWithTitles", titles: titles});
        });
        console.log("Filtered titles:", titles);
    } else if (request.message === "getFullText") {
        let fullText = document.body.innerText;
        console.log("Full text:", fullText); // Log the extracted text
        sendResponse({ fullText: fullText });
    }

    if (request.action === "updateSidebar") {
        let sidebar = document.getElementById('myExtensionSidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.id = 'myExtensionSidebar';
            sidebar.innerHTML = "<div id='sidebarContent'></div>"; // Ensuring the content div is there
            document.body.appendChild(sidebar);
        }
        // Update the sidebar with the data received from background.js
        let sidebarContent = document.getElementById('sidebarContent');
        if (sidebarContent) {
            sidebarContent.textContent = request.data; // Use 'data' to match the property sent from background.js
            console.log("Sidebar content updated with:", request.data);
        }
    }
    if (request.action === "updateSidebarAnalyze") {
        let sidebar = document.getElementById('myExtensionSidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.id = 'myExtensionSidebar';
            sidebar.innerHTML = "<div id='sidebarAnalyzed'></div>"; // Ensuring the content div is there
            document.body.appendChild(sidebar);
        }
        // Update the sidebar with the data received from background.js
        let sidebarContent = document.getElementById('sidebarAnalyzed');
        if (sidebarContent) {
            sidebarContent.textContent = request.data; // Use 'data' to match the property sent from background.js
            console.log("Sidebar content updated with:", request.data);
        }
    }
    if (request.action === "updateRSS") {
        let sidebar = document.getElementById('myExtensionSidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.id = 'myExtensionSidebar';
            sidebar.innerHTML = "<div id='rssFeed'></div>";
            document.body.appendChild(sidebar);
        }

        // Assuming you have a div with id 'rssFeed' in your sidebar for the feed
        let rssFeedDiv = sidebar.querySelector('#rssFeed');
        if (!rssFeedDiv) {
            rssFeedDiv = document.createElement('div');
            rssFeedDiv.id = 'rssFeed';
            sidebar.appendChild(rssFeedDiv);
        }

        // Convert the RSS items into HTML and append to the 'rssFeed' div
        rssFeedDiv.innerHTML = request.data.map(items => `
            <div>
                <h4>${items.title}</h4>
                <p>${items.description}</p>
                <a href="${items.link}" target="_blank">Read more</a>
            </div>>
        `).join('');
    }
});