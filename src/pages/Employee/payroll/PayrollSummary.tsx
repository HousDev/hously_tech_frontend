import React from "react";
import { Briefcase, CreditCard, ChevronRight, TrendingUp, ShieldCheck } from "lucide-react";

interface HikeHistory {
  date: string;
  previousCTC: number;
  newCTC: number;
  hikePercentage: number;
  designation: string;
}

export default function PayrollSummary() {
  const employeeSalary = {
    grossAnnual: 1200000,
    monthlyGross: 100000,
    basic: 50000,
    hra: 25000,
    specialAllowance: 15000,
    pfContribution: 6000,
    professionalTax: 200,
    estimatedTDS: 3800,
  };

  const hikeTimeline: HikeHistory[] = [
    {
      date: "April 01, 2026",
      previousCTC: 1020000,
      newCTC: 1200000,
      hikePercentage: 17.6,
      designation: "MTS-2",
    },
    {
      date: "April 01, 2025",
      previousCTC: 900000,
      newCTC: 1020000,
      hikePercentage: 13.3,
      designation: "MTS-1",
    },
  ];

  const formatCurrency = (val: number) => {
    return "₹" + Math.round(val).toLocaleString("en-IN");
  };

  const netMonthly =
    employeeSalary.monthlyGross -
    (employeeSalary.pfContribution +
      employeeSalary.professionalTax +
      employeeSalary.estimatedTDS);

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Annual CTC Package</p>
            <h3 className="text-xl font-black text-slate-800 mt-1">{formatCurrency(employeeSalary.grossAnnual)}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Fixed Gross Salary</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Monthly In-Hand (Est.)</p>
            <h3 className="text-xl font-black text-emerald-600 mt-1">{formatCurrency(netMonthly)}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Credited to Bank Account</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Increment Hike</p>
            <h3 className="text-xl font-black text-purple-600 mt-1">+17.6%</h3>
            <p className="text-[10px] text-purple-500 font-semibold mt-0.5">Effective Apr 2026</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-800">Monthly Compensation Breakdown</h3>
            <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md text-slate-500">
              FY 2026-27
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Earnings (Base & Allowances)</p>
              <div className="space-y-2 text-xs font-semibold text-slate-655">
                <div className="flex justify-between p-2 bg-slate-50/50 rounded-xl">
                  <span>Basic Salary</span>
                  <span className="font-bold text-slate-800">{formatCurrency(employeeSalary.basic)}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50/50 rounded-xl">
                  <span>House Rent Allowance (HRA)</span>
                  <span className="font-bold text-slate-800">{formatCurrency(employeeSalary.hra)}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50/50 rounded-xl">
                  <span>Special Allowance</span>
                  <span className="font-bold text-slate-800">{formatCurrency(employeeSalary.specialAllowance)}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-100/50 rounded-xl text-slate-800 font-bold border-t border-slate-200">
                  <span>Total Gross Earnings</span>
                  <span>{formatCurrency(employeeSalary.monthlyGross)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-[9px] font-black text-rose-500 uppercase tracking-wider">Deductions & Contributions</p>
              <div className="space-y-2 text-xs font-semibold text-slate-655">
                <div className="flex justify-between p-2 bg-rose-50/20 rounded-xl">
                  <span>Employee Provident Fund (EPF)</span>
                  <span className="font-bold text-rose-600">-{formatCurrency(employeeSalary.pfContribution)}</span>
                </div>
                <div className="flex justify-between p-2 bg-rose-50/20 rounded-xl">
                  <span>Estimated TDS (Income Tax)</span>
                  <span className="font-bold text-rose-600">-{formatCurrency(employeeSalary.estimatedTDS)}</span>
                </div>
                <div className="flex justify-between p-2 bg-rose-50/20 rounded-xl">
                  <span>Professional Tax (PT)</span>
                  <span className="font-bold text-rose-600">-{formatCurrency(employeeSalary.professionalTax)}</span>
                </div>
                <div className="flex justify-between p-2 bg-rose-100/20 rounded-xl text-rose-800 font-bold border-t border-rose-200">
                  <span>Total Deductions</span>
                  <span>-{formatCurrency(employeeSalary.pfContribution + employeeSalary.estimatedTDS + employeeSalary.professionalTax)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-800">Increment & CTC Timeline</h3>
            </div>

            <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-6 my-2 text-xs">
              {hikeTimeline.map((hike, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-white ring-4 ring-purple-50" />
                  
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-404 font-bold">{hike.date}</p>
                    <p className="font-bold text-slate-800">{hike.designation}</p>
                    <div className="flex items-center gap-2 text-slate-500 font-semibold mt-1">
                      <span>{formatCurrency(hike.previousCTC)}</span>
                      <ChevronRight className="w-3 h-3 text-slate-300" />
                      <span className="text-purple-650 font-bold">{formatCurrency(hike.newCTC)}</span>
                      <span className="ml-auto bg-purple-50 text-purple-700 font-extrabold px-1.5 py-0.5 rounded text-[9px]">
                        +{hike.hikePercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-2.5 text-xs text-slate-550 font-semibold mt-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Your salary components and hikes are locked by HR. Contact the Finance team for clarifications on CTC breakdown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
