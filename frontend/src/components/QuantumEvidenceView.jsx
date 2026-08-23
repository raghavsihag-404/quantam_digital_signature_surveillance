import React, { useEffect, useState } from 'react';
import { Atom, RefreshCw } from 'lucide-react';
import { runSession } from '../api';

function MetricBar({ label, value, max = 1, color = 'cyan' }) {
  const pct = Math.min(100, (value / max) * 100);
  const colors = {
    cyan: 'bg-cyan-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-mono">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-200">{typeof value === 'number' ? value.toFixed(4) : value}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function QuantumEvidenceView() {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEvidence = async () => {
    setLoading(true);
    try {
      const data = await runSession(`evidence-${Date.now().toString(36)}`);
      setTelemetry(data.telemetry);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvidence(); }, []);

  const m = telemetry?.mismatch_rate ?? 0;
  const c = telemetry?.correlation ?? 0;
  const h = telemetry?.entropy ?? 0;
  const pauli = telemetry?.pauli_consistency ?? 0;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Atom size={20} className="text-cyan-400" /> Quantum Evidence Metrics
          </h2>
          <p className="text-sm text-slate-400">m, C, H, and Pauli-correction consistency from measurement telemetry.</p>
        </div>
        <button
          onClick={fetchEvidence}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {telemetry && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5">
            <MetricBar label="Mismatch Rate (m)" value={m} max={0.15} color={m > 0.08 ? 'rose' : m > 0.04 ? 'amber' : 'emerald'} />
            <MetricBar label="Correlation (C = 1 − 2p)" value={c} max={1} color="cyan" />
            <MetricBar label="Entropy (H)" value={h} max={1} color="amber" />
            <MetricBar label="Pauli Consistency" value={pauli} max={1} color={pauli > 0.7 ? 'emerald' : 'rose'} />
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-sm font-mono text-slate-400 mb-4 uppercase tracking-wider">Raw Telemetry</h3>
            <pre className="text-xs font-mono text-slate-300 overflow-auto max-h-64 bg-slate-950 p-4 rounded-lg border border-slate-800">
              {JSON.stringify(telemetry, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
