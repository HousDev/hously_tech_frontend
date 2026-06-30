import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import MeetingScheduler from '../../components/MeetingScheduler';

export default function ScheduleMeetingPage() {
  return (
    <>
      <Breadcrumb />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              Book a <span className="text-[#0076d8]">Meeting</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Select your preferred day and time slot to schedule a virtual session with Hously's support team.
            </p>
            <div className="w-24 h-1 bg-[#ffd801] mx-auto mt-4 rounded-full" />
          </div>

          {/* Meeting Scheduler component */}
          <div className="w-full flex justify-center mt-4">
            <MeetingScheduler />
          </div>
        </div>
      </div>
    </>
  );
}
