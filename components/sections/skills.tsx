'use client';

import React, { useEffect, useRef } from 'react'; // Added React for FC type
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useInView } from 'framer-motion'; // useInView for section title

gsap.registerPlugin(ScrollTrigger);

interface SkillItem {
  name: string;
  level: number; // Level is used for bar width
  icon?: string; // Placeholder, not used in this bar layout
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

// Updated Skill Data
const skillsData: SkillCategory[] = [
  {
    category: 'Frontend & 3D',
    items: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 90 },
      { name: 'Three.js', level: 85 },
      { name: 'GSAP', level: 90 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'TypeScript', level: 88 },
      { name: 'Framer Motion', level: 85 },
      { name: 'WebGL', level: 80 },
    ],
  },
  {
    category: 'Backend & CMS',
    items: [
      { name: 'Node.js (Express)', level: 80 },
      { name: 'Python (Flask)', level: 75 },
      { name: 'WordPress', level: 85 },
      { name: 'MongoDB', level: 70 },
    ],
  },
  {
    category: 'Other Skills',
    items:
    [
      { name: 'UI/UX Design (Figma)', level: 80 },
      { name: 'Blockchain Concepts', level: 70 },
      { name: 'Git & CI/CD', level: 85 },
    ]
  }
];

export const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { once: false, amount: 0.1 });

  // GSAP animation for skill bars (targeting class)
  useEffect(() => {
    const skillFillElements = gsap.utils.toArray(".skill-bar-fill");
    skillFillElements.forEach((barEl) => {
      const bar = barEl as HTMLElement;
      gsap.fromTo(
        bar,
        { width: "0%" },
        {
          width: `${bar.dataset.level}%`,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bar.closest(".skill-item"), // Trigger when the skill item (parent) comes into view
            start: 'top 85%', // Start animation a bit after it enters viewport
            toggleActions: 'play none none none', // Play once
          },
        }
      );
    });
  }, []);

  const categoryCardVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(2px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.1, // Stagger category cards
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      id="skills" // For navigation
      className="relative min-h-screen py-20 md:py-28 bg-black text-white font-inter overflow-hidden"
    >
      <div className="container-custom mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold mb-16 md:mb-20 electric-text text-center font-montserrat"
        >
          My Tech Arsenal
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {skillsData.map((category, catIndex) => (
            <motion.div
              key={category.category}
              custom={catIndex}
              variants={categoryCardVariants}
              initial="hidden"
              animate={sectionInView ? "visible" : "hidden"}
              className="p-6 md:p-7 rounded-xl bg-gray-900/60 backdrop-blur-lg shadow-2xl 
                         border border-gray-700/60 category-card-aura" // Class for aura
            >
              <h3 className="text-2xl font-bold mb-6 text-gold font-montserrat">
                {category.category}
              </h3>
              <div className="space-y-5">
                {category.items.map((skill) => (
                  <div key={skill.name} className="skill-item group"> {/* Added group for hover effects */}
                    <div className="flex justify-between mb-1.5">
                      <span className="text-base font-medium text-silver font-montserrat group-hover:text-gold transition-colors duration-200">
                        {skill.name} {/* Ensured Montserrat here */}
                      </span>
                      <span className="text-sm text-electric-blue font-montserrat">{skill.level}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-700/70 rounded-full overflow-hidden p-0.5 skill-bar-container">
                      <div
                        className="skill-bar-fill h-full bg-gradient-to-r from-teal via-electric-blue to-gold rounded-sm origin-left"
                        data-level={skill.level} // Pass level for GSAP
                        style={{ width: "0%" }} // Initial width for GSAP
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simplified Aura and Hover Glow CSS */}
      <style jsx global>{`
        @keyframes categoryAuraPulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(0, 191, 255, 0.15), 0 0 15px rgba(0, 255, 157, 0.15);
            border-color: rgba(107, 114, 128, 0.6); /* gray-500 from Tailwind */
          }
          50% {
            box-shadow: 0 0 25px rgba(0, 191, 255, 0.3), 0 0 25px rgba(0, 255, 157, 0.3);
            border-color: rgba(0, 255, 157, 0.5); 
          }
        }
        .category-card-aura {
          animation: categoryAuraPulse 4s infinite ease-in-out;
        }
        .skill-item:hover .skill-bar-container {
          box-shadow: 0 0 12px rgba(255, 215, 0, 0.5); /* Gold glow on hover for bar container */
        }
        .skill-item:hover .text-silver { /* Skill name text color change on hover */
            color: #ffd700; /* Gold */
        }
      `}</style>
    </section>
  );
};