import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Play, CheckCircle2, XCircle } from 'lucide-react';
import { streamSession } from '../api';

export default function LiveSession() {
  const [sessionId, setSessionId] = useState(`sess-live-${Date.now().toString(36)}`);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const sourceRef = useRef(null);

  useEffect(() => () => sourceRef.current?.close(), []);

  const startSession = () => {
    sourceRef.current?.close();
    setRunning(true);
    setProgress(0);
    setStep('Connecting...');
    setResult(null);

    sourceRef.current = streamSession(
      sessionId,
      ({ step: s, progress: p }) => {
        setStep(s);
        setProgress(p);
      },
      (data) => {
        setResult(data);
        setRunning(false);
      },
      () => setRunning(false)
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Cpu size={20} className="text-cyan-400" /> Live Session Pipeline
            </h2>
            <p className="text-sm text-slate-400">Real-time SSE stream of quantum protocol execution.</p>
          </div>
          <button
            onClick={startSession}
            disabled={running}
            className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            <Play size={16} /> {running ? 'Running...' : 'Start Live Session'}
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-mono">{sessionId}</span>
            <span className="text-cyan-400 font-mono">{progress}%</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          {step && (
            <p className="text-sm text-slate-300 font-mono animate-pulse">{step}</p>
          )}
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border-2 border-solid border-emerald-600/60 p-6 rounded-xl">
            <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
              {result.accepted ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              Protocol: {result.accepted ? 'ACCEPTED' : 'REJECTED'}
            </h3>
            <p className="text-sm text-slate-300 font-mono">{result.reason}</p>
          </div>
          <div className="bg-slate-900 border-2 border-dashed border-cyan-500/60 p-6 rounded-xl">
            <h3 className="text-cyan-400 font-bold mb-3">Advisory: {result.verdict}</h3>
            <p className="text-sm text-slate-300 font-mono">{result.details}</p>
          </div>
        </div>
      )}
    </div>
  );
}
