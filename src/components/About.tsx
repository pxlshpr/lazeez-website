import Image from "next/image";

export function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/gallery/lazeez_11.jpg"
                alt="Lazeez Gourmet interior"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-burgundy/10 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gold/10 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <p className="text-burgundy font-medium tracking-[0.2em] uppercase text-sm">
              Our Story
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
              From the Kitchens of the
              <span className="text-burgundy"> Middle East</span>
            </h2>
            <div className="space-y-4 text-charcoal-light leading-relaxed">
              <p>
                Lazeez Gourmet brings the tastiest culinary treasures from
                the kitchens of the Middle East to the Maldives. More than
                just a restaurant, we are a collection of gastronomic
                experiences transported from the heart of the Levant.
              </p>
              <p>
                Using grandmother-approved traditional cooking techniques
                and the most natural, quality ingredients sourced from
                spectacular locations across the Middle East, every dish
                tells a story of heritage and passion.
              </p>
              <p>
                From our signature hummus and freshly baked pita to
                slow-cooked stews and aromatic grills, each plate is a
                journey through centuries of culinary tradition.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-cream-dark">
              {[
                { value: "100+", label: "Dishes" },
                { value: "5+", label: "Years" },
                { value: "4.6", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-burgundy">
                    {stat.value}
                  </p>
                  <p className="text-sm text-charcoal-light mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
