import React, { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { getCusumHistory, runSession } from '../api';

const THRESHOLD = 2.0;

export default function CusumDriftChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      await runSession(`cusum-seed-${Date.now().toString(36)}`, 0.03);
      const { history } = await getCusumHistory(50);
      setData(history.length ? history : [{ session: 1, cusum: 0 }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-cyan-400" /> Cross-Session Drift Tracking (GLR-CUSUM)
          </h2>
          <p className="text-sm text-slate-400">Unconditional session ingestion monitoring low-and-slow cumulative bias.</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Ingest Session
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="session" stroke="#94a3b8" label={{ value: 'Session #', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" label={{ value: 'CUSUM', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }} />
              <ReferenceLine y={THRESHOLD} stroke="#f43f5e" strokeDasharray="5 5" label={{ value: 'Threshold', fill: '#f43f5e', fontSize: 11 }} />
              <Line type="monotone" dataKey="cusum" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
