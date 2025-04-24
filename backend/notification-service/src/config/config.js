module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    email: {
      apiKey: process.env.EMAIL_API_KEY,
      sender: process.env.EMAIL_SENDER,
      senderName: process.env.EMAIL_SENDER_NAME
    },
    sms: {
      apiKey: process.env.SMS_API_KEY,
      fromNumber: process.env.SMS_FROM_NUMBER
    },
    rateLimits: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  };
  