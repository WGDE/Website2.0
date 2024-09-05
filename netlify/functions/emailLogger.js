const { Storage } = require('@google-cloud/storage');
const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('ascii'));

const storage = new Storage({ credentials: credentials });
const bucket = storage.bucket('emails_info');  // Your bucket name

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      throw new Error('Email is required');
    }

    // Create a new file in the bucket with the email content
    const file = bucket.file(`emails/${Date.now()}.txt`);
    
    // Upload the email to the bucket
    await file.save(`Email: ${email}`, {
      resumable: false,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email logged successfully to Google Cloud Storage' })
    };
  } catch (error) {
    // Log the error for troubleshooting
    console.error("Error uploading email to Google Cloud Storage:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process email', details: error.message })
    };
  }
};
