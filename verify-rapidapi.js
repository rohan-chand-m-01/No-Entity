try {
    console.log("Testing RapidAPI...");
    const response = await fetch(url, options);
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
} catch (error) {
    console.error("Error:", error);
}
