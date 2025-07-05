import { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    fontFamily: 'Arial'
  });

  useEffect(() => {
    document.body.style.fontFamily = settings.fontFamily + ', sans-serif';
  }, [settings.fontFamily]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}