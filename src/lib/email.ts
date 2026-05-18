import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'srinivasakalyanamcommitte@gmail.com',
    pass: process.env.EMAIL_PASS, // User must set this App Password in .env
  },
});

export const sendConfirmationEmail = async (
  toEmail: string,
  ticketType: string,
  quantity: number,
  name: string
) => {
  let subject = '';
  let html = '';

  if (ticketType === 'yajamani') {
    subject = 'Srinivasakalyanam - Yajamani Ticket Confirmation';
    html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Thank you for your Yajamani Booking, ${name}!</h2>
        <p>We have successfully received your payment for <strong>${quantity} Yajamani ticket(s)</strong>.</p>
        <p>We look forward to seeing you at the Srinivasakalyanam event.</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>Srinivasakalyanam Committee</strong></p>
      </div>
    `;
  } else {
    subject = 'Srinivasakalyanam - Ticket Confirmation';
    const typeLabel = ticketType === 'free' ? 'Free' : 'Normal';
    html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Thank you for your Booking, ${name}!</h2>
        <p>Your booking for <strong>${quantity} ${typeLabel} ticket(s)</strong> is confirmed.</p>
        <p>We look forward to seeing you at the Srinivasakalyanam event.</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>Srinivasakalyanam Committee</strong></p>
      </div>
    `;
  }

  try {
    await transporter.sendMail({
      from: `"Srinivasakalyanam Committee" <${process.env.EMAIL_USER || 'srinivasakalyanamcommitte@gmail.com'}>`,
      to: toEmail,
      subject,
      html,
    });
    console.log(`Confirmation email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
