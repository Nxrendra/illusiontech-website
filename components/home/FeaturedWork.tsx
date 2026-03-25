'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Layers, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PremiumDescription } from '@/components/ui/PremiumDescription';

interface Project {
  title: string;
  description: string;
  tier: string; // This now holds the Service Name (mapped in client-page.tsx)
  serviceId?: string;
  imageUrl: string;
  videoUrl?: string;
  videoWebmUrl?: string;
  link: string;
  tags: string[];
}

interface FeaturedWorkProps {
  heading?: string;
  subheading?: string;
  projects: Project[];
}

export default function FeaturedWork({ heading, subheading, projects }: FeaturedWorkProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#00f0ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#bd00ff]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
          >
            {heading || "Featured Work"}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg sm:text-xl leading-relaxed"
          >
            {subheading || "A glimpse into the digital experiences we create."}
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
          {projects.map((project, index) => {
            // Determine color theme based on service name or position
            const isPremium = project.tier?.toLowerCase().includes('pro') || 
                             project.tier?.toLowerCase().includes('premium') || 
                             project.tier?.toLowerCase().includes('automation') ||
                             index % 2 !== 0;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group relative"
              >
                {/* Browser Mockup Frame */}
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-gray-900/50 backdrop-blur-sm shadow-2xl transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  
                  {/* Browser Header */}
                  <div className="h-8 bg-gray-800/50 border-b border-white/5 flex items-center px-4 gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    <div className="ml-4 flex-1 h-4 bg-white/5 rounded-full max-w-[200px]" />
                  </div>

                  {/* Project Image/Content Area */}
                  <div className="relative aspect-[16/10] bg-black overflow-hidden group">
                    {project.videoUrl || project.videoWebmUrl ? (
                      <video
                        poster={project.imageUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      >
                        {project.videoWebmUrl && <source src={project.videoWebmUrl} type="video/webm" />}
                        {project.videoUrl && <source src={project.videoUrl} type="video/mp4" />}
                      </video>
                    ) : project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-700">
                        <span>Project Preview</span>
                      </div>
                    )}
                    
                    {/* Tier Badge Overlay */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border backdrop-blur-md ${isPremium ? 'bg-[#bd00ff]/20 border-[#bd00ff]/50 text-[#bd00ff]' : 'bg-[#00f0ff]/20 border-[#00f0ff]/50 text-[#00f0ff]'}`}>
                        {isPremium ? <Sparkles size={12} /> : <Layers size={12} />}
                        {project.tier}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 sm:p-8">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00f0ff] transition-colors">{project.title}</h3>
                    <PremiumDescription text={project.description} clampLines={3} className="mb-6" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {project.tags?.map((tag, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400 border border-white/5">{tag}</span>
                        ))}
                      </div>
                      <Link href={project.link || '#'} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#00f0ff] transition-colors">
                        View Live <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}