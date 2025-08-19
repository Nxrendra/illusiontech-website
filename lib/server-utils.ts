import { z } from 'zod';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const EMAIL_VALIDATION_API_KEY = process.env.EMAIL_VALIDATION_API_KEY;

if (!RECAPTCHA_SECRET_KEY) {
  console.error('CRITICAL: RECAPTCHA_SECRET_KEY is not defined. Some forms may not work.');
}

/**
 * Verifies the reCAPTCHA token from the client.
 */
export async function verifyRecaptcha(token: string): Promise<{ success: boolean; message: string }> {
  if (!RECAPTCHA_SECRET_KEY) {
    return { success: false, message: 'Server reCAPTCHA configuration error.' };
  }
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: 'POST' }
    );
    if (!response.ok) {
      return { success: false, message: 'Failed to connect to reCAPTCHA service.' };
    }
    const data = await response.json();
    if (data.success && data.score >= 0.5) {
      return { success: true, message: 'reCAPTCHA verified.' };
    }
    return { success: false, message: 'Failed reCAPTCHA verification.' };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, message: 'Error during reCAPTCHA verification.' };
  }
}

/**
 * Verifies email deliverability using the Abstract API.
 */
export async function verifyEmailDeliverability(email: string): Promise<{ success: boolean; message: string; status: number }> {
  if (!EMAIL_VALIDATION_API_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('WARN: Email validation API key is missing. Skipping email deliverability check in development.');
      return { success: true, message: 'Skipped in development.', status: 200 };
    }
    console.error('CRITICAL: Email validation API key is missing.');
    return { success: false, message: 'A server configuration error occurred.', status: 500 };
  }

  try {
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${EMAIL_VALIDATION_API_KEY}&email=${email}`
    );
    const data = await response.json();

    if (data.error) {
      console.error('Email Validation API Error:', data.error.message);
      const errorMessage =
        process.env.NODE_ENV === 'production'
          ? 'A server configuration error occurred.'
          : `Email API Error: ${data.error.message}`;
      return { success: false, message: errorMessage, status: 500 };
    }

    if (data.deliverability === 'UNDELIVERABLE') {
      return { success: false, message: 'This email address does not appear to be deliverable.', status: 400 };
    }

    if (data.is_disposable_email?.value === true) {
      return { success: false, message: 'Disposable email addresses are not permitted.', status: 400 };
    }

    return { success: true, message: 'Email is deliverable.', status: 200 };
  } catch (error) {
    console.error('Email validation fetch error:', error);
    return { success: false, message: 'Error during email validation.', status: 500 };
  }
}