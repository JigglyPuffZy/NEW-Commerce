// sendSMS/index.js
const express = require('express');
const twilio = require('twilio');
const router = express.Router();

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

router.post('/send-sms', async (req, res) => {
  const { phoneNumber, verificationCode } = req.body;

  try {
    const message = await client.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    console.log(`Message sent: ${message.sid}`);
    res.status(200).json({ message: 'Code sent successfully!', verificationCode });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send code' });
  }
});

module.exports = router;
