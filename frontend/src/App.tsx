import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { setAuthToken } from './lib/api';
import type { AuthState } from './lib/auth';
import { clearAuth, loadAuth, saveAuth } from './lib/auth';
import DashboardPage from './pages/Dashboard';
import WorkflowsPage from './pages/Workflows';
import WorkflowDetailPage from './pages/WorkflowDetail';
import ItemDetailPage from './pages/ItemDetail';
import AuthPage from './pages/AuthPage';
import PricingPage from './pages/Pricing';

function App() {
  const [auth, setAuth] = useState<AuthState>(() => loadAuth());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setAuthToken(auth.accessToken || null);
  }, [auth.accessToken]);

  const isAuthed = !!auth.accessToken;

  const handleAuth = (next: AuthState) => {
    setAuth(next);
    saveAuth(next);
  };

  const handleLogout = () => {
    clearAuth();
    setAuth({ accessToken: null, refreshToken: null });
    setAuthToken(null);
    navigate('/login');
  };

  const navItems = useMemo(
    () => [
      { to: '/app/dashboard', label: 'Dashboard' },
      { to: '/app/workflows', label: 'Workflows' },
    ],
    []
  );

  return (
    <div className="min-h-screen text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-cyan-300">
            FlowBoard
          </Link>
          {isAuthed ? (
            <div className="flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm text-slate-200 hover:text-cyan-200"
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-100 hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/pricing" className="text-sm text-slate-200 hover:text-cyan-200">
                Pricing
              </Link>
              <Link to="/login" className="text-sm text-slate-200 hover:text-cyan-200">
                Login
              </Link>
              <Link to="/signup" className="text-sm text-slate-200 hover:text-cyan-200">
                Signup
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<AuthPage mode="login" onAuth={handleAuth} />} />
          <Route path="/signup" element={<AuthPage mode="signup" onAuth={handleAuth} />} />
          <Route
            path="/app/*"
            element={
              <RequireAuth authed={isAuthed} redirectTo="/login" location={location}>
                <Routes>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="workflows" element={<WorkflowsPage />} />
                  <Route path="workflows/:id" element={<WorkflowDetailPage />} />
                  <Route path="items/:id" element={<ItemDetailPage />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function RequireAuth({
  authed,
  redirectTo,
  children,
  location,
}: {
  authed: boolean;
  redirectTo: string;
  children: React.ReactElement;
  location: ReturnType<typeof useLocation>;
}) {
  if (!authed) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  return children;
}

function Landing() {
  return (
    <div className="grid gap-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-xl">
      <div>
        <p className="text-sm uppercase tracking-wide text-cyan-300">FlowBoard</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100">
          Workflow state engine + ops dashboard
        </h1>
        <p className="mt-2 text-slate-300">
          State-based workflows, event-driven transitions, immutable audit logs, and role-based
          control. Built to ship today.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/signup"
          className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-cyan-300 hover:text-cyan-200"
        >
          Login
        </Link>
      </div>
      <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-3">
        <Feature title="Auditability">Immutable EventLog per item keeps every change.</Feature>
        <Feature title="Strict State Control">Transitions are validated against workflow rules.</Feature>
        <Feature title="Role-Based Permissions">Owner/Admin/Operator/Viewer enforcement.</Feature>
      </div>
    </div>
  );
}

function Feature({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <p className="text-sm font-semibold text-cyan-200">{title}</p>
      <p className="mt-1 text-xs text-slate-300">{children}</p>
    </div>
  );
}

export default App;

