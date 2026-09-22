require('dotenv').config();
const { sendTestConfirmationEmail } = require('./src/services/emailService');

async function main() {
  const targetEmail = process.argv[2] || process.env.SMTP_USER || 'buyer@example.com';

  console.log('====================================================');
  console.log('  LEGENDARY MOTORS — RESEND EMAIL DISPATCH TEST');
  console.log('====================================================');
  console.log(`Target Recipient : ${targetEmail}`);
  console.log(`RESEND_API_KEY   : ${process.env.RESEND_API_KEY ? (process.env.RESEND_API_KEY.slice(0, 7) + '...' + process.env.RESEND_API_KEY.slice(-4)) : 'NOT SET (will test fallback)'}`);
  console.log(`RESEND_FROM      : ${process.env.RESEND_FROM || 'Legendary Motors <onboarding@resend.dev> (default)'}`);
  console.log('----------------------------------------------------');

  try {
    const result = await sendTestConfirmationEmail(targetEmail);
    console.log('\nResult Status:', result.success ? '✓ SUCCESS' : '✗ FAILED');
    console.log('Provider Used:', result.provider);
    if (result.messageId) console.log('Message / Email ID:', result.messageId);
    if (result.previewUrl) console.log('Preview URL (Ethereal):', result.previewUrl);
    if (result.error) console.log('Error Message:', result.error);
    console.log('====================================================');
  } catch (err) {
    console.error('\nExecution Error:', err.message);
  }
}

main();
