import { Plug, Globe, Zap, Database, Mail, MessageSquare, CreditCard, Shield } from 'lucide-react';

const integrations = [
  { name: 'Google Analytics', desc: 'Track website traffic and user behavior', icon: Globe, color: 'text-orange-500', bg: 'bg-orange-50', connected: true },
  { name: 'Mailchimp', desc: 'Email marketing and automation', icon: Mail, color: 'text-yellow-600', bg: 'bg-yellow-50', connected: false },
  { name: 'WhatsApp Business', desc: 'Customer communication via WhatsApp', icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-50', connected: true },
  { name: 'Razorpay', desc: 'Payment gateway integration', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50', connected: false },
  { name: 'reCAPTCHA', desc: 'Protect forms from spam and bots', icon: Shield, color: 'text-red-500', bg: 'bg-red-50', connected: true },
  { name: 'Zapier', desc: 'Connect apps and automate workflows', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50', connected: false },
  { name: 'Firebase', desc: 'Push notifications and real-time data', icon: Database, color: 'text-amber-500', bg: 'bg-amber-50', connected: false },
  { name: 'Slack', desc: 'Team notifications and alerts', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50', connected: false },
];

export default function IntegrationsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
          <Plug className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Integrations</h1>
          <p className="text-sm text-slate-500">Connect third-party services and tools to enhance your platform</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Available', value: integrations.length, color: 'text-slate-700', bg: 'bg-slate-100' },
          { label: 'Connected', value: integrations.filter(i => i.connected).length, color: 'text-green-700', bg: 'bg-green-100' },
          { label: 'Pending', value: integrations.filter(i => !i.connected).length, color: 'text-amber-700', bg: 'bg-amber-100' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {integrations.map(integration => (
          <div
            key={integration.name}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl ${integration.bg} flex items-center justify-center`}>
                <integration.icon className={`w-5 h-5 ${integration.color}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                integration.connected
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {integration.connected ? 'Connected' : 'Not connected'}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{integration.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{integration.desc}</p>
            </div>
            <button className={`mt-auto text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors duration-200 ${
              integration.connected
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white hover:opacity-90'
            }`}>
              {integration.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
