import parsePhoneNumber from 'libphonenumber-js';
import twilio from 'twilio';

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const formatPhoneNumber = (phoneNumber: string): string => {
  const formattedNumber = parsePhoneNumber(phoneNumber, 'US');

  if (!formattedNumber || !formattedNumber.isValid()) {
    throw new Error('Invalid phone number format');
  }

  return formattedNumber.format('E.164');
};

export const sendText = async (toNumber: string | string[], body: string): Promise<void> => {
  try {
    if (Array.isArray(toNumber)) {
      await Promise.allSettled(
        toNumber.map((number) =>
          twilioClient.messages.create({
            body,
            to: formatPhoneNumber(number),
            from: process.env.TWILIO_NUMBER,
          })
        )
      );
    } else {
      await twilioClient.messages.create({
        body,
        to: formatPhoneNumber(toNumber),
        from: process.env.TWILIO_NUMBER,
      });
    }
  } catch (err) {
    console.error(err, 'Could not text', toNumber);
    throw err;
  }
};
