import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { meetingApi } from '../lib/meetingApi';

interface MeetingSchedulerProps {
  onClose?: () => void;
  isModal?: boolean;
}

const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({ onClose, isModal = false }) => {
  // Current viewed month and year (defaults to today)
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  // Selected date state
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00am');
  const [is24h, setIs24h] = useState<boolean>(false);
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [attendeeEmail, setAttendeeEmail] = useState<string>('');
  const [attendeeName, setAttendeeName] = useState<string>('');
  const [attendeePhone, setAttendeePhone] = useState<string>('');
  const [meetingType, setMeetingType] = useState<string>('virtual');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const amPmSlots = [
    '9:00am', '9:30am', '10:00am', '10:30am', '11:00am', '11:30am',
    '12:00pm', '12:30pm', '1:00pm', '1:30pm', '2:00pm', '2:30pm',
    '3:00pm', '3:30pm', '4:00pm', '4:30pm', '5:00pm', '6:00pm', '7:00pm', '8:00pm', '9:00pm'
  ];

  const militarySlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const slots = is24h ? militarySlots : amPmSlots;

  // Calculate days in the viewed month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Calculate day of the week for the 1st of the viewed month
  const startOffset = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleDaySelect = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const handleSlotClick = (slot: string) => {
    setSelectedTimeSlot(slot);
  };

  const getSelectedDateString = () => {
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // ─── Convert time-slot string to HH:MM (24h) ───────────────────────────
  const slotTo24h = (slot: string): string => {
    // If already in 24h format (e.g. "09:30") return as-is
    if (/^\d{2}:\d{2}$/.test(slot)) return slot;
    const [time, meridiem] = slot.split(/(am|pm)/i);
    let [h, m] = time.split(':').map(Number);
    if (meridiem.toLowerCase() === 'pm' && h !== 12) h += 12;
    if (meridiem.toLowerCase() === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!attendeeName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!meetingTitle.trim()) {
      toast.error('Please enter a meeting title');
      return;
    }
    if (!attendeeEmail.trim() || !attendeeEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build start_time and end_time as ISO strings
      const startHHMM = slotTo24h(selectedTimeSlot);
      const [sh, sm] = startHHMM.split(':').map(Number);
      const startDate = new Date(selectedDate);
      startDate.setHours(sh, sm, 0, 0);

      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1); // default 1-hour duration

      await meetingApi.create({
        client_name: attendeeName.trim(),
        client_email: attendeeEmail.trim(),
        client_phone: attendeePhone.trim() || undefined,
        title: meetingTitle.trim(),
        meeting_type: meetingType as 'virtual' | 'in_person',
        platform: meetingType === 'virtual' ? 'Zoom' : undefined,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
      });

      const label = meetingType === 'virtual' ? 'Virtual' : 'In-Person';
      const dateStr = selectedDate.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      });
      toast.success(`✅ Meeting "${meetingTitle}" (${label}) booked for ${dateStr} at ${selectedTimeSlot}!`);

      // Reset form
      setMeetingTitle('');
      setAttendeeName('');
      setAttendeeEmail('');
      setAttendeePhone('');
      setMeetingType('virtual');
      if (onClose) onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to schedule meeting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`relative w-full max-w-4xl bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-[0_20px_50px_rgba(0,118,216,0.06)] overflow-hidden ${isModal ? 'max-h-[90vh] overflow-y-auto' : ''}`}>
      {/* Close button for Modal */}
      {isModal && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors z-10 p-1.5 rounded-full hover:bg-slate-100"
          aria-label="Close dialog"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Main Header */}
      <div className="flex flex-col items-center pt-5 pb-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-[#0c1e4a] font-sans text-center">Schedule a Meeting</h2>
        <div className="w-12 h-1 bg-[#ffd801] mt-1.5 rounded-full" />
      </div>

      {/* Scheduler Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-5">

        {/* LEFT COLUMN: Calendar Grid */}
        <div className="md:col-span-7 flex flex-col bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 shadow-sm justify-between">
          <div>
            {/* Calendar Month & Year Header with Nav Arrows */}
            <div className="flex items-center justify-between mb-3 px-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 hover:text-[#0076d8] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h3 className="text-base font-bold text-[#0c1e4a] tracking-wide">
                {monthNames[currentMonth]} {currentYear}
              </h3>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 hover:text-[#0076d8] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1.5 mb-2 text-center">
              {weekDays.map((day) => (
                <span key={day} className="text-[10px] font-bold text-slate-400 py-0.5">{day}</span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty slots for starting offset */}
              {Array.from({ length: startOffset }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square bg-slate-100/40 rounded-lg border border-slate-200/10" />
              ))}

              {/* Calendar Days */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;

                // Check if this day is currently selected
                const isSelected =
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === currentMonth &&
                  selectedDate.getFullYear() === currentYear;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDaySelect(day)}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-200 border
                      ${isSelected
                        ? 'bg-[#0076d8] text-white border-[#0076d8] shadow-[0_3px_8px_rgba(0,118,216,0.25)] scale-105'
                        : 'bg-white text-slate-800 hover:bg-[#0076d8]/10 hover:text-[#0076d8] border-slate-200'
                      }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Time slots & Form */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">

          {/* Selected Date & Format Switcher */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-[#0c1e4a]">{getSelectedDateString()}</h3>

            {/* 12h/24h toggle */}
            <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-[10px]">
              <button
                type="button"
                onClick={() => setIs24h(false)}
                className={`px-2 py-0.5 transition-all ${!is24h ? 'bg-[#0076d8] text-white font-bold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                12h
              </button>
              <button
                type="button"
                onClick={() => setIs24h(true)}
                className={`px-2 py-0.5 transition-all ${is24h ? 'bg-[#0076d8] text-white font-bold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                24h
              </button>
            </div>
          </div>

          {/* Grid Time Slots (Replaces vertical scrolling list with 3-column grid) */}
          <div className="grid grid-cols-3 gap-1.5 max-h-[110px] overflow-y-auto pr-1 custom-scrollbar">
            {slots.map((slot) => {
              const isSelected = selectedTimeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleSlotClick(slot)}
                  className={`py-1.5 px-2 rounded-lg font-semibold text-xs text-center border transition-all duration-200
                    ${isSelected
                      ? 'bg-[#0076d8] text-white border-[#0076d8] shadow-[0_2px_6px_rgba(0,118,216,0.15)]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#0076d8]/45 hover:bg-blue-50/20'
                    }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>

          {/* Schedule Form (Reorganized into 2 columns to save vertical space) */}
          <form onSubmit={handleSchedule} className="flex flex-col bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-[#0076d8] uppercase tracking-wider mb-0.5">Meeting details</h4>

            <div className="space-y-2">
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-white text-slate-800 placeholder-slate-400 rounded-md border border-slate-200 py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#0076d8] focus:border-[#0076d8]"
                  required
                />
                <input
                  type="email"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-white text-slate-800 placeholder-slate-400 rounded-md border border-slate-200 py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#0076d8] focus:border-[#0076d8]"
                  required
                />
              </div>

              {/* Row 2: Phone and Meeting Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="tel"
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  placeholder="Phone number (optional)"
                  className="w-full bg-white text-slate-800 placeholder-slate-400 rounded-md border border-slate-200 py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#0076d8] focus:border-[#0076d8]"
                />
                <select
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value)}
                  className="w-full bg-white text-slate-800 rounded-md border border-slate-200 py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#0076d8] focus:border-[#0076d8] cursor-pointer"
                >
                  <option value="virtual">Virtual (Zoom / Meet)</option>
                  <option value="in_person">In-Person Meeting</option>
                </select>
              </div>

              {/* Row 3: Meeting Title */}
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Meeting title / purpose"
                className="w-full bg-white text-slate-800 placeholder-slate-400 rounded-md border border-slate-200 py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#0076d8] focus:border-[#0076d8]"
                required
              />
            </div>

            {/* Row 4: Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0076d8] hover:bg-[#0066c0] text-white font-bold py-2 px-4 rounded-md transition-all duration-200 text-xs shadow-[0_3px_8px_rgba(0,118,216,0.12)] hover:shadow-[0_4px_12px_rgba(0,118,216,0.2)] disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Scheduling...
                </>
              ) : (
                'Schedule Meeting'
              )}
            </button>
          </form>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 118, 216, 0.03);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 118, 216, 0.25);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 118, 216, 0.45);
        }
      `}</style>
    </div>
  );
}

export default MeetingScheduler;
