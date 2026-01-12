import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function DashboardPage() {
  const [status, setStatus] = useState<string>('checking...');

  useEffect(() => {
    api
      .get('/health')
      .then((res) => setStatus(res.data?.status || 'ok'))
      .catch(() => setStatus('offline'));
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
        <p className="text-sm uppercase tracking-wide text-cyan-300">Dashboard</p>
        <h2 className="text-2xl font-semibold text-slate-100">Operational overview</h2>
        <p className="mt-2 text-sm text-slate-300">
          Check service health, then head to Workflows to define states and run items through the
          engine.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Stat label="Backend" value={status} />
          <Stat label="Audit Logs" value="Immutable" />
          <Stat label="Permissions" value="Role-based" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-lg font-semibold text-slate-100">{value}</p>
    </div>
  );
}

