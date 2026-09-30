"use client";

import React from 'react';
import { motion } from "framer-motion";

// --- Types ---
export interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  badge?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

// --- Data ---
export const defaultTestimonials: Testimonial[] = [
  {
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

// --- Sub-Components ---
export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 sm:gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <motion.li 
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  whileHover={{ 
                    scale: 1.02,
                    y: -5,
                    boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileFocus={{ 
                    scale: 1.02,
                    y: -5,
                    boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="p-6 sm:p-7 rounded-2xl border border-slate-200/70 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.05)] w-full max-w-[384px] mx-auto transition-all duration-300 flex flex-col justify-between cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-sky-500/30" 
                >
                  <blockquote className="m-0 p-0 flex flex-col justify-between h-full">
                    <p className="font-montserrat text-slate-600 leading-relaxed font-normal m-0 text-[13.5px] sm:text-[14px]">
                      {text}
                    </p>
                    <footer className="flex items-center gap-3 mt-6">
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={`Avatar of ${name}`}
                        className="h-10 w-10 rounded-full object-cover shrink-0 ring-2 ring-slate-100 group-hover:ring-sky-400/30 transition-all duration-300"
                      />
                      <div className="flex flex-col min-w-0 font-montserrat">
                        <cite className="font-montserrat font-semibold not-italic tracking-tight leading-5 text-slate-900 text-sm truncate">
                          {name}
                        </cite>
                        <span className="font-montserrat text-xs text-slate-500 tracking-tight leading-tight mt-0.5 truncate">
                          {role}
                        </span>
                      </div>
                    </footer>
                  </blockquote>
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};

export const TestimonialsSection = ({
  testimonials = defaultTestimonials,
  badge = "CUSTOMER STORIES",
  title = "What Our Users Say",
  subtitle = "Discover how thousands of teams streamline their operations with our platform.",
}: TestimonialsSectionProps) => {
  const colSize = Math.ceil(testimonials.length / 3);
  const firstCol = testimonials.slice(0, colSize);
  const secondCol = testimonials.slice(colSize, colSize * 2);
  const thirdCol = testimonials.slice(colSize * 2);

  return (
    <section 
      aria-labelledby="testimonials-heading"
      className="bg-transparent pt-2 sm:pt-4 lg:pt-5 pb-4 sm:pb-6 lg:pb-8 relative overflow-hidden"
    >
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ 
          duration: 0.7, 
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full relative z-10"
      >
        {/* Header matching exact styling and Montserrat typography */}
        <div className="flex flex-col items-center justify-center max-w-[880px] mx-auto mb-6 sm:mb-8 text-center px-4">
          {/* Eyebrow Pill Badge */}
          <div className="flex justify-center">
            <div className="border border-sky-400/80 px-4 sm:px-5 py-1 sm:py-1.5 rounded-full font-montserrat text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.16em] uppercase text-[#0F1729] bg-transparent">
              {badge}
            </div>
          </div>

          {/* Heading */}
          <h2 
            id="testimonials-heading" 
            className="text-2xl xs:text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-medium font-montserrat tracking-tight leading-tight sm:leading-tight mt-4 sm:mt-5 text-[#0F1729]"
          >
            {title}
          </h2>

          {/* Subtitle */}
          <p className="mt-3 sm:mt-3.5 text-slate-600 text-sm sm:text-base font-normal font-montserrat leading-relaxed max-w-[860px]">
            {subtitle}
          </p>
        </div>

        {/* Animated Marquee Columns with exact 384px card width */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile View: Single column with all testimonials */}
          <div className="block md:hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[640px] overflow-hidden w-full max-w-[384px] mx-auto p-2">
            <TestimonialsColumn testimonials={testimonials} duration={26} className="w-full" />
          </div>

          {/* Desktop & Tablet View: 2 or 3 Parallel Columns */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden w-full p-2">
            <TestimonialsColumn testimonials={firstCol} duration={16} className="w-full" />
            <TestimonialsColumn testimonials={secondCol} duration={20} className="w-full" />
            <TestimonialsColumn testimonials={thirdCol} className="hidden lg:block w-full" duration={18} />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;
