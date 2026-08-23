const API = '/api';

export async function runSession(sessionId, noiseP = 0.02) {
  const res = await fetch(`${API}/sessions/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, noise_p: noiseP }),
  });
  if (!res.ok) throw new Error('Session run failed');
  return res.json();
}

export async function runAttack(strategy, sessionId) {
  const res = await fetch(`${API}/attacks/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ strategy, session_id: sessionId }),
  });
  if (!res.ok) throw new Error('Attack run failed');
  return res.json();
}

export async function getAttackStrategies() {
  const res = await fetch(`${API}/attacks/strategies`);
  return res.json();
}

export async function getCusumHistory(limit = 50) {
  const res = await fetch(`${API}/cusum/history?limit=${limit}`);
  return res.json();
}

export async function getForensicLog(limit = 100) {
  const res = await fetch(`${API}/forensics/log?limit=${limit}`);
  return res.json();
}

export async function verifyForensicChain() {
  const res = await fetch(`${API}/forensics/verify`);
  return res.json();
}

export function streamSession(sessionId, onProgress, onComplete, onError) {
  const source = new EventSource(`${API}/sessions/${sessionId}/stream`);
  source.addEventListener('progress', (e) => onProgress(JSON.parse(e.data)));
  source.addEventListener('complete', (e) => {
    onComplete(JSON.parse(e.data));
    source.close();
  });
  source.onerror = () => {
    onError?.('SSE connection error');
    source.close();
  };
  return source;
}
