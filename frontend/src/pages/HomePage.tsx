import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const whatsappNumber = import.meta.env.NEXT_PUBLIC_WHATSAPP_NUMBER || import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="text-navy-300">Premium</span> Watches
            <br />at Your Fingertips
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Browse our exclusive collection of luxury and everyday watches.
            Order instantly via WhatsApp — no account needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
              className="bg-navy-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-navy-500 transition-colors focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
            >
              Browse Watches
            </Link>
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-navy-400 text-navy-300 px-8 py-4 rounded-lg font-bold text-lg hover:bg-navy-400 hover:text-navy-900 transition-colors focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
              >
                Chat on WhatsApp
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="border-2 border-gray-600 text-gray-500 px-8 py-4 rounded-lg font-bold text-lg cursor-not-allowed"
              >
                WhatsApp Unavailable
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Fast Delivery', desc: 'Same-week delivery in major cities', icon: '⚡' },
              { title: 'Warranty Support', desc: 'Authentic watches with warranty backing', icon: '🛡️' },
              { title: 'Easy Returns', desc: 'Hassle-free exchanges within 7 days', icon: '↩️' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5">
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
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
              <div key={f.title} className="text-center p-8 rounded-xl bg-gray-50 hover:bg-navy-50 transition-colors">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to find your perfect watch?</h2>
          <p className="text-gray-400 mb-8">Explore hundreds of styles, from classic to modern.</p>
          <Link
            to="/products"
            className="bg-navy-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-navy-500 transition-colors focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
          >
            View All Watches →
          </Link>
        </div>
      </section>

      <footer className="bg-navy-950 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} JDC Watches. All rights reserved.</p>
          <p className="mt-2 text-sm">Order via WhatsApp for the best experience.</p>
        </div>
      </footer>
    </div>
  );
}
