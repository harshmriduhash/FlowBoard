export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      tagline: 'For solo operators validating a workflow.',
      features: ['1 workflow', 'Up to 50 items', 'Basic audit logs'],
    },
    {
      name: 'Pro',
      price: '$29/mo',
      tagline: 'For teams running core business processes.',
      features: ['Unlimited workflows', 'Unlimited items', 'Advanced filters & search', 'Priority support'],
    },
    {
      name: 'Team',
      price: '$99/mo',
      tagline: 'For ops-heavy orgs that need guarantees.',
      features: ['Everything in Pro', 'SLA & uptime commitments', 'Exports & backups', 'Dedicated onboarding'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-wide text-cyan-300">Pricing</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100">Plans built for real ops work.</h1>
        <p className="mt-2 text-sm text-slate-300">
          Start free, then upgrade when FlowBoard becomes the heartbeat of your workflows.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-cyan-200">{plan.name}</p>
            <p className="mt-2 text-2xl font-bold text-slate-100">{plan.price}</p>
            <p className="mt-1 text-xs text-slate-300">{plan.tagline}</p>
            <ul className="mt-3 flex-1 space-y-1 text-xs text-slate-300">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full rounded-md bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400">
              {plan.name === 'Free' ? 'Get started' : 'Talk to sales'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
