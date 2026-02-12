import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-burgundy font-medium tracking-[0.2em] uppercase text-sm mb-3">
            Get In Touch
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">
            Visit Us
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-burgundy/10 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="text-burgundy" size={24} />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Location</h3>
              <p className="text-charcoal-light text-sm leading-relaxed">
                H. Thiyara, Male&apos; 20081, Maldives
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-burgundy/10 rounded-xl flex items-center justify-center mb-4">
                <Phone className="text-burgundy" size={24} />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Phone</h3>
              <a
                href="tel:+9607782460"
                className="text-charcoal-light text-sm hover:text-burgundy transition-colors block"
              >
                +960 778 2460
              </a>
              <a
                href="tel:+9603350505"
                className="text-charcoal-light text-sm hover:text-burgundy transition-colors block"
              >
                +960 335 0505
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-burgundy/10 rounded-xl flex items-center justify-center mb-4">
                <Clock className="text-burgundy" size={24} />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Hours</h3>
              <p className="text-charcoal-light text-sm">
                SAT-THU: 12 PM - 12 AM
              </p>
              <p className="text-charcoal-light text-sm">
                FRI: 3 PM - 12 AM
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-burgundy/10 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="text-burgundy" size={24} />
              </div>
              <h3 className="font-semibold text-charcoal mb-2">WhatsApp</h3>
              <a
                href="https://wa.me/9607782460"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal-light text-sm hover:text-burgundy transition-colors"
              >
                Message us on WhatsApp
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-sm h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.9!2d73.5!3d4.175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMTAnMzAuMCJOIDczwrAzMCcwMC4wIkU!5e0!3m2!1sen!2smv!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lazeez Gourmet Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
