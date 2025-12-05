const Footer = () => {
  return (
    <div className="bg-pink-50 border-t mt-10">
      <div className="max-w-5xl mx-auto px-5 py-8">

        {/* Brand */}
        <h2 className="text-2xl font-bold text-pink-600 text-center">
          Sweet Bites
        </h2>
        <p className="text-center text-gray-600 text-sm mt-1">
          Freshly baked happiness delivered to your doorstep 🎂✨
        </p>

        {/* Sections */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 text-sm">

          {/* About */}
          <div>
            <h3 className="font-semibold mb-2 text-pink-600">About</h3>
            <ul className="space-y-1 text-gray-700">
              <li>Fresh Cakes</li>
              <li>Custom Designs</li>
              <li>Fast Delivery</li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-2 text-pink-600">Categories</h3>
            <ul className="space-y-1 text-gray-700">
              <li>Birthday Cakes</li>
              <li>Anniversary Cakes</li>
              <li>Kids Cakes</li>
              <li>Designer Cakes</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-2 text-pink-600">Contact</h3>
            <ul className="space-y-1 text-gray-700">
              <li>📞 +91 91008 94542</li>
              <li>📍 Hyderabad, India</li>
              <li>✉️ sweetbites@gmail.com</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-2 text-pink-600">Follow Us</h3>
            <div className="flex gap-4 text-xl text-pink-600">
              <span className="cursor-pointer hover:scale-110 transition">📷</span>
              <span className="cursor-pointer hover:scale-110 transition">👍</span>
              <span className="cursor-pointer hover:scale-110 transition">▶️</span>
            </div>
          </div>

        </div>

        {/* Bottom note */}
        <p className="text-center text-gray-500 text-xs mt-8">
          © {new Date().getFullYear()} Sweet Bites. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Footer;
