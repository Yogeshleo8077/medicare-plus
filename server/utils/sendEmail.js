const sendEmail = async (options) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        sender: { 
          name: 'MediCare Plus', 
          email: process.env.EMAIL_USER 
        },
        to: [
          { email: options.email }
        ],
        subject: options.subject,
        htmlContent: `<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">${options.message.replace(/\n/g, '<br>')}</p>`
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Brevo API Error:', errorData);
      throw new Error(`Email failed: ${errorData}`);
    }

    console.log('Email sent successfully via Brevo HTTP API');
  } catch (error) {
    console.error('sendEmail Error:', error);
    throw error;
  }
};

export default sendEmail;
