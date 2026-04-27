import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const whatsappNumber = import.meta.env.NEXT_PUBLIC_WHATSAPP_NUMBER || import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight">
            <span className="text-accent-400">Premium</span> Watches
            <br className="hidden sm:block" />
            <br className="block sm:hidden" />
            at Your Fingertips
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4 sm:px-0">
            Browse our exclusive collection of luxury and everyday watches.
            Order instantly via WhatsApp — no account needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link
              to="/products"
              className="bg-accent-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-accent-600 transition-colors shadow-sm"
            >
              Browse Watches
            </Link>
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-accent-400 text-accent-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-accent-400 hover:text-primary-900 transition-colors"
              >
                Chat on WhatsApp
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="border-2 border-gray-600 text-gray-500 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg cursor-not-allowed"
              >
                WhatsApp Unavailable
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: 'Fast Delivery', desc: 'Same-week delivery in major cities', icon: '⚡' },
              { title: 'Warranty Support', desc: 'Authentic watches with warranty backing', icon: '🛡️' },
              { title: 'Easy Returns', desc: 'Hassle-free exchanges within 7 days', icon: '↩️' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 sm:gap-4 rounded-lg sm:rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
                <div className="text-xl sm:text-2xl">{item.icon}</div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary-900 mb-8 sm:mb-12">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: '⌚', title: 'Premium Selection', desc: 'Curated collection of the finest watches from top brands worldwide.' },
              { icon: '📱', title: 'Easy WhatsApp Orders', desc: 'Order with a single tap — we process your order via WhatsApp instantly.' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Quick and reliable shipping directly to your doorstep.' },
            ].map((f) => (
              <div key={f.title} className="text-center p-6 sm:p-8 rounded-lg sm:rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors border border-gray-100">
                <div className="text-4xl sm:text-5xl mb-4">{f.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-primary-900 mb-3">{f.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to find your perfect watch?</h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Explore hundreds of styles, from classic to modern.</p>
          <Link
            to="/products"
            className="inline-block bg-accent-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-accent-600 transition-colors shadow-sm"
          >
            View All Watches →
          </Link>
        </div>
      </section>

      <footer className="bg-primary-950 text-gray-400 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} JDC Watches. All rights reserved.</p>
          <p className="mt-2 text-xs sm:text-sm">Order via WhatsApp for the best experience.</p>
        </div>
      </footer>
    </div>
  );
}
