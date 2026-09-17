import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, email, message, inquiryType, website_url_hp } = req.body || {};
  if (website_url_hp) return res.status(200).json({ ok: true });
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || !message?.trim()) return res.status(400).json({ error: 'Please complete all required fields.' });
  if (message.trim().length < 15) return res.status(400).json({ error: 'Please provide a little more context.' });
  if (!process.env.TREKMAIL_SMTP_USER || !process.env.TREKMAIL_SMTP_PASSWORD || !process.env.CONTACT_RECIPIENT) return res.status(500).json({ error: 'Contact delivery is not configured yet.' });
  const transporter = nodemailer.createTransport({ host: process.env.TREKMAIL_SMTP_HOST || 'smtp.trekmail.net', port: Number(process.env.TREKMAIL_SMTP_PORT || 465), secure: (process.env.TREKMAIL_SMTP_PORT || '465') === '465', auth: { user: process.env.TREKMAIL_SMTP_USER, pass: process.env.TREKMAIL_SMTP_PASSWORD } });
  try {
    await transporter.sendMail({ from: `IVO website <${process.env.TREKMAIL_SMTP_USER}>`, to: process.env.CONTACT_RECIPIENT, replyTo: email, subject: `IVO website: ${inquiryType || 'New message'} from ${name}`, text: `Name: ${name}\nEmail: ${email}\nTopic: ${inquiryType || 'General conversation'}\n\n${message}` });
    return res.status(200).json({ ok: true });
  } catch (error) { console.error('Contact delivery failed', error); return res.status(500).json({ error: 'We could not send your message. Please email directly instead.' }); }
}
