import { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { useTheme } from '../contexts/Themecontext';

const fontOptions = ['Arial', 'Verdana', 'Georgia', 'Courier New', 'Comic Sans MS'];

export default function Settings() {
  const { settings, setSettings } = useContext(SettingsContext);
  const { theme, setTheme, toggleTheme } = useTheme();

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleFontChange = (e) => {
    setSettings({ ...settings, fontFamily: e.target.value });
    document.body.style.fontFamily = e.target.value;
  };

  return (
    <div>
      <h1>设置</h1>
      <div>
        <label>主题：</label>
        <select value={theme} onChange={handleThemeChange}>
          <option value="light">浅色</option>
          <option value="dark">深色</option>
        </select>
        <button onClick={toggleTheme} style={{ marginLeft: 8 }}>
          切换主题
        </button>
      </div>
      <div>
        <label>字体：</label>
        <select value={settings.fontFamily} onChange={handleFontChange}>
          {fontOptions.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>
    </div>
  );
}