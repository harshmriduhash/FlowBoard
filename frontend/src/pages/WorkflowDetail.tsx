import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { useState } from 'react';

type Workflow = {
  _id: string;
  name: string;
  description?: string;
  states: string[];
  allowedTransitions: Record<string, string[]>;
};

type Item = {
  _id: string;
  currentState: string;
  data: Record<string, any>;
  updatedAt: string;
};

export default function WorkflowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [dataTitle, setDataTitle] = useState('');
  const [dataDescription, setDataDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isPrioritizing, setIsPrioritizing] = useState(false);

  const workflowQuery = useQuery({
    queryKey: ['workflow', id],
    queryFn: async () => {
      const { data } = await api.get(`/workflows`);
      return (data as Workflow[]).find((w) => w._id === id);
    },
    enabled: !!id,
  });

  const itemsQuery = useQuery({
    queryKey: ['items', id],
    queryFn: async () => {
      const { data } = await api.get('/items', { params: { workflowId: id } });
      return data as Item[];
    },
    enabled: !!id,
  });

  const createItem = useMutation({
    mutationFn: async () => {
      const payload = {
        workflowId: id,
        priority, 
        data: { title: dataTitle, description: dataDescription },
      };
      const { data } = await api.post('/items', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', id] });
      setDataTitle('');
      setDataDescription('');
      setPriority('medium');
    },
  });

  const handlePrioritize = async () => {
    if (!dataTitle) return alert("Title is required for analysis");
    setIsPrioritizing(true);
    try {
        const { data } = await api.post('/ai/prioritize-task', { title: dataTitle, description: dataDescription });
        if (data.priority) setPriority(data.priority);
    } catch (e) {
        console.error(e);
        alert("AI Prioritization failed");
    } finally {
        setIsPrioritizing(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <Link to="/app/workflows" className="text-sm text-cyan-300 hover:text-cyan-200">
          ← Back to workflows
        </Link>
        {workflowQuery.data ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm uppercase tracking-wide text-cyan-300">Workflow</p>
            <h2 className="text-2xl font-semibold text-slate-100">{workflowQuery.data.name}</h2>
            <p className="text-sm text-slate-300">{workflowQuery.data.description}</p>
            <p className="mt-2 text-xs text-slate-400">
              States: {workflowQuery.data.states.join(' → ')}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-300">Loading workflow...</p>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-100">Items</p>
            <span className="text-xs text-slate-400">{itemsQuery.data?.length || 0} items</span>
          </div>
          <div className="mt-3 grid gap-3">
            {itemsQuery.isLoading && <p className="text-sm text-slate-300">Loading...</p>}
            {itemsQuery.data?.map((item) => (
              <Link
                key={item._id}
                to={`/app/items/${item._id}`}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 hover:border-cyan-400/40"
              >
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-semibold text-cyan-200">{item.data?.title || 'Item'}</p>
                        <p className="text-xs text-slate-300">{item.data?.description || 'No description'}</p>
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                     <span>State: {item.currentState}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-slate-100">Create Item</p>
            <button
                type="button"
                onClick={handlePrioritize}
                disabled={isPrioritizing || !dataTitle}
                className="text-xs text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
            >
                {isPrioritizing ? 'Analyzing...' : '✨ AI Priority'}
            </button>
        </div>
        <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); createItem.mutate(); }}>
          <div>
            <label className="text-xs text-slate-300">Title</label>
            <input
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              value={dataTitle}
              onChange={(e) => setDataTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-300">Description</label>
            <textarea
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              rows={3}
              value={dataDescription}
              onChange={(e) => setDataDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-300">Priority</label>
            <select
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
            disabled={createItem.isPending}
          >
            {createItem.isPending ? 'Creating...' : 'Create item'}
          </button>
          {createItem.error && <p className="text-xs text-red-400">Failed to create item</p>}
        </form>
      </div>
    </div>
  );
}

