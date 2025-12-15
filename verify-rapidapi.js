
const url = 'https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions';
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com',
        'x-rapidapi-key': 'acf9f5f069mshdc0a762bd431e93p1cef3cjsn4c2f9ee3e0fc'
    },
    body: JSON.stringify({
        messages: [
            {
                role: 'user',
                content: 'Hello, are you working?'
            }
        ],
        model: 'gpt-4o',
        max_tokens: 100,
        temperature: 0.9
    })
};

try {
    console.log("Testing RapidAPI...");
    const response = await fetch(url, options);
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
} catch (error) {
    console.error("Error:", error);
}
