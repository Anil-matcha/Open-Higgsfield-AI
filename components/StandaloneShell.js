'use client';

import { useState } from 'react';
import { ImageStudio, VideoStudio, LipSyncStudio, CinemaStudio } from 'studio';

const TABS = [
  { id: 'image', label: 'Image Studio' },
  { id: 'video', label: 'Video Studio' },
  { id: 'lipsync', label: 'Lip Sync' },
  { id: 'cinema', label: 'Cinema Studio' },
];

export default function StandaloneShell() {
  const [activeTab, setActiveTab] = useState('image');

  // TEMP FAKE KEY (we will remove this later properly)
  const apiKey = 'internal-safe-mode';

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-bold">
          Clabstream AI Studio
        </div>

        <nav className="flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'text-lime-300' : 'text-white/60'}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="text-sm text-white/50">
          Internal Use Only
        </div>
      </header>

      <main className="p-6">
        <div className="mb-4 rounded border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
          Provider connection is set up, but generation is temporarily unavailable because the account has insufficient credits.
        </div>

        {activeTab === 'image' && <ImageStudio apiKey={apiKey} />}
        {activeTab === 'video' && <VideoStudio apiKey={apiKey} />}
        {activeTab === 'lipsync' && <LipSyncStudio apiKey={apiKey} />}
        {activeTab === 'cinema' && <CinemaStudio apiKey={apiKey} />}
      </main>
    </div>
  );
}