"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface EditorialTextProps {
  text?: string | null;
}

const EditorialText = ({ text }: EditorialTextProps) => {
  const t = useTranslations("landing.editorial");
  const content = text || t("defaultText");

  if (!content) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-serif italic leading-relaxed text-slate-700">
            &ldquo;{content}&rdquo;
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
};

export default EditorialText;
