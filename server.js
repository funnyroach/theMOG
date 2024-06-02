require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const OpenAIAPI  = require('openai');

const app = express();
app.use(bodyParser.json());

const openai = new OpenAIAPI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/analyze', async (req, res) => {
    try {
        const textData = req.body.text;
        console.log("Received text for analysis:", textData);
        const response = await openai.chat.completions.create({
            model: "gpt-4o-2024-05-13",
            messages: [
                {
                    "role": "system", 
                    "content": "The following is a conversation with an AI trained to analyze oil and gas market insights."
                },
                {
                    "role": "user", 
                    "content": `Please read the following scraped from page data, find main data and provide insights: ${textData}`
                },
                {
                    "role": "assistant", 
                    "content": `Given the article text: "${textData}"
                                1) Summarize the article briefly in two sentences, focusing on the main topic and key details.
                                2) Analyze and state in one sentence how the information in the article strategically affects the oil and gas market.
                                3) Describe in one sentence the operational impact of the article's content on the market.
                                4) Conclude with one sentence on the best course of action or consideration based on the information provided.`
                }
            ],
        });
        console.log("OpenAI API response:", response.choices[0].message.content);
        res.send({ result: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request');
    }
});
app.post('/api/getPictureOfTheDay', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        console.log("Received prompt for Picture of the Day:", prompt);
        const response = await openai.chat.completions.create({
            model: "gpt-4o-2024-05-13",
            messages: [
                {
                    "role": "system", 
                    "content": "The following is a conversation with an AI trained to analyze oil and gas market trends."
                },
                {
                    "role": "user", 
                    "content": "1) Analyze the current trends in the oil and gas market over the past three days using web search for analysis, considering changes in supply and demand, geopolitical events, and regulatory changes. 2) Based on historical data and current trends, forecast oil prices for the next month using web search for analysis, considering seasonal fluctuations and global demand forecasts. 3) Analyze Twitter data with the hashtag #OilPrices over the past 3 days and determine the main user sentiments. What key topics are being discussed, and how might this affect the market?"
                }
            ],
        });
        console.log("OpenAI API response for Picture of the Day:", response.data.choices[0].message.content);
        res.send({ result: response.data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
