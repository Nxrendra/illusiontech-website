'use client';

import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

const processSteps = [
    { name: 'Discover', description: 'In-depth discussion about project goals and audience to craft a winning strategy.' },
    { name: 'Plan', description: 'Scope definition, project strategy, and information architecture blueprints are created.' },
    { name: 'Design', description: 'High-fidelity design mockups, prototypes, and brand integration exploration.' },
    { name: 'Build', description: 'Front-end and back-end development, bringing the designs to life with rigorous testing.' },
    { name: 'Launch', description: 'Deployment to production servers and final handover.' },
    { name: 'Refine', description: 'Post-launch monitoring, maintenance, and ongoing improvements.' },
];

const stepVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: 'spring',
            bounce: 0.3,
            duration: 0.8,
        },
    },
};

const stepVariantsRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: 'spring',
            bounce: 0.3,
            duration: 0.8,
        },
    },
};

const stepVariantsMobile: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            bounce: 0.3,
            duration: 0.8,
        },
    },
};

export default function ProcessTimeline() {
    const timelineRef = useRef(null);
    const isMobile = useIsMobile();
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start center", "end center"]
    });

    // The line will draw as the timeline section scrolls into view
    const lineProgress = useTransform(scrollYProgress, [0, 0.9], [0, 1]); // End drawing a bit early

    return (
        <section className="py-20 md:py-28 bg-muted overflow-hidden" ref={timelineRef}>
            <div className="container">
                <motion.h2
                    className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.5 }}
                    variants={{ hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                >
                    Our Collaborative Process
                </motion.h2>
                
                <div className="relative">
                    {/* The central line with drawing animation */}
                    <motion.div 
                        className="absolute left-4 md:left-1/2 top-0 h-full w-1 bg-accent origin-top -translate-x-1/2"
                        style={{ scaleY: lineProgress }}
                    />

                    {processSteps.map((step, index) => (
                        <motion.div 
                            key={step.name} 
                            className="relative mb-12"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.5 }}
                            variants={isMobile ? stepVariantsMobile : (index % 2 === 0 ? stepVariants : stepVariantsRight)}
                        >
                            {/* The dot on the line */}
                            <div className="absolute left-4 md:left-1/2 top-1 -translate-x-1/2 z-10">
                                <div className="flex items-center justify-center w-8 h-8 bg-accent text-white rounded-full text-lg font-bold ring-8 ring-muted">
                                    {index + 1}
                                </div>
                            </div>

                            {/* The content card */}
                            <div
                                className={`w-[calc(100%-4rem)] ml-16 md:w-5/12 ${index % 2 === 0 ? 'md:ml-0' : 'md:ml-[58.333333%]'}`}
                            >
                                <div className="bg-card p-6 rounded-xl shadow-lg border border-border transition-all duration-300 hover:shadow-2xl hover:border-accent/50">
                                    <h3 className="text-xl font-bold text-card-foreground mb-2">{step.name}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
