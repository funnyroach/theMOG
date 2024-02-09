require('dotenv').config();
const fs = require('fs');
const OpenAI = require('openai-api');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);


// Load your text data
const textData = fs.readFileSync("/Users/stanislavzavershinskii/Downloads/scraped_data.json", "utf8").replace(/\n/g, ' ');

// Send data to OpenAI API
openai.complete({
  engine: 'text-davinci-003', // Updated model name
  prompt: 'Act as an oil and gas market analyst. Read the received data from the scraped page, and highlight the headlines and articles. Analyze them, summarize the information, and conclude a maximum of two sentences.' + textData, // Adding prompt with data
  maxTokens: 1000 
}).then(response => {
  console.log(response.data.choices[0].text); // Print only the GPT response
}).catch(err => {
  console.error(err);
});
