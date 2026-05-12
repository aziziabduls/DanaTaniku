import { useState, useEffect } from 'react';

export function useCompany() {
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setCompanyName(localStorage.getItem('companyName'));
    };

    window.addEventListener('storage', handleStorageChange);
    // Initial load
    handleStorageChange();
    setIsLoaded(true);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveCompany = (name: string) => {
    localStorage.setItem('companyName', name);
    setCompanyName(name);
    // Dispatch event so other instances of the hook update
    window.dispatchEvent(new Event('storage'));
  };

  return { companyName, saveCompany, isLoaded };
}
