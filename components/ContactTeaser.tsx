import Link from 'next/link';

export default function ContactTeaser() {
  return (
    <section className="py-20 bg-gray-800 text-white">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Have a project in mind? We'd love to hear about it.
        </p>
        <Link href="/contact" className="bg-white hover:bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-full text-lg transition duration-300">
          Get In Touch
        </Link>
      </div>
    </section>
  );
}