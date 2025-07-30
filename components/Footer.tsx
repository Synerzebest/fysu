import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#154733] text-white px-6 py-10 text-sm md:text-base mt-36">
      {/* Email Signup */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h2 className="font-bold uppercase mb-2">Sign In Now</h2>
          <input
            type="email"
            placeholder="Enter your email adress"
            className="w-full px-4 py-2 bg-transparent border border-white placeholder-white text-white"
          />
        </div>

        {/* Client Services */}
        <div>
          <h2 className="font-bold uppercase mb-2">Client Services</h2>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Contact Us</a></li>
            <li><a href="#" className="hover:underline">FAQs</a></li>
            <li><a href="#" className="hover:underline">Expedition</a></li>
            <li><a href="#" className="hover:underline">Paiement</a></li>
            <li><a href="#" className="hover:underline">Product Returns</a></li>
          </ul>
        </div>

        {/* Logo */}
        <div className="flex justify-start md:justify-center items-center md:items-start">
          <h1 className="text-5xl font-serif tracking-widest">FYSU</h1>
        </div>
      </div>

      {/* Bottom links */}
      <div className="border-t border-white mt-10 pt-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center md:justify-between text-xs md:text-sm gap-4 md:gap-8 text-center">
          <a href="#" className="hover:underline">BERLGUIM/EN</a>
          <a href="#" className="hover:underline">CONTACT US</a>
          <a href="#" className="hover:underline">WHATSAPP</a>
          <a href="#" className="hover:underline">MESSENGER</a>
          <a href="#" className="hover:underline">FAQ</a>
          <a href="#" className="hover:underline">LEGAL TERMS</a>
          <a href="#" className="hover:underline">SOCIAL</a>
          <a href="#" className="hover:underline">PRIVACY POLICY</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
