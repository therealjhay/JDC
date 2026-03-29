import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="text-yellow-400">Premium</span> Watches
            <br />at Your Fingertips
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Browse our exclusive collection of luxury and everyday watches.
            Order instantly via WhatsApp — no account needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors"
            >
              Browse Watches
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 hover:text-gray-900 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '⌚', title: 'Premium Selection', desc: 'Curated collection of the finest watches from top brands worldwide.' },
              { icon: '📱', title: 'Easy WhatsApp Orders', desc: 'Order with a single tap — we process your order via WhatsApp instantly.' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Quick and reliable shipping directly to your doorstep.' },
            ].map((f) => (
              <div key={f.title} className="text-center p-8 rounded-xl bg-gray-50 hover:bg-yellow-50 transition-colors">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to find your perfect watch?</h2>
          <p className="text-gray-400 mb-8">Explore hundreds of styles, from classic to modern.</p>
          <Link
            href="/products"
            className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors"
          >
            View All Watches →
          </Link>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} JDC Watches. All rights reserved.</p>
          <p className="mt-2 text-sm">Order via WhatsApp for the best experience.</p>
        </div>
      </footer>
    </div>
  );
}
