import twilio from 'twilio';

let twilioClient = null;

try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
} catch (error) {
  console.error('Failed to initialize Twilio Client:', error);
}

/**
 * Send a WhatsApp message using Twilio
 * @param {Object} options 
 * @param {string} options.phone - Patient's phone number
 * @param {string} options.message - The message body
 */
const sendWhatsappMessage = async (options) => {
  if (!twilioClient) {
    console.log('Twilio client not initialized, skipping WhatsApp message.');
    return;
  }

  try {
    let toPhone = options.phone;
    
    // Twilio WhatsApp API requires the 'whatsapp:' prefix and a country code.
    // Assuming +91 (India) if no country code is provided, you may adjust this logic as needed.
    if (!toPhone.startsWith('+')) {
      toPhone = '+91' + toPhone; // Default to India if no code
    }

    const message = await twilioClient.messages.create({
      body: options.message,
      from: process.env.TWILIO_WHATSAPP_NUMBER, // Must include 'whatsapp:' prefix
      to: `whatsapp:${toPhone}`
    });

    console.log(`WhatsApp message sent successfully to ${toPhone}. SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error(`WhatsApp message failed to send to ${options.phone}:`, error);
    throw error;
  }
};

export default sendWhatsappMessage;
