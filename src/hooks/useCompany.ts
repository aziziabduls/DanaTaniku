import { useState, useEffect } from 'react';

export function useCompany() {
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('companyName');
    setCompanyName(name);
    setIsLoaded(true);
  }, []);

  const saveCompany = (name: string) => {
    localStorage.setItem('companyName', name);
    setCompanyName(name);
  };

  return { companyName, saveCompany, isLoaded };
}
