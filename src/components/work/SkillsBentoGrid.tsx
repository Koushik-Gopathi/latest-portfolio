"use client";

import { motion } from "framer-motion";

const skillCategories = [
  {
    number: "01",
    title: "Cybersecurity & Systems",
    subtitle: "Core Engineering & Security Lab",
    description: "Hands-on threat analysis, secure system setups, and fundamental architecture.",
    skills: ["Kali Linux", "SeedLabs", "Operating Systems", "DBMS"],
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    number: "02",
    title: "Web Development",
    subtitle: "Frontend Architecture",
    description: "Crafting fast, modern, and responsive web applications with clean design patterns.",
    skills: ["React.js", "Next.js", "Express.js", "JavaScript", "HTML/CSS", "Framer Motion"],
    colSpan: "col-span-1 md:col-span-1",
  },
  {
    number: "03",
    title: "App Development",
    subtitle: "Cross-Platform Solutions",
    description: "Building native-feeling mobile applications and smooth interactive user experiences.",
    skills: ["Flutter", "Dart", "Mobile UI Design"],
    colSpan: "col-span-1 md:col-span-1",
  },
  {
    number: "04",
    title: "Design & DevOps Tools",
    subtitle: "Workflow & Craft",
    description: "Translating concepts into high-fidelity interfaces and managing deployment pipelines.",
    skills: ["Figma", "UI/UX Design", "Git & GitHub"],
    colSpan: "col-span-1 md:col-span-2",
  },
];

export default function SkillsBentoGrid() {
  return (
    <section className="relative min-h-screen w-full bg-[#FF0000] text-white py-32 px-6 md:px-16 z-30">
      
      {/* Section Header */}
      <div className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/20 pb-6 gap-4">
        <div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">
            SKILLS & EXPERTISE.
          </h2>
        </div>
      </div>

      {/* Bento Grid Layout with White Cards for Contrast */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {skillCategories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
            className={`${category.colSpan} group relative bg-white text-black rounded-3xl p-8 flex flex-col justify-between shadow-2xl overflow-hidden`}
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono font-bold text-[#FF0000] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                  {category.subtitle}
                </span>
                <span className="text-xs font-mono text-gray-400 font-bold">{category.number}</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900 mb-3">
                {category.title}
              </h3>

              <p className="text-gray-600 text-sm md:text-base font-medium leading-relaxed mb-8">
                {category.description}
              </p>
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
              {category.skills.map((skill, sIndex) => (
                <span
                  key={sIndex}
                  className="text-xs font-mono font-bold bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1.5 rounded-xl"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}