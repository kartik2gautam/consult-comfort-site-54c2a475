const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_WHATSAPP_FROM; // e.g. 'whatsapp:+1415xxxxxx'

if (!accountSid || !authToken || !from) {
  console.warn('Twilio not fully configured - WhatsApp messages will be skipped');
}

const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

module.exports = async function sendWhatsApp({ to, body }) {
  if (!client) {
    console.warn('Twilio client unavailable, skipping WhatsApp send to', to);
    return;
  }
  const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  return client.messages.create({
    from,
    to: toNumber,
    body
  });
};
