import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="w-full min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="/images/lifestyle-1.png" 
            alt="Gold Beauty Editorial" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1571781404179-88b1f8fa5ab6?q=80&w=2072&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-xs md:text-sm tracking-[0.4em] uppercase mb-6"
          >
            Our Heritage
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight mb-6"
          >
            Redefining Sri Lankan <br className="hidden md:block"/> <span className="italic text-primary">Luxury Beauty.</span>
          </motion.h1>
        </div>
      </div>

      {/* Brand Story */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-serif text-3xl md:text-4xl text-primary">The Vision</h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                Gold Beauty Fashion was born out of a desire to create a cosmetics brand that truly understands and celebrates the diverse complexions of South Asian women. For too long, luxury beauty felt imported and disconnected from our climate, our skin tones, and our culture.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We set out to change that. Every formulation is meticulously crafted not just for aesthetic perfection, but for endurance in tropical weather, delivering an opulent experience that lasts.
              </p>
              <p className="text-foreground font-medium tracking-wide uppercase text-sm pt-4 border-t border-border mt-8 inline-block">
                Established 2024 • Colombo, Sri Lanka
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-card border border-border p-4 relative z-10">
                <img 
                  src="/images/cat-skincare.png" 
                  alt="Gold Beauty Products" 
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=1964&auto=format&fit=crop";
                  }}
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-full h-full bg-primary/10 border border-primary/20 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 md:py-32 bg-card border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center flex-col-reverse md:flex-row-reverse">
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 space-y-6"
            >
              <p className="text-primary text-xs tracking-[0.3em] uppercase">The Founder</p>
              <h2 className="font-serif text-3xl md:text-4xl">Shani Ranasinghe</h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                A veteran in the Sri Lankan fashion and beauty industry, Shani realized that local women were compromising between high-end international brands that didn't suit the climate, and local brands that lacked the premium feel.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-8">
                "I wanted to build a house of beauty where every touchpoint feels expensive, but the product genuinely performs for us. Gold Beauty is unapologetic. It's for the woman who wants to be seen, who commands the room, and who appreciates the fine details."
              </p>
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" alt="Signature" className="h-12 opacity-80 invert brightness-0 contrast-200 sepia" style={{ filter: 'invert(80%) sepia(50%) saturate(1000%) hue-rotate(5deg) brightness(90%)' }} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1 relative"
            >
              <div className="aspect-square md:aspect-[3/4] bg-background border border-border p-4 relative z-10">
                <img 
                  src="/images/founder.png" 
                  alt="Shani Ranasinghe" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop";
                  }}
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-4xl">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">Our Commitment</p>
          <h2 className="font-serif text-3xl md:text-5xl mb-16">The Gold Standard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h3 className="font-sans text-lg font-semibold tracking-wider">Uncompromising Quality</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Formulated with the finest ingredients sourced globally, designed to perform exceptionally.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-sans text-lg font-semibold tracking-wider">Inclusive Radiance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Shades and textures developed specifically honoring the South Asian skin spectrum.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-sans text-lg font-semibold tracking-wider">Ethical Luxury</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">100% cruelty-free formulations packaged in recyclable, premium materials.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
