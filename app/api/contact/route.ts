import { NextResponse } from 'next/server';
import { z } from 'zod'; 
import type { ZodIssue } from 'zod';
import { connectToDB } from '@/lib/mongoose';
import ContactSubmission from '@/lib/models/ContactSubmission';
import { verifyRecaptcha, verifyEmailDeliverability } from '@/lib/server-utils';

// Define the schema for the incoming form data using Zod
// This now includes all fields from your multi-step form.
const contactFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email format.' }),
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  phoneNumber: z.string().optional(),
  message: z.string().min(1, { message: 'Message is required.' }),
  token: z.string(), // reCAPTCHA token
  serviceType: z.string(),
  newProjectPackage: z.string().optional(),
  maintenancePlan: z.string().optional(),
  websiteURL: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

// Infer the TypeScript type from the Zod schema for better type safety
type ContactFormData = z.infer<typeof contactFormSchema>;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = contactFormSchema.safeParse(body);

    if (!parsedData.success) {
      const error = parsedData.error.errors.map((e: ZodIssue) => e.message).join(', ');
      return NextResponse.json({ error }, { status: 400 });
    }

    // Explicitly type the validated data
    const validatedData: ContactFormData = parsedData.data;

    const { token, ...submissionData } = validatedData;

    // Step 1: Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(token);
    if (!recaptchaResult.success) {
      return NextResponse.json({ error: recaptchaResult.message }, { status: 403 });
    }

    // Step 2: Verify Email Deliverability
    const emailValidationResult = await verifyEmailDeliverability(submissionData.email);
    if (!emailValidationResult.success) {
      return NextResponse.json({ error: emailValidationResult.message }, { status: emailValidationResult.status });
    }

    // Step 3: Connect to the database and save the submission
    await connectToDB();
    
    const newSubmission = new ContactSubmission(submissionData);
    await newSubmission.save();

    // Step 4 (Optional): Send an email notification
    // You can add your email sending logic here (e.g., using Resend or Nodemailer)
    // to notify yourself of the new submission.
    console.log('New submission saved to database:', newSubmission._id);

    return NextResponse.json({
      message: "Thank you! Your message has been sent successfully. We'll be in touch soon.",
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}