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
            model: "gpt-4-1106-preview",
            messages: [
                {
                    "role": "system", 
                    "content": "The following is a conversation with an AI trained to analyze VC market insights and find new product ideas."
                },
                {
                    "role": "user", 
                    "content": `Please read the following scraped from page data, find main data and provide insights: ${textData}`
                },
                {
                    "role": "assistant", 
                    "content": `Given the article text: "${textData}"
                                1) Summarize the article briefly in two sentences, focusing on the main topic and key details.
                                2) What potential startups can be created based on this information? Give 3 examples of products/solutions. 
                                3) Conclude with one sentence on the best course of action or consideration based on the information provided.`
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});