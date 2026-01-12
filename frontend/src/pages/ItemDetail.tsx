import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { useState } from 'react';

type Item = {
  _id: string;
  currentState: string;
  workflowId: string;
  data: Record<string, any>;
};

type Workflow = {
  _id: string;
  allowedTransitions: Record<string, string[]>;
};

type EventLog = {
  _id: string;
  action: string;
  fromState?: string;
  toState?: string;
  performedBy: string;
  timestamp: string;
};

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [nextState, setNextState] = useState('');

  const itemQuery = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const { data } = await api.get(`/items/${id}`);
      return data as Item;
    },
    enabled: !!id,
  });

  const workflowQuery = useQuery({
    queryKey: ['workflow', itemQuery.data?.workflowId],
    queryFn: async () => {
      if (!itemQuery.data?.workflowId) return null;
      const { data } = await api.get('/workflows');
      return (data as Workflow[]).find((w) => w._id === itemQuery.data?.workflowId) || null;
    },
    enabled: !!itemQuery.data?.workflowId,
  });

  const logsQuery = useQuery({
    queryKey: ['logs', id],
    queryFn: async () => {
      const { data } = await api.get(`/items/${id}/logs`);
      return data as EventLog[];
    },
    enabled: !!id,
  });

  const transitionMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/items/${id}/transition`, { toState: nextState });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item', id] });
      queryClient.invalidateQueries({ queryKey: ['logs', id] });
      setNextState('');
    },
  });

  const allowedNext =
    workflowQuery.data?.allowedTransitions?.[itemQuery.data?.currentState || ''] || [];

  return (
    <div className="space-y-4">
      <Link to="/app/workflows" className="text-sm text-cyan-300 hover:text-cyan-200">
        ← Back to workflows
      </Link>

      {itemQuery.data ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm uppercase tracking-wide text-cyan-300">Item</p>
          <h2 className="text-xl font-semibold text-slate-100">
            {itemQuery.data.data?.title || 'Item'}
          </h2>
          <p className="text-sm text-slate-300">{itemQuery.data.data?.description}</p>
          <p className="mt-2 text-xs text-slate-400">State: {itemQuery.data.currentState}</p>
        </div>
      ) : (
        <p className="text-sm text-slate-300">Loading item...</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm font-semibold text-slate-100">Transition</p>
          <div className="mt-3 space-y-2">
            <label className="text-xs text-slate-300">Next state</label>
            <select
              value={nextState}
              onChange={(e) => setNextState(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
            >
              <option value="">Select</option>
              {allowedNext.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={() => transitionMutation.mutate()}
              disabled={!nextState || transitionMutation.isPending}
              className="w-full rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            >
              {transitionMutation.isPending ? 'Transitioning...' : 'Apply transition'}
            </button>
            {transitionMutation.error && (
              <p className="text-xs text-red-400">Transition failed</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm font-semibold text-slate-100">Event Logs</p>
          <div className="mt-3 space-y-2">
            {logsQuery.isLoading && <p className="text-sm text-slate-300">Loading...</p>}
            {logsQuery.data?.map((log) => (
              <div
                key={log._id}
                className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-200"
              >
                <p className="font-semibold text-cyan-200">{log.action}</p>
                <p className="text-slate-300">
                  {log.fromState || '—'} → {log.toState || '—'}
                </p>
                <p className="text-slate-500">
                  by {log.performedBy} at {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

