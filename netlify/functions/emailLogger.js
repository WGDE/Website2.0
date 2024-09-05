exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { email } = JSON.parse(event.body);
        // Here you would typically handle the email, e.g., store it in a database or a file
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email received successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process email', details: error.message })
        };
    }
};
