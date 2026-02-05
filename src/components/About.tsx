import { motion } from "framer-motion";
import { Shield, Heart, Globe, Award } from "lucide-react";

interface AboutProps {
  primaryColor?: string | null;
  title?: string | null;
  text1?: string | null;
  text2?: string | null;
  statsYears?: string | number | null;
  statsDestinations?: string | number | null;
  statsTravelers?: string | number | null;
  statsRating?: string | number | null;
}

const About = ({
  primaryColor,
  title,
  text1,
  text2,
  statsYears,
  statsDestinations,
  statsTravelers,
  statsRating,
}: AboutProps) => {
  const stats = [
    { value: statsYears, label: "Años" },
    { value: statsDestinations, label: "Destinos" },
    { value: statsTravelers, label: "Viajeros" },
    { value: statsRating, label: "Rating" },
  ].filter((stat) => stat.value !== null && stat.value !== undefined && String(stat.value).trim() !== "");

  const icons = [Shield, Heart, Globe, Award];

  return (
    <section id="nosotros" className="py-24 md:py-28 lg:py-32 relative section-gradient scroll-mt-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full glass-card text-sm text-white/70 mb-4"
              style={
                primaryColor
                  ? {
                      borderColor: "color-mix(in srgb, " + primaryColor + " 35%, transparent)",
                      backgroundColor: "color-mix(in srgb, " + primaryColor + " 12%, transparent)",
                    }
                  : undefined
              }
            >
              Sobre nosotros
            </span>
            {title && (
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                {title}
              </h2>
            )}
            {text1 && (
              <p className="text-white/70 text-lg mb-6 leading-relaxed">
                {text1}
              </p>
            )}
            {text2 && (
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                {text2}
              </p>
            )}

            {/* Stats */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 rounded-2xl glass-card">
                    <div className="text-3xl font-bold gradient-text-ocean">{stat.value}</div>
                    <div className="text-sm text-white/60 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Values Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {icons.map((Icon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl glass-card border border-white/10 hover:border-white/30 transition-all duration-300 group flex items-center justify-center min-h-[140px]"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{
                    background: primaryColor
                      ? `linear-gradient(135deg, color-mix(in srgb, ${primaryColor} 20%, transparent), color-mix(in srgb, ${primaryColor} 10%, transparent))`
                      : "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(34,211,238,0.2))",
                  }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: primaryColor || "#7dd3fc" }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
