const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

function sendOTP(phoneNumber, otp) {
  return client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: twilioPhoneNumber,
    to: phoneNumber,
  });
}

module.exports = { sendOTP };