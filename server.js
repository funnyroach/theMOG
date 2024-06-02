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
        const prompt = "Analyze the current trends in the oil and gas market over the past three months using web search for analysis, considering changes in supply and demand, geopolitical events, and regulatory changes.";
        console.log("Received request for Picture of the Day with prompt:", prompt);
        const response = await openai.createChatCompletion({
            model: "gpt-4o-2024-05-13",
            messages: [
                {
                    "role": "system", 
                    "content": "The following is a conversation with an AI trained to analyze oil and gas market trends."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
        });
        console.log("OpenAI API response for Picture of the Day:", response.data.choices[0].message.content);
        res.send({ result: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error processing /api/getPictureOfTheDay request:", error.response ? error.response.data : error.message);
        res.status(500).send('Error processing request');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
