import AWS from 'aws-sdk'
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
  
// Create an SNS client
const sns = new AWS.SNS();

const sendSMS = async (mobile_number, otp) => {

    // aws sns
    const phoneNumber = `+91 ${mobile_number}`;
    const message = `<#> Your verification OTP is ${otp}. Please do not share it with anyone."\n`

    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
    };
  
    try {
      const result = await sns.publish(params).promise();
      console.log('SMS sent:', result.MessageId);
      return result;
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };

export {
    sendSMS
}