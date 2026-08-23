import React, { useEffect, useState } from 'react';
import { Shield, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { getForensicLog, verifyForensicChain } from '../api';

export default function ForensicLog() {
  const [entries, setEntries] = useState([]);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [logData, verifyData] = await Promise.all([
        getForensicLog(100),
        verifyForensicChain(),
      ]);
      setEntries(logData.entries || []);
      setVerification(verifyData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleVerify = async () => {
    const result = await verifyForensicChain();
    setVerification(result);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield size={20} className="text-cyan-400" /> Forensic Audit Log
          </h2>
          <p className="text-sm text-slate-400">Append-only SHA-256 hash chain with Ed25519 signatures.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleVerify}
            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold flex items-center gap-2"
          >
            {verification?.valid ? <CheckCircle2 size={16} /> : <Shield size={16} />}
            Verify Chain
          </button>
          <button
            onClick={load}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {verification && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          verification.valid
            ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
            : 'bg-rose-950/50 border-rose-800 text-rose-300'
        }`}>
          {verification.valid ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <div className="text-sm font-mono">
            <span className="font-bold">{verification.valid ? 'INTEGRITY OK' : 'CHAIN BROKEN'}</span>
            {' — '}{verification.details} ({verification.entries} entries)
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
          <table className="w-full text-sm font-mono">
            <thead className="bg-slate-950 sticky top-0">
              <tr className="text-slate-400 text-left">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Session</th>
                <th className="px-4 py-3">Protocol</th>
                <th className="px-4 py-3">Advisory</th>
                <th className="px-4 py-3">Hash</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No log entries yet</td></tr>
              )}
              {[...entries].reverse().map((e, i) => (
                <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/50">
                  <td className="px-4 py-2 text-slate-400">{e.timestamp?.slice(0, 19)}</td>
                  <td className="px-4 py-2 text-slate-200">{e.session_id}</td>
                  <td className={`px-4 py-2 ${e.protocol_accepted ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {e.protocol_accepted ? 'ACCEPT' : 'REJECT'}
                  </td>
                  <td className="px-4 py-2 text-cyan-400">{e.monitoring_verdict}</td>
                  <td className="px-4 py-2 text-slate-500 truncate max-w-[8rem]">{e.entry_hash?.slice(0, 12)}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
