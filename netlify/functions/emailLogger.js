const { promises: fs } = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Ensure the body is parsed correctly
    const { email } = JSON.parse(event.body);
    if (!email) {
      throw new Error("Email is required");
    }

    const file = path.join(process.env.LAMBDA_TASK_ROOT, 'email_log.json');
    let data;

    try {
      data = JSON.parse(await fs.readFile(file, 'utf-8'));
    } catch (error) {
      data = [];  // If file does not exist or error occurs, start with an empty array
    }

    data.push({ email, timestamp: new Date().toISOString() });
    await fs.writeFile(file, JSON.stringify(data, null, 2));

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
