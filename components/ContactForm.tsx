'use client';

import { Button } from '@/components/ui/Button';
import { useState, FormEvent } from 'react';

/**
 * A client-side component for the contact form.
 * Handles form state and submission.
 */
export default function ContactForm() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Submitting...');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // In a real application, you would send this data to an API endpoint
    // For now, we'll just simulate a network request and log the data.
    console.log('Form data submitted:', data);

    setTimeout(() => {
      setStatus('Your message has been sent successfully!');
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setStatus(''), 3000); // Clear status after 3 seconds
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          name="message"
          id="message"
          rows={4}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
        ></textarea>
      </div>
      <Button type="submit" className="w-full">
        Send Message
      </Button>
      {status && <p className="text-center text-sm text-gray-600 mt-4">{status}</p>}
    </form>
  );
}
