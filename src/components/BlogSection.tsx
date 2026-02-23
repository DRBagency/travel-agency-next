"use client";

import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/landing/ScrollReveal";

interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  extracto?: string | null;
  imagen_url?: string | null;
  categoria?: string | null;
  autor_nombre?: string | null;
  autor_avatar?: string | null;
  published_at?: string | null;
}

interface BlogSectionProps {
  posts: BlogPost[];
  primaryColor?: string | null;
}

const BlogSection = ({ posts, primaryColor }: BlogSectionProps) => {
  const t = useTranslations("landing.blog");
  const accentColor = primaryColor || "#1CABB0";

  if (!posts || posts.length === 0) return null;

  const displayPosts = posts.slice(0, 4);

  return (
    <section className="py-24 md:py-28 lg:py-32 bg-white">
      <div className="container mx-auto px-4">
        {/* Split header */}
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 max-w-lg">
              {t("title")}
            </h2>
            <div className="max-w-md">
              <p className="text-slate-500 text-lg mb-4">
                {t("description")}
              </p>
              <span
                className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer transition-colors duration-300"
                style={{ color: accentColor }}
              >
                {t("cta")}
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Blog cards grid */}
        <ScrollReveal delay={0.15}>
          <div className="grid md:grid-cols-2 gap-8">
            {displayPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-slate-100"
              >
                {/* Image */}
                {post.imagen_url && (
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={post.imagen_url}
                      alt={post.titulo}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {post.categoria && (
                      <div
                        className="absolute top-4 start-4 rounded-full px-3 py-1 text-xs font-semibold text-white"
                        style={{ backgroundColor: accentColor }}
                      >
                        {post.categoria}
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {post.published_at && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.published_at).toLocaleDateString()}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                    {post.titulo}
                  </h3>
                  {post.extracto && (
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                      {post.extracto}
                    </p>
                  )}

                  {/* Author + Read more */}
                  <div className="flex items-center justify-between">
                    {post.autor_nombre && (
                      <div className="flex items-center gap-2">
                        {post.autor_avatar ? (
                          <Image
                            src={post.autor_avatar}
                            alt={post.autor_nombre}
                            width={28}
                            height={28}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: accentColor }}
                          >
                            {post.autor_nombre.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs text-slate-500 font-medium">
                          {post.autor_nombre}
                        </span>
                      </div>
                    )}
                    <span
                      className="inline-flex items-center gap-1 text-sm font-semibold transition-colors"
                      style={{ color: accentColor }}
                    >
                      {t("readMore")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BlogSection;
