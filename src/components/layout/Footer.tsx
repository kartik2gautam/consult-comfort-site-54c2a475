import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="font-serif text-xl font-bold text-gold">K</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">Kaant Clinic</h3>
                <p className="text-xs text-white/60 tracking-wider uppercase">Excellence in Healthcare</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Providing exceptional medical care with a personal touch. Our team of distinguished consultants 
              is committed to your health and wellbeing.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/about" className="text-white/70 hover:text-gold transition-colors text-sm">About Us</Link>
              <Link to="/doctors" className="text-white/70 hover:text-gold transition-colors text-sm">Our Doctors</Link>
              <Link to="/services" className="text-white/70 hover:text-gold transition-colors text-sm">Services</Link>
              <Link to="/book" className="text-white/70 hover:text-gold transition-colors text-sm">Book Appointment</Link>
              <Link to="/contact" className="text-white/70 hover:text-gold transition-colors text-sm">Contact Us</Link>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Our Services</h4>
            <nav className="flex flex-col gap-3">
              <span className="text-white/70 text-sm">General Consultation</span>
              <span className="text-white/70 text-sm">Video Consultation</span>
              <span className="text-white/70 text-sm">Document Review</span>
              <span className="text-white/70 text-sm">Specialist Referrals</span>
              <span className="text-white/70 text-sm">Health Screenings</span>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold mt-0.5" />
                <p className="text-white/70 text-sm">
                  123 Harley Street<br />
                  London, W1G 6AX<br />
                  United Kingdom
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold" />
                <a href="tel:+441234567890" className="text-white/70 hover:text-gold transition-colors text-sm">
                  +44 123 456 789
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold" />
                <a href="mailto:info@kaantclinic.co.uk" className="text-white/70 hover:text-gold transition-colors text-sm">
                  info@kaantclinic.co.uk
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold mt-0.5" />
                <p className="text-white/70 text-sm">
                  Mon - Fri: 8:00 - 20:00<br />
                  Saturday: 9:00 - 17:00<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © 2024 Kaant Clinic. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-white/50 hover:text-gold transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-white/50 hover:text-gold transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-white/50 hover:text-gold transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
