import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DifferenceTable from './components/DifferenceTable';
import LiveAudioDemo from './components/LiveAudioDemo';
import PresetCards from './components/PresetCards';
import AudienceSection from './components/AudienceSection';
import PrivacyAndFooter from './components/PrivacyAndFooter';
import MagicSourcePage from './components/MagicSourcePage';

export default function App() {
  const [duration, setDuration] = useState(2);
  const [curve, setCurve] = useState('equalpower');
  const [route, setRoute] = useState(() =>
    typeof window !== 'undefined' && window.location.hash === '#/source' ? 'source' : 'home'
  );

  useEffect(() => {
    function handleHashChange() {
      if (window.location.hash === '#/source') {
        setRoute('source');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setRoute('home');
      }
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  function handleSelectPreset(seconds, nextCurve) {
    setDuration(seconds);
    setCurve(nextCurve);
  }

  function handleOpenSource() {
    window.location.hash = '#/source';
    setRoute('source');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function handleNavigateHome(sectionHash = '#top') {
    if (route === 'source') {
      setRoute('home');
      window.history.replaceState(null, '', sectionHash);
      requestAnimationFrame(() => {
        if (sectionHash === '#top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.querySelector(sectionHash)?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  return (
    <div id="top" className="min-h-screen bg-[#121212] text-white">
      <Navbar onNavigateHome={handleNavigateHome} />
      <main>
        {route === 'source' ? (
          <MagicSourcePage onBack={() => handleNavigateHome('#top')} />
        ) : (
          <>
            <Hero />
            <DifferenceTable />
            <LiveAudioDemo
              duration={duration}
              setDuration={setDuration}
              curve={curve}
              setCurve={setCurve}
              onOpenSource={handleOpenSource}
            />
            <PresetCards onSelectPreset={handleSelectPreset} />
            <AudienceSection />
          </>
        )}
        <PrivacyAndFooter
          onOpenSource={handleOpenSource}
          onNavigateHome={handleNavigateHome}
          showBody={route !== 'source'}
        />
      </main>
    </div>
  );
}

