import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface TicketItem {
  id: string;
  category: string;
  subject: string;
  description: string;
  date: string;
  status: string;
}

const Ticket: React.FC = () => {
  const [tickets, setTickets] = useState<TicketItem[]>([
    { id: 'TCK-801', category: 'IT Support', subject: 'VPN login handshake failure', description: 'Cannot log in to company VPN from home network', date: '2026-07-01', status: 'Pending' },
    { id: 'TCK-802', category: 'Finance/Payroll', subject: 'Form 16 Tax statement mismatch', description: 'Tax calculation mismatch on Form 16', date: '2026-06-30', status: 'Resolved' },
    { id: 'TCK-803', category: 'HR Operations', subject: 'Workspace ergonomic setup request', description: 'Request for standing desk adjustment', date: '2026-06-29', status: 'Resolved' },
  ]);

  const [ticketCategory, setTicketCategory] = useState('IT Support');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    const newTicketId = `TCK-${801 + tickets.length}`;
    const newTicket: TicketItem = {
      id: newTicketId,
      category: ticketCategory,
      subject: ticketSubject,
      description: ticketDesc,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setTickets([newTicket, ...tickets]);
    setTicketSubject('');
    setTicketDesc('');
    toast.success(`Ticket raised successfully! Ticket ID: ${newTicketId}`);
  };

  return (
    <div className="max-w-full space-y-6 animate-scaleUp">
      {/* Ticket Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Tickets Raised", val: `${tickets.length} Tickets`, desc: "Lifetime history count", color: "border-l-4 border-blue-500" },
          { label: "Open/Pending Tickets", val: `${tickets.filter(t => t.status === 'Pending').length} Open`, desc: "Awaiting resolution", color: "border-l-4 border-amber-500" },
          { label: "Resolved Tickets", val: `${tickets.filter(t => t.status === 'Resolved').length} Resolved`, desc: "Successfully resolved", color: "border-l-4 border-emerald-500" },
        ].map((bal, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm ${bal.color} h-28 flex flex-col justify-between text-left`}>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{bal.label}</span>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mt-1">{bal.val}</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{bal.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-left">
        {/* Raise Ticket Form */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-black text-slate-700 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">Raise a Support Ticket</h3>
          <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block text-[10px] uppercase text-slate-400 mb-1">Category</label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] bg-white cursor-pointer text-slate-808"
              >
                <option value="IT Support">IT Support</option>
                <option value="Finance/Payroll">Finance/Payroll</option>
                <option value="HR Operations">HR Operations</option>
                <option value="Facility/Security">Facility/Security</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase text-slate-405 mb-1">Subject</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Printer not working, salary slip delay"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] text-slate-808"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-slate-405 mb-1">Description</label>
              <textarea
                rows={3}
                value={ticketDesc}
                onChange={(e) => setTicketDesc(e.target.value)}
                placeholder="Provide details about the issue..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] resize-none text-slate-808"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0D47A1] hover:bg-blue-800 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md transition cursor-pointer"
            >
              Submit Ticket
            </button>
          </form>
        </div>

        {/* Ticket History */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-black text-slate-700 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">My Support Tickets</h3>
          <div className="overflow-x-auto border border-slate-200/80 rounded-2xl bg-white shadow-xs">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-55 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-655 font-semibold">
                {tickets.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-bold text-slate-400">{item.id}</td>
                    <td className="p-3 font-bold text-slate-808">{item.category}</td>
                    <td className="p-3 font-medium text-slate-500 truncate max-w-[180px]" title={item.description}>{item.subject}</td>
                    <td className="p-3 font-medium text-slate-500">{item.date}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider
                        ${item.status === 'Resolved' ? 'text-emerald-707 bg-emerald-50 border-emerald-100' : 'text-amber-707 bg-amber-50 border-amber-100'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
