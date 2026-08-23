import React, { useEffect, useState } from 'react';
import { FileCheck, Activity, Zap } from 'lucide-react';
import { getAttackStrategies, runAttack, runSession } from '../api';

export default function AttackLab() {
  const [strategies, setStrategies] = useState([]);
  const [selected, setSelected] = useState('');
  const [sessionResult, setSessionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAttackStrategies().then((d) => {
      setStrategies(d.strategies || []);
      if (d.strategies?.length) setSelected(d.strategies[0]);
    });
  }, []);

  const runLiveSession = async () => {
    setLoading(true);
    try {
      const data = await runSession(`sess-demo-${Date.now().toString(36)}`);
      setSessionResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const runSelectedAttack = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const data = await runAttack(selected, `attack-${Date.now().toString(36)}`);
      setSessionResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Interactive Attack Simulation Lab</h2>
            <p className="text-sm text-slate-400">
              Trigger isolated session runs to evaluate protocol-vs-monitor separation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
            >
              {strategies.map((s) => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <button
              onClick={runSelectedAttack}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm disabled:opacity-50 flex items-center gap-2"
            >
              <Zap size={16} /> Run Attack
            </button>
            <button
              onClick={runLiveSession}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? 'Executing...' : 'Run Live Session'}
            </button>
          </div>
        </div>
      </div>

      {sessionResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border-2 border-solid border-emerald-600/60 p-6 rounded-xl relative">
            <div className="absolute top-4 right-4 text-emerald-400 text-xs font-mono uppercase tracking-widest border border-emerald-600/40 px-2 py-1 rounded">
              Authoritative Lane
            </div>
            <h3 className="text-emerald-400 font-bold text-lg mb-2 flex items-center gap-2">
              <FileCheck size={20} /> Protocol Decision (Lane 1)
            </h3>
            <div className="space-y-3 mt-4 text-sm font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Status:</span>
                <span className={sessionResult.protocol_decision.accepted ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {sessionResult.protocol_decision.accepted ? 'ACCEPTED' : 'REJECTED'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Reason:</span>
                <span className="text-slate-200">{sessionResult.protocol_decision.reason}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border-2 border-dashed border-cyan-500/60 p-6 rounded-xl relative">
            <div className="absolute top-4 right-4 text-cyan-400 text-xs font-mono uppercase tracking-widest border border-cyan-500/40 px-2 py-1 rounded">
              Advisory Watcher
            </div>
            <h3 className="text-cyan-400 font-bold text-lg mb-2 flex items-center gap-2">
              <Activity size={20} /> QSENTINEL Monitor (Lane 2)
            </h3>
            <div className="space-y-3 mt-4 text-sm font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Advisory Verdict:</span>
                <span className="text-cyan-300 font-bold">{sessionResult.monitoring_decision.verdict}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Details:</span>
                <span className="text-slate-200">{sessionResult.monitoring_decision.details}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
