import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function ContactTeaser() {
  return (
    <section className="py-20 bg-gray-800 text-white">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Let's Work Together
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Have a project in mind? We'd love to hear about it.
        </p>
        <Button asChild variant="secondary" size="large">
          <Link href="/contact">
            Get In Touch
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}