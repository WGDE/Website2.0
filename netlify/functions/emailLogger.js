exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        let data;
        const contentType = event.headers['content-type'] || event.headers['Content-Type'];

        // Checking if the content type is JSON and parsing accordingly
        if (contentType === 'application/json') {
            data = JSON.parse(event.body);
        } else {
            data = event.body; // Handle non-JSON content types appropriately
        }

        if (!data.email) {
            throw new Error("Email is required");
        }

        // Specify the path where data should be written
        // Note: Consider using a database or a cloud storage for production
        const pathToFile = path.join('/tmp', 'email_log.json');
        let emails = [];

        try {
            emails = JSON.parse(await fs.readFile(pathToFile, 'utf-8'));
        } catch (error) {
            emails = []; // If file does not exist, start with an empty array
        }

        emails.push({ email: data.email, timestamp: new Date().toISOString() });
        await fs.writeFile(pathToFile, JSON.stringify(emails, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email logged successfully" })
        };
    } catch (error) {
        console.error("Error processing request:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to process email", details: error.message })
        };
    }
};
