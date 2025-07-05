import { useContext } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';

export default function ThemeSelector() {
  const { settings, setSettings } = useContext(SettingsContext);

  const themes = [
    { id: 'light', name: '浅色' },
    { id: 'dark', name: '深色' },
    { id: 'blue', name: '蓝色' }
  ];

  return (
    <div className="theme-selector">
      {themes.map(theme => (
        <button
          key={theme.id}
          className={`theme-option ${theme.id}`}
          onClick={() => setSettings({ ...settings, theme: theme.id })}
          aria-selected={settings.theme === theme.id}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
}