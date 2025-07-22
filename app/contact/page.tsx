import ContactForm from '@/components/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="bg-gray-50">
      <div className="container py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Get in Touch</h1>
          <p className="mt-4 text-lg text-gray-600">
            We’re here to help and answer any question you might have. We look forward to hearing from you.
          </p>
        </div>

        <div className="mt-16 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-accent/10 p-3 rounded-full flex-shrink-0">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Phone</h3>
                <p className="text-gray-500">Our lines are open 9am - 5pm, Mon - Fri.</p>
                <a href="tel:+1234567890" className="text-accent hover:underline">+1 (234) 567-890</a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-accent/10 p-3 rounded-full flex-shrink-0">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Email</h3>
                <p className="text-gray-500">We'll get back to you within one business day.</p>
                <a href="mailto:hello@illusiontech.dev" className="text-accent hover:underline">hello@illusiontech.dev</a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-accent/10 p-3 rounded-full flex-shrink-0">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Address</h3>
                <p className="text-gray-500">123 Innovation Drive, Tech City, 12345</p>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </main>
  );
}
