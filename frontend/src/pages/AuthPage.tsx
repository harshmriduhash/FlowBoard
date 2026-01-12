import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../lib/api';
import { AuthState } from '../lib/auth';

type Props = {
  mode: 'login' | 'signup';
  onAuth: (auth: AuthState) => void;
};

export default function AuthPage({ mode, onAuth }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload =
        mode === 'signup'
          ? { email, password, workspaceName: workspaceName || 'My Workspace' }
          : { email, password };
      const path = mode === 'signup' ? '/auth/signup' : '/auth/login';
      const { data } = await api.post(path, payload);
      const auth: AuthState = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      };
      setAuthToken(auth.accessToken);
      onAuth(auth);
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-slate-100">
        {mode === 'signup' ? 'Create your workspace' : 'Welcome back'}
      </h2>
      <p className="mt-1 text-sm text-slate-300">
        {mode === 'signup'
          ? 'Workspace + owner account in one step.'
          : 'Access FlowBoard with your credentials.'}
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-sm text-slate-300">Email</label>
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {mode === 'signup' && (
          <div className="space-y-1">
            <label className="text-sm text-slate-300">Workspace Name</label>
            <input
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
              type="text"
              required
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>
        )}
        <div className="space-y-1">
          <label className="text-sm text-slate-300">Password</label>
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-400"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
        >
          {loading ? 'Working...' : mode === 'signup' ? 'Create account' : 'Login'}
        </button>
      </form>
    </div>
  );
}

