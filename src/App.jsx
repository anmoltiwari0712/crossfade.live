import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DifferenceTable from './components/DifferenceTable';
import LiveAudioDemo from './components/LiveAudioDemo';
import PresetCards from './components/PresetCards';
import BugReportSection from './components/BugReportSection';
import PrivacyAndFooter from './components/PrivacyAndFooter';
import MagicSourcePage from './components/MagicSourcePage';
import ComingSoonPage from './components/ComingSoonPage';

function getRouteFromHash() {
  if (typeof window === 'undefined') return 'home';
  if (window.location.hash === '#/source') return 'source';
  if (window.location.hash === '#/coming-soon') return 'coming-soon';
  return 'home';
}

export default function App() {
  const [duration, setDuration] = useState(2);
  const [curve, setCurve] = useState('equalpower');
  const [route, setRoute] = useState(getRouteFromHash);

  useEffect(() => {
    function handleHashChange() {
      const next = getRouteFromHash();
      setRoute(next);
      if (next !== 'home') {
        window.scrollTo({ top: 0, behavior: 'instant' });
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

  function handleOpenComingSoon() {
    window.location.hash = '#/coming-soon';
    setRoute('coming-soon');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function handleNavigateHome(sectionHash = '#top') {
    if (route !== 'home') {
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
      <Navbar
        onNavigateHome={handleNavigateHome}
        onOpenComingSoon={handleOpenComingSoon}
      />
      <main>
        {route === 'source' ? (
          <MagicSourcePage
            onBack={() => handleNavigateHome('#top')}
            onOpenComingSoon={handleOpenComingSoon}
          />
        ) : route === 'coming-soon' ? (
          <ComingSoonPage
            onBack={() => handleNavigateHome('#top')}
            onTryDemo={() => handleNavigateHome('#experience')}
          />
        ) : (
          <>
            <Hero onOpenComingSoon={handleOpenComingSoon} />
            <DifferenceTable />
            <LiveAudioDemo
              duration={duration}
              setDuration={setDuration}
              curve={curve}
              setCurve={setCurve}
              onOpenSource={handleOpenSource}
            />
            <PresetCards
              onSelectPreset={handleSelectPreset}
              onOpenComingSoon={handleOpenComingSoon}
            />
            <BugReportSection />
          </>
        )}
        <PrivacyAndFooter
          onOpenSource={handleOpenSource}
          onOpenComingSoon={handleOpenComingSoon}
          onNavigateHome={handleNavigateHome}
          showBody={route === 'home'}
        />
      </main>
    </div>
  );
}

