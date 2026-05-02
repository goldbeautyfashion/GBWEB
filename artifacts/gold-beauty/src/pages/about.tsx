import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-screen bg-[#FFF5F8]"
    >
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-white">
        <div className="absolute inset-0">
          <img 
            src="/images/lifestyle-1.png" 
            alt="Gold Beauty Editorial" 
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1571781404179-88b1f8fa5ab6?q=80&w=2072&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/90 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="w-12 h-[1px] bg-primary"></div>
            <p className="text-primary text-xs md:text-sm tracking-[0.4em] uppercase font-semibold">
              Our Heritage
            </p>
            <div className="w-12 h-[1px] bg-primary"></div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight text-foreground text-shadow-sm"
          >
            Redefining Sri Lankan <br className="hidden md:block"/> <span className="italic text-primary">Luxury Beauty.</span>
          </motion.h1>
        </div>
      </div>

      {/* Brand Story */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">The Vision</h2>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                Gold Beauty Fashion was born out of a desire to create a cosmetics brand that truly understands and celebrates the diverse complexions of South Asian women. For too long, luxury beauty felt imported and disconnected from our climate, our skin tones, and our culture.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                We set out to change that. Every formulation is meticulously crafted not just for aesthetic perfection, but for endurance in tropical weather, delivering an opulent experience that lasts.
              </p>
              <div className="pt-8 border-t border-border mt-8">
                <p className="text-primary font-bold tracking-[0.2em] uppercase text-xs">
                  Established 2024 • Colombo, Sri Lanka
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-white border border-border p-6 shadow-xl relative z-10">
                <img 
                  src="/images/cat-skincare.png" 
                  alt="Gold Beauty Products" 
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
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
      <section className="py-24 md:py-32 bg-white border-y border-border shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center flex-col-reverse md:flex-row-reverse">
            
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="order-1 md:order-2 space-y-8"
            >
              <div>
                <p className="text-primary text-xs tracking-[0.3em] font-semibold uppercase mb-2">The Founder</p>
                <h2 className="font-serif text-4xl md:text-5xl text-foreground">Shani Ranasinghe</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                A veteran in the Sri Lankan fashion and beauty industry, Shani realized that local women were compromising between high-end international brands that didn't suit the climate, and local brands that lacked the premium feel.
              </p>
              <p className="text-foreground font-serif italic leading-relaxed text-xl md:text-2xl mb-10 border-l-2 border-primary pl-6 py-2 bg-[#FFF5F8] p-6 shadow-sm">
                "I wanted to build a house of beauty where every touchpoint feels expensive, but the product genuinely performs for us. Gold Beauty is unapologetic. It's for the woman who wants to be seen, who commands the room, and who appreciates the fine details."
              </p>
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_of_John_Hancock.svg" alt="Signature" className="h-16 opacity-80 mix-blend-multiply" style={{ filter: 'sepia(100%) hue-rotate(5deg) saturate(300%) contrast(150%) brightness(80%)' }} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="order-2 md:order-1 relative"
            >
              <div className="aspect-square md:aspect-[3/4] bg-[#FFF5F8] border border-border p-6 shadow-xl relative z-10">
                <img 
                  src="/images/founder.png" 
                  alt="Shani Ranasinghe" 
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105 grayscale-[30%] hover:grayscale-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop";
                  }}
                />
              </div>
              <div className="absolute -top-8 -left-8 w-full h-full bg-primary/10 border border-primary/20 -z-10" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary text-xs tracking-[0.3em] font-semibold uppercase mb-4">Our Commitment</p>
            <h2 className="font-serif text-4xl md:text-6xl mb-20 text-foreground">The Gold Standard</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                title: "Uncompromising Quality",
                desc: "Formulated with the finest ingredients sourced globally, designed to perform exceptionally."
              },
              {
                title: "Inclusive Radiance",
                desc: "Shades and textures developed specifically honoring the South Asian skin spectrum."
              },
              {
                title: "Ethical Luxury",
                desc: "100% cruelty-free formulations packaged in recyclable, premium materials."
              }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="space-y-6 flex flex-col items-center bg-white p-10 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-[#FFF5F8] flex items-center justify-center text-primary font-serif text-xl border border-primary/20 mb-2">
                  0{i+1}
                </div>
                <h3 className="font-serif text-2xl tracking-wide text-foreground">{value.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}