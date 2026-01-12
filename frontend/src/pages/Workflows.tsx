import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useState } from 'react';

type Workflow = {
  _id: string;
  name: string;
  description?: string;
  states: string[];
  allowedTransitions: Record<string, string[]>;
};

export default function WorkflowsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [states, setStates] = useState('Created,In Review,Approved,Completed');
  const [transitions, setTransitions] = useState('Created:In Review;In Review:Approved;Approved:Completed');

  const workflowsQuery = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data } = await api.get('/workflows');
      return data as Workflow[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<Workflow>) => {
      const { data } = await api.post('/workflows', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      setName('');
      setDescription('');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const statesArr = states.split(',').map((s) => s.trim()).filter(Boolean);
    const map: Record<string, string[]> = {};
    transitions
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((pair) => {
        const [from, to] = pair.split(':').map((x) => x.trim());
        if (from && to) {
          map[from] = map[from] ? [...map[from], to] : [to];
        }
      });
    createMutation.mutate({ name, description, states: statesArr, allowedTransitions: map });
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">Workflows</h2>
          <span className="text-xs text-slate-400">
            {workflowsQuery.data?.length || 0} configured
          </span>
        </div>
        <div className="grid gap-3">
          {workflowsQuery.isLoading && <p className="text-sm text-slate-300">Loading...</p>}
          {workflowsQuery.data?.map((wf) => (
            <Link
              key={wf._id}
              to={`/app/workflows/${wf._id}`}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 hover:border-cyan-400/50"
            >
              <p className="text-sm font-semibold text-cyan-200">{wf.name}</p>
              <p className="text-xs text-slate-300">{wf.description || 'No description'}</p>
              <p className="mt-1 text-xs text-slate-400">
                States: {wf.states.join(' → ')}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm font-semibold text-slate-100">Create Workflow</p>
        <form className="mt-4 space-y-3" onSubmit={handleCreate}>
          <div>
            <label className="text-xs text-slate-300">Name</label>
            <input
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-300">Description</label>
            <textarea
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs text-slate-300">States (comma separated)</label>
            <input
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              value={states}
              onChange={(e) => setStates(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-300">
              Allowed transitions (e.g., Created:In Review;In Review:Approved)
            </label>
            <input
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              value={transitions}
              onChange={(e) => setTransitions(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create workflow'}
          </button>
          {createMutation.error && (
            <p className="text-xs text-red-400">Failed to create workflow</p>
          )}
        </form>
      </div>
    </div>
  );
}

