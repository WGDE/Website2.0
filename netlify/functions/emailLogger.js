const { Storage } = require('@google-cloud/storage');

exports.handler = async (event) => {
  // Decode the base64 service account key environment variable
  const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString('ascii'));

  // Initialize Google Cloud Storage with credentials
  const storage = new Storage({ credentials: credentials });
  const bucket = storage.bucket('emails_info');

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);
    const file = bucket.file(`emails/${Date.now()}.txt`);
    await file.save(`Email: ${email}`, {
      resumable: false
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email logged successfully to Google Cloud Storage' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process email', details: error.message })
    };
  }
};
