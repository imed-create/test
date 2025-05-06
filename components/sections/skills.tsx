'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

const skills = [
  {
    category: 'Frontend',
    items: [
      { name: 'React', level: 90 },
      { name: 'Next.js', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'Tailwind CSS', level: 90 },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 80 },
      { name: 'MongoDB', level: 75 },
      { name: 'PostgreSQL', level: 70 },
    ],
  },
  {
    category: '3D & Animation',
    items: [
      { name: 'Three.js', level: 85 },
      { name: 'GSAP', level: 90 },
      { name: 'Framer Motion', level: 85 },
      { name: 'WebGL', level: 75 },
    ],
  },
];

export const Skills = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const skillBarsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate skill bars
      skillBarsRef.current.forEach((bar, index) => {
        gsap.fromTo(
          bar,
          {
            scaleX: 0,
          },
          {
            scaleX: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: bar,
              start: 'top center',
              end: 'bottom center',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 overflow-hidden"
    >
      <div className="container-custom">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-12 electric-text text-center"
        >
          Technical Skills
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((category) => (
            <motion.div
              key={category.category}
              className="p-6 rounded-xl bg-black/50 backdrop-blur-sm electric-border"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-gold">
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.items.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-silver">{skill.name}</span>
                      <span className="text-electric-blue">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        ref={(el) =>
                          (skillBarsRef.current[index] = el as HTMLDivElement)
                        }
                        className="h-full bg-gradient-to-r from-electric-blue to-teal origin-left"
                        style={{ scaleX: 0 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Electric aura effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric-blue/5 to-transparent opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal/5 to-transparent opacity-30" />
      </div>
    </section>
  );
}; 