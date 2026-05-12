import React, { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useCompany } from "../hooks/useCompany";
import { useNavigate } from "react-router-dom";
import { motion, Variants } from "framer-motion";

export default function Welcome() {
  const { saveCompany } = useCompany();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveCompany(name.trim());
      navigate("/");
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-olive-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-terracotta-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70" 
      />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg bg-warm-surface/80 backdrop-blur-xl p-10 md:p-14 rounded-[2.5rem] border border-white/50 shadow-2xl shadow-brown-900/5 relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-4">
          <span className="inline-block py-1 px-3 rounded-full bg-olive-50 text-olive-600 text-xs font-bold tracking-widest uppercase mb-6 border border-olive-100">
            DanaTaniku
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-olive-800 leading-tight">
            Selamat Datang.
          </h1>
        </motion.div>
        
        <motion.p variants={itemVariants} className="text-brown-500 text-lg mb-10 font-light leading-relaxed">
          Masukkan nama perusahaan atau usaha kopra Anda untuk memulai pembukuan yang lebih baik.
        </motion.p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-semibold text-olive-700 px-1 uppercase tracking-wider">Nama Usaha</label>
            <Input
              type="text"
              placeholder="Contoh: PT. Makmur Jaya"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="text-lg py-5 shadow-inner"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button type="submit" className="w-full py-5 text-base shadow-lg shadow-terracotta-500/20" disabled={!name.trim()}>
              Mulai Sekarang
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
