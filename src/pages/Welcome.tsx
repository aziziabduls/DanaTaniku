import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useCompany } from "../hooks/useCompany";

export default function Welcome() {
  const { saveCompany } = useCompany();
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveCompany(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-warm-surface p-8 rounded-[32px] border border-warm-border shadow-sm">
        <h1 className="font-serif text-4xl font-light italic text-brown-900 mb-2">Selamat Datang</h1>
        <p className="text-brown-500 mb-8">Masukkan nama perusahaan atau usaha kopra Anda untuk memulai.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-brown-900 px-1">Nama Perusahaan / Usaha</label>
            <Input 
              type="text" 
              placeholder="Contoh: PT. Makmur Jaya" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Mulai Aplikasi</Button>
        </form>
      </div>
    </div>
  );
}
