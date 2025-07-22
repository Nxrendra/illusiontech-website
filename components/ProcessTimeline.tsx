'use client';

import { motion } from 'framer-motion';

const processSteps = [
    { name: 'Plan', description: 'We define goals, scope, and strategy.' },
    { name: 'Design', description: 'We create wireframes and visual designs.' },
    { name: 'Build', description: 'Our developers bring the designs to life.' },
    { name: 'Launch', description: 'We deploy your project for the world to see.' },
];
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
        },
    },
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};
export default function ProcessTimeline() {
    return (
        <section className="py-20 bg-white">
            <div className="container">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Process</h2>
                <motion.div
                    className="relative flex flex-col items-center md:flex-row md:justify-between md:items-start"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    {/* Desktop horizontal line */}
                    <div className="absolute top-8 left-0 w-full h-0.5 bg-gray-200 hidden md:block"></div>
                    {/* Mobile vertical line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-200 md:hidden"></div>
                    
                    {processSteps.map((step, index) => (
                        <motion.div key={step.name} variants={itemVariants} className="relative z-10 flex flex-col items-center text-center p-4 md:w-1/4 mb-8 md:mb-0">
                            <div className="flex items-center justify-center w-16 h-16 bg-accent text-white rounded-full text-2xl font-bold mb-4">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{step.name}</h3>
                            <p className="text-gray-500">{step.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
