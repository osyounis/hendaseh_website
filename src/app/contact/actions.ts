'use server';

import { Resend } from 'resend';
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(data: ContactFormData) {
  try {
    // Validate on server (defense in depth)
    const validatedData = contactFormSchema.parse(data);

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: 'Hendaseh Contact Form <contact@hendaseh.com>',
      to: 'omar@hendaseh.com',
      replyTo: validatedData.email,
      subject: `Portfolio Contact: ${validatedData.subject}`,
      text: `
Name: ${validatedData.name}
Email: ${validatedData.email}
Subject: ${validatedData.subject}

Message:
${validatedData.message}

---
Sent from Hendaseh portfolio contact form
      `.trim(),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: 'Failed to send email. Please try again.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Contact form error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
