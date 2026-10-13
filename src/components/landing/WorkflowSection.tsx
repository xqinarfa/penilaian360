"use client";

import { motion } from "framer-motion";
import { GraduationCap, Mail, FileEdit, BarChart3, ShieldCheck } from "lucide-react";
import {
  fadeInUp,
  stepCardContainerVariants,
  stepCardFillRiseVariants,
  stepCardContentVariants,
  easeExpo,
} from "@/lib/animations";
import type { WorkflowStep } from "@/types";

const workflowSteps: WorkflowStep[] = [
  {
    number: "01",
    title: "Selesaikan pelatihan",
    desc: "Kelulusan LMS dan aktivitas KMS menjadi dasar evaluasi.",
    Icon: GraduationCap,
    cardClass: "step-card-1",
    bgClass: "step-card-bg-1",
  },
  {
    number: "02",
    title: "Terima undangan",
    desc: "Tunggu undangan penilaian sesuai periode evaluasi.",
    Icon: Mail,
    cardClass: "step-card-2",
    bgClass: "step-card-bg-2",
  },
  {
    number: "03",
    title: "Isi kuesioner",
    desc: "Nilai sesuai peran Anda. Jawaban tersimpan otomatis.",
    Icon: FileEdit,
    cardClass: "step-card-3",
    bgClass: "step-card-bg-3",
  },
  {
    number: "04",
    title: "Tinjau hasil",
    desc: "Setelah periode ditutup, hasil menjadi bahan pengembangan.",
    Icon: BarChart3,
    cardClass: "step-card-4",
    bgClass: "step-card-bg-4",
  },
];

export default function WorkflowSection() {
  return (
    <section id="alur" className="workflow-section" aria-labelledby="workflow-heading">
      <div className="workflow-container">
        {/* Header */}
        <motion.div
          className="workflow-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="workflow-title-block">
            <span className="section-label">ALUR EVALUASI / PENILAIAN 360</span>
            <h2 id="workflow-heading">
              Empat langkah.
              <br />
              Satu arah pengembangan.
            </h2>
          </div>
          <p className="workflow-subtitle">
            Dari hasil pelatihan menjadi masukan yang berarti.
            <br />
            Kenali alurnya, lalu mulai saat undangan Anda tiba.
          </p>
        </motion.div>

        {/* 4 Stepping Cards Grid with Sequential Bottom-to-Top Fill Motion */}
        <motion.div
          className="workflow-cards-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25 }}
        >
          {workflowSteps.map((step, i) => {
            const IconComponent = step.Icon;
            return (
              <motion.div
                key={step.number}
                className={`step-card ${step.cardClass}`}
                custom={i}
                variants={stepCardContainerVariants}
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {/* Animated Fill Layer (Liquid rise from bottom to top) */}
                <motion.div
                  className={`step-card-fill-bg ${step.bgClass}`}
                  style={{ originY: 1, transformOrigin: "bottom center" }}
                  custom={i}
                  variants={stepCardFillRiseVariants}
                >
                  <div className="fill-leading-edge" />
                </motion.div>

                {/* Step Content Layer */}
                <motion.div
                  className="step-card-content"
                  custom={i}
                  variants={stepCardContentVariants}
                >
                  <div className="step-card-top">
                    <span className="step-number">{step.number}</span>
                    <div className="step-icon-badge" aria-hidden="true">
                      <IconComponent size={20} />
                    </div>
                  </div>
                  <div className="step-card-bottom">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Privacy Guarantee Bar */}
        <motion.div
          className="privacy-notice-bar"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ delay: 0.3, duration: 0.5, ease: easeExpo }}
        >
          <ShieldCheck size={22} color="#0878f8" aria-hidden="true" />
          <span>
            Privasi tetap terjaga. Identitas rekan kerja dan bawahan dirahasiakan sesuai ketentuan evaluasi.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
