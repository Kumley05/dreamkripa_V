import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

const footerLinks = {
  programs: [
    { name: 'Engineering', href: '/programs?category=engineering' },
    { name: 'Business & Management', href: '/programs?category=business' },
    { name: 'Medical Sciences', href: '/programs?category=medical' },
    { name: 'Computer Applications', href: '/programs?category=computer-apps' },
    { name: 'Arts & Humanities', href: '/programs?category=arts' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'FAQs', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Student Support', href: '/support' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/logo.png"
                alt="Dreamkripa"
                width={56}
                height={56}
                className="h-14 w-14"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold leading-tight">
                  <span className="text-white">Dream</span><span className="text-[#D472BD]">kripa</span>
                </span>
                <span className="text-[9px] text-[#B8C96B] font-bold tracking-[0.18em] uppercase leading-none mt-0.5">
                  Your Gateway to Elite Colleges
                </span>
              </div>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Your Gateway to Elite Colleges. We help students discover their dreams and achieve academic excellence through personalized guidance and support.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#D472BD]" />
                <a href="mailto:admissions@dreamkripa.com" className="hover:text-white transition-colors">
                  admissions@dreamkripa.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#D472BD]" />
                <a href="tel:+919606580847" className="hover:text-white transition-colors">
                  +91 96065 80847
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#B8C96B]" />
                <span>India</span>
              </div>
            </div>
          </div>

          {/* Programs Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Programs</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.programs.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[#D472BD] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[#D472BD] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[#B8C96B] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Dreamkripa. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/dreamkripa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D472BD] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/dreamkripa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D472BD] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/dreamkripa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D472BD] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@dreamkripa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D472BD] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}