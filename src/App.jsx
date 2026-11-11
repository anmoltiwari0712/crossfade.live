import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DifferenceTable from './components/DifferenceTable';
import LiveAudioDemo from './components/LiveAudioDemo';
import PresetCards from './components/PresetCards';
import AudienceSection from './components/AudienceSection';
import PrivacyAndFooter from './components/PrivacyAndFooter';

export default function App() {
  const [duration, setDuration] = useState(2);
  const [curve, setCurve] = useState('equalpower');

  function handleSelectPreset(seconds, nextCurve) {
    setDuration(seconds);
    setCurve(nextCurve);
  }

  return (
    <div id="top" className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      <main>
        <Hero />
        <DifferenceTable />
        <LiveAudioDemo
          duration={duration}
          setDuration={setDuration}
          curve={curve}
          setCurve={setCurve}
        />
        <PresetCards onSelectPreset={handleSelectPreset} />
        <AudienceSection />
        <PrivacyAndFooter />
      </main>
    </div>
  );
}
