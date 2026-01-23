import { useState, useEffect } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`PWA Install: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-2xl p-4 shadow-2xl z-50 animate-slideUp">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🐝</span>
          <div>
            <div className="font-bold text-lg">Installa BeeMonitor</div>
            <div className="text-sm opacity-90">Accesso rapido dalla home screen</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInstall(false)}
            className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-semibold transition-all"
          >
            Dopo
          </button>
          <button
            onClick={handleInstall}
            className="px-4 py-2 rounded-lg bg-white text-amber-600 hover:bg-amber-50 text-sm font-bold transition-all shadow-lg"
          >
            Installa
          </button>
        </div>
      </div>
    </div>
  );
}