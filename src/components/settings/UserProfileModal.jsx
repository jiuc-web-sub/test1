import { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';

export default function UserProfileModal({ open, onClose, user, setUser }) {
  const { settings, setSettings } = useContext(SettingsContext);
  const [nickname, setNickname] = useState('');
  const [signature, setSignature] = useState('');

  // 每次弹窗打开时同步外部 user
  useEffect(() => {
    if (open) {
      setNickname(user?.nickname || user?.username || '');
      setSignature(user?.signature || '');
    }
  }, [open, user]);

  if (!open) return null;

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      nickname,
      signature,
    }));
    setSettings({ ...settings, fontFamily: settings.fontFamily });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>用户设置</h2>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, color: '#888' }}>用户昵称</label>
          <input value={nickname} onChange={e => setNickname(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, color: '#888' }}>个性签名</label>
          <input value={signature} onChange={e => setSignature(e.target.value)} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4, color: '#888' }}>字体选择</label>
          <select
            value={settings.fontFamily}
            onChange={e => setSettings({ ...settings, fontFamily: e.target.value })}
          >
            {['Arial', 'Verdana', 'Georgia', 'Courier New', 'Comic Sans MS'].map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: 16 }}>
          <button onClick={handleSave}>保存</button>
          <button onClick={onClose} style={{ marginLeft: 8 }}>取消</button>
        </div>
      </div>
    </div>
  );
}