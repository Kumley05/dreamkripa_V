import { query } from './db';

interface EmailConfig {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

interface LeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  program_title?: string;
  education_level?: string;
  city?: string;
  state?: string;
  message?: string;
}

export async function sendEmail({ to, subject, htmlBody, textBody }: EmailConfig): Promise<boolean> {
  // In a production environment, you would use a real email service like:
  // - SendGrid
  // - AWS SES
  // - Mailgun
  // - Nodemailer with SMTP
  // - Resend
  // - Postmark

  // For this implementation, we'll log the email and return success
  // TODO: Integrate with actual email service

  console.log('=== EMAIL NOTIFICATION ===');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Body:', htmlBody);
  console.log('========================');

  // Store in database for logging purposes
  try {
    await query(
      `INSERT INTO email_logs (recipient_email, subject, body, sent_at, status)
       VALUES (?, ?, ?, NOW(), 'logged')`,
      [to, subject, htmlBody]
    );
  } catch (error) {
    console.error('Error logging email:', error);
  }

  return true;
}

export async function sendNewLeadNotification(leadData: LeadData): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@Sample.com';

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; }
        .footer { background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #777; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🎓 New Lead Received!</h2>
        </div>
        <div class="content">
          <p>A new student has submitted an inquiry through the website.</p>

          <div class="field">
            <div class="label">Student Name:</div>
            <div class="value">${leadData.first_name} ${leadData.last_name}</div>
          </div>

          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${leadData.email}">${leadData.email}</a></div>
          </div>

          ${leadData.phone ? `
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value"><a href="tel:${leadData.phone}">${leadData.phone}</a></div>
          </div>
          ` : ''}

          ${leadData.program_title ? `
          <div class="field">
            <div class="label">Program of Interest:</div>
            <div class="value">${leadData.program_title}</div>
          </div>
          ` : ''}

          ${leadData.education_level ? `
          <div class="field">
            <div class="label">Education Level:</div>
            <div class="value">${leadData.education_level}</div>
          </div>
          ` : ''}

          ${leadData.city || leadData.state ? `
          <div class="field">
            <div class="label">Location:</div>
            <div class="value">${leadData.city || ''} ${leadData.state || ''}</div>
          </div>
          ` : ''}

          ${leadData.message ? `
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${leadData.message}</div>
          </div>
          ` : ''}

          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ds521u300p80.drytis.ai'}/admin" class="button">
            View in Admin Dashboard
          </a>
        </div>
        <div class="footer">
          <p>This email was sent automatically by the Dreamkripa lead generation system.</p>
          <p>Please respond to the lead within 24 hours for best conversion results.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `🔔 New Lead: ${leadData.first_name} ${leadData.last_name}`,
    htmlBody,
  });
}

export async function sendLeadConfirmationEmail(leadData: LeadData): Promise<boolean> {
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; }
        .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #777; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
        .highlight { background: #f0f4ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Welcome to Dreamkripa!</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${leadData.first_name} ${leadData.last_name}</strong>,</p>

          <p>Thank you for your interest in pursuing higher education with us! We have successfully received your inquiry.</p>

          <div class="highlight">
            <strong>📞 What Happens Next?</strong><br><br>
            • Our expert counselor will contact you within 24 hours<br>
            • You'll receive personalized program recommendations<br>
            • We'll guide you through the application process<br>
            • Get answers to all your questions about admissions
          </div>

          <p>If you have any urgent questions, feel free to reach out to us:</p>
          <ul>
            <li>📧 Email: admissions@Sample.com</li>
            <li>📱 Phone: +91 96065 80847</li>
          </ul>

          <p>We're excited to help you achieve your academic dreams!</p>

          <p>Best regards,<br>
          <strong>The Dreamkripa Team</strong></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Dreamkripa. All rights reserved.</p>
          <p>This is an automated email. Please do not reply directly to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: leadData.email,
    subject: 'Thank you for your inquiry! We\'ll be in touch soon',
    htmlBody,
  });
}

// Create email_logs table if it doesn't exist
export async function initEmailService() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recipient_email VARCHAR(255) NOT NULL,
        subject VARCHAR(500),
        body TEXT,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'logged',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  } catch (error) {
    console.error('Error initializing email service:', error);
  }
}
