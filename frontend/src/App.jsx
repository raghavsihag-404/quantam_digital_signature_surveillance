import React, { useState } from 'react';
import LiveSession from './components/LiveSession';
import AttackLab from './components/AttackLab';
import QuantumEvidenceView from './components/QuantumEvidenceView';
import CusumDriftChart from './components/CusumDriftChart';
import ForensicLog from './components/ForensicLog';

const TABS = [
  { id: 'live', label: 'LIVE' },
  { id: 'lab', label: 'LAB' },
  { id: 'evidence', label: 'EVIDENCE' },
  { id: 'drift', label: 'DRIFT' },
  { id: 'forensics', label: 'FORENSICS' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('lab');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 rounded-full bg-cyan-500 animate-pulse" />
          <span className="font-bold text-xl tracking-wider text-white">QSENTINEL</span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            PS-141 Runtime Monitor
          </span>
        </div>
        <nav className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === 'live' && <LiveSession />}
        {activeTab === 'lab' && <AttackLab />}
        {activeTab === 'evidence' && <QuantumEvidenceView />}
        {activeTab === 'drift' && <CusumDriftChart />}
        {activeTab === 'forensics' && <ForensicLog />}
      </main>
    </div>
  );
}
