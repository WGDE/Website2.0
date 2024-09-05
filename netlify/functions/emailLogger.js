const { promises: fs } = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const email = JSON.parse(event.body).email;
    const file = path.join(process.env.LAMBDA_TASK_ROOT, 'email_log.json');

    // Read existing data
    let data;
    try {
      data = JSON.parse(await fs.readFile(file, 'utf-8'));
    } catch (error) {
      data = [];  // If file does not exist or error occurs, start fresh
    }

    // Add new email
    data.push({ email, timestamp: new Date().toISOString() });

    // Write back to file
    await fs.writeFile(file, JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email logged successfully" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process email" })
    };
  }
};
