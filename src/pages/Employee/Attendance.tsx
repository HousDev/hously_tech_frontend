import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Clock,
  MapPin,
  Calendar,
  Check,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Camera,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  Palmtree
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { attendanceApi } from '../../lib/attendanceApi';

interface AttendanceLog {
  date: string;
  shift: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  workMode: 'Office' | 'Remote' | 'Client Site';
  status: 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent';
  checkInLat?: number | null;
  checkInLng?: number | null;
  checkOutLat?: number | null;
  checkOutLng?: number | null;
  faceCapture?: string;
  faceCaptureOut?: string;
}

interface RegularizationRequest {
  id: string;
  date: string;
  requestedIn: string;
  requestedOut: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedOn: string;
}

// Pure helper function declared outside React scope to resolve ReferenceError
const calculateWorkingHours = (inTime: string, outTime: string): string => {
  try {
    const parseTime = (tStr: string) => {
      if (!tStr || tStr === '-') return 0;
      const [time, ampm] = tStr.split(' ');
      let [hrs, mins] = time.split(':').map(Number);
      if (ampm === 'PM' && hrs !== 12) hrs += 12;
      if (ampm === 'AM' && hrs === 12) hrs = 0;
      return hrs * 60 + mins;
    };
    const diffMins = parseTime(outTime) - parseTime(inTime);
    if (diffMins <= 0) return '00h 00m';
    const h = Math.floor(diffMins / 60);
    const m = diffMins % 60;
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
  } catch (e) {
    return '08h 00m';
  }
};

const Attendance: React.FC = () => {
  const today = new Date();

  // Helper to format local date string (YYYY-MM-DD)
  const getLocalDateString = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Real-time ticking clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (t: Date) => {
    const hours = t.getHours();
    const minutes = t.getMinutes();
    const seconds = t.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(displayHours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
  };

  const formatDateLong = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // State for check-in / check-out
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [workMode, setWorkMode] = useState<'Office' | 'Remote' | 'Client Site'>('Office');
  const [selectedShift, setSelectedShift] = useState<string>('General (9AM–6PM)');
  const [assignedBranch, setAssignedBranch] = useState<{ name: string; address: string; latitude: number; longitude: number } | null>(null);
  const [securitySettings, setSecuritySettings] = useState<any>(null);
  const [weekOffDays, setWeekOffDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Biometric scanner state simulation
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<'idle' | 'initializing' | 'face' | 'gps' | 'success' | 'failed'>('idle');
  const [punchError, setPunchError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  // Dynamic stat counters
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalLate, setTotalLate] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [totalHalfDays, setTotalHalfDays] = useState(0);
  const [totalWeekOffs, setTotalWeekOffs] = useState(0);

  // Webcam video stream states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Popups/Modals active states
  const [punchPopup, setPunchPopup] = useState<{ isOpen: boolean; isCheckingIn: boolean } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isIssuePopupOpen, setIsIssuePopupOpen] = useState(false);
  const [liveAddress, setLiveAddress] = useState<string | null>(null);

  // Issue reporting states
  const [issueReason, setIssueReason] = useState('');
  const [issueCategory, setIssueCategory] = useState('GPS Boundary Mismatch');

  // Log history
  const [logs, setLogs] = useState<AttendanceLog[]>([]);

  // Sync attendance with backend database
  const syncAttendanceStatus = async () => {
    try {
      setLoading(true);
      const statusData = await attendanceApi.getStatus();
      setIsCheckedIn(statusData.isCheckedIn);
      setCheckInTime(statusData.checkInTime);
      setAssignedBranch(statusData.assignedBranch);
      setSecuritySettings(statusData.securitySettings);
      if ((statusData as any).weekOffDays) {
        setWeekOffDays((statusData as any).weekOffDays);
      }

      const logsData = await attendanceApi.getLogs();
      setLogs(logsData);

      // Load regularization + issue requests from backend
      try {
        const regData = await attendanceApi.getRegularizations();
        setRequests(regData);
      } catch (_) {/* ignore if fails silently */ }
    } catch (err) {
      console.error('Failed to sync attendance:', err);
      toast.error('Failed to load attendance configurations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncAttendanceStatus();
  }, []);

  // Calendar date state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const startDay = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Table Month Filters
  const [tableMonth, setTableMonth] = useState(calendarDate.getMonth());
  const [tableYear, setTableYear] = useState(calendarDate.getFullYear());

  // Keep table selection synced with Calendar date changes
  useEffect(() => {
    setTableMonth(calendarDate.getMonth());
    setTableYear(calendarDate.getFullYear());
  }, [calendarDate]);

  // Week Off Helper — Only Sunday is week off
  const getWeekOffsCount = (year: number, month: number) => {
    let count = 0;
    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      const dayOfWeek = new Date(year, month, i).getDay();
      if (dayOfWeek === 0) { // Sunday only
        count++;
      }
    }
    return count;
  };

  // Sync / Calculate stats dynamically
  useEffect(() => {
    const present = logs.filter(l => l.status?.toLowerCase() === 'present').length;
    // Count unique DATES with Late status (multiple check-ins on same day = 1 late)
    const lateDates = new Set(logs.filter(l => l.status?.toLowerCase() === 'late').map(l => l.date));
    const late = lateDates.size;
    const leave = logs.filter(l => l.status?.toLowerCase() === 'on_leave' || l.status?.toLowerCase() === 'on leave').length;
    const half = logs.filter(l => l.status?.toLowerCase() === 'half_day' || l.status?.toLowerCase() === 'half day').length;

    // Calculate absent days
    let absent = 0;
    const currentDay = today.getDate();
    for (let i = 1; i <= currentDay; i++) {
      const formattedDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const log = logs.find(l => l.date === formattedDay);
      const d = new Date(today.getFullYear(), today.getMonth(), i);
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && !log) {
        absent++;
      }
      if (log && log.status?.toLowerCase() === 'absent') {
        absent++;
      }
    }

    setTotalPresent(present);
    setTotalLate(late);
    setTotalLeaves(leave);
    setTotalHalfDays(half);
    setTotalAbsent(absent);
    setTotalWeekOffs(getWeekOffsCount(calendarDate.getFullYear(), calendarDate.getMonth()));
  }, [logs, calendarDate]);

  // Average Hours Calculation
  const [avgHoursStr, setAvgHoursStr] = useState('8:00h');
  useEffect(() => {
    const validLogs = logs.filter(l => l.status?.toLowerCase() === 'present' && l.hours !== 'In Progress' && l.hours !== '-');
    if (validLogs.length > 0) {
      let totalMins = 0;
      validLogs.forEach(l => {
        const matches = l.hours.match(/(\d+)h\s*(\d+)m/);
        if (matches) {
          const h = parseInt(matches[1]);
          const m = parseInt(matches[2]);
          totalMins += h * 60 + m;
        }
      });
      const avgMins = Math.round(totalMins / validLogs.length);
      const h = Math.floor(avgMins / 60);
      const m = avgMins % 60;
      setAvgHoursStr(`${h}:${String(m).padStart(2, '0')}h`);
    } else {
      setAvgHoursStr('8:00h');
    }
  }, [logs]);

  // Working hours dynamic calculations for today's clock ticker
  const [currentWorkingHours, setCurrentWorkingHours] = useState('00h 00m');

  useEffect(() => {
    if (isCheckedIn && checkInTime) {
      const updateTimer = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        setCurrentWorkingHours(calculateWorkingHours(checkInTime, timeStr));
      };
      updateTimer();
      const interval = setInterval(updateTimer, 30000);
      return () => clearInterval(interval);
    } else {
      const todayStr = getLocalDateString(new Date());
      const todayLog = logs.find(l => l.date === todayStr);
      if (todayLog && todayLog.checkOut !== '-') {
        setCurrentWorkingHours(todayLog.hours);
      } else {
        setCurrentWorkingHours('00h 00m');
      }
    }
  }, [isCheckedIn, checkInTime, logs]);

  // Webcam initialization
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const s = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      }
    } catch (err) {
      console.warn("Webcam access denied or unavailable", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Stop webcam when punch popup is closed
  useEffect(() => {
    if (!punchPopup) {
      stopCamera();
      setCameraActive(false);
    }
  }, [punchPopup]);

  const capturePhoto = (): string => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 320;
      canvas.height = videoRef.current.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg');
      }
    }
    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";
  };

  // Regularization and support requests list (fetched from backend)
  const [requests, setRequests] = useState<RegularizationRequest[]>([]);

  // Regularization modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regDate, setRegDate] = useState('');
  const [regIn, setRegIn] = useState('09:00');
  const [regOut, setRegOut] = useState('18:00');
  const [regReason, setRegReason] = useState('');

  // Detail Modal for day logs
  const [selectedDayDetail, setSelectedDayDetail] = useState<{
    date: string;
    dayNum: number;
    log?: AttendanceLog;
  } | null>(null);

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [checkInAddr, setCheckInAddr] = useState<string | null>(null);
  const [checkOutAddr, setCheckOutAddr] = useState<string | null>(null);

  // Previous 2 months restrictors for Calendar Navigation
  const currentMonthIndex = today.getFullYear() * 12 + today.getMonth();
  const calendarMonthIndex = calendarDate.getFullYear() * 12 + calendarDate.getMonth();

  const isPrevDisabled = calendarMonthIndex <= currentMonthIndex - 2;
  const isNextDisabled = calendarMonthIndex >= currentMonthIndex;

  const handlePrevMonth = () => {
    if (!isPrevDisabled) {
      setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1));
    }
  };

  const handleNextMonth = () => {
    if (!isNextDisabled) {
      setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1));
    }
  };

  // Calendar Day Colors
  // Day-of-week names matching what backend stores
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Is today a weekly off day for this employee?
  const todayDayName = DAY_NAMES[today.getDay()];
  const isWeeklyOff = weekOffDays.length > 0 && weekOffDays.includes(todayDayName);

  const getDayStatusColor = (dayNum: number) => {
    const formattedDay = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const log = logs.find(l => l.date === formattedDay);

    // Check if today is active
    const todayStr = getLocalDateString(today);
    const isActiveToday = isCheckedIn && formattedDay === todayStr;

    if (isActiveToday) {
      return 'bg-emerald-600 text-white border-emerald-700 font-semibold shadow-xs';
    }

    const d = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), dayNum);
    const dayName = DAY_NAMES[d.getDay()];

    // Check if this calendar day is a weekly off for this employee
    if (weekOffDays.length > 0 && weekOffDays.includes(dayName)) {
      return 'bg-slate-50 text-slate-500 border-slate-200 font-semibold';
    }

    if (!log) {
      if (d > today) return 'bg-white text-slate-400 border-slate-200';
      return 'bg-red-500 text-white border-red-600 font-semibold shadow-xs';
    }

    const s = log.status?.toLowerCase();

    if (s === 'on_leave' || s === 'on leave') {
      return 'bg-purple-600 text-white border-purple-700 font-semibold shadow-xs';
    }

    if (s === 'absent') {
      return 'bg-red-500 text-white border-red-600 font-semibold shadow-xs';
    }

    if (s === 'week_off' || s === 'week off') {
      return 'bg-slate-50 text-slate-500 border-slate-200 font-semibold';
    }

    if (s === 'holiday') {
      return 'bg-[#0d75db] border-[#0c6ecf] text-white font-semibold shadow-xs';
    }

    if (s === 'half_day' || s === 'half day') {
      return 'bg-orange-500 text-white border-orange-600 font-semibold shadow-xs';
    }

    if (s === 'late') {
      return 'bg-emerald-500 text-white border-emerald-600 font-semibold shadow-xs';
    }

    // Recorded present -> GREEN
    return 'bg-emerald-500 text-white border-emerald-600 font-semibold shadow-xs';
  };

  // Open biometric punch popup
  const handleOpenPunchPopup = (isCurrentlyIn: boolean) => {
    setPunchPopup({ isOpen: true, isCheckingIn: !isCurrentlyIn });
  };

  const handleClosePunchPopup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    setIsScanning(false);
    setScanStep('idle');
    setScanProgress(0);
    setPunchPopup(null);
  };

  const handleStartPunch = async (isCheckingIn: boolean) => {
    if (isScanning) return;
    setPunchPopup(prev => prev ? { ...prev, isCheckingIn } : null);
    setIsScanning(true);
    setScanStep('initializing');
    setScanProgress(15);
    setCameraActive(true);

    let activeStream: MediaStream | null = stream;
    let lat = 0;
    let lng = 0;
    let gpsError: any = null;

    // 1. Initialize Camera and GPS concurrently
    const cameraPromise = (async () => {
      try {
        if (!activeStream && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          activeStream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
          setStream(activeStream);
          if (videoRef.current) {
            videoRef.current.srcObject = activeStream;
            videoRef.current.play().catch(e => console.warn("Video play error:", e));
          }
        }
      } catch (camErr) {
        console.warn("Camera load error:", camErr);
      }
    })();

    const gpsPromise = (async () => {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0
          });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        // Reverse geocode to get readable address
        try {
          const geoResp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const geoJson = await geoResp.json();
          const addr = geoJson?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          // Shorten to first 3 parts
          const shortAddr = addr.split(',').slice(0, 3).join(',').trim();
          setLiveAddress(shortAddr);
        } catch (_) {
          setLiveAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
      } catch (geoErr) {
        gpsError = geoErr;
      }
    })();

    try {
      // Step 1: Initializing Phase (0 to 1.5 seconds)
      await new Promise(r => setTimeout(r, 1500));
      
      // Step 2: Face Sweep Phase (1.5 to 3.2 seconds)
      setScanStep('face');
      setScanProgress(50);
      await new Promise(r => setTimeout(r, 1700));

      // Step 3: GPS Geofencing Phase (3.2 to 5.0 seconds)
      setScanStep('gps');
      setScanProgress(85);
      await new Promise(r => setTimeout(r, 1800));

      // 2. Await both background promises before proceeding to capture & submission
      await Promise.all([cameraPromise, gpsPromise]);

      if (gpsError) {
        toast.error("GPS location permission required. Please enable location access.");
        handleClosePunchPopup();
        return;
      }

      // Capture Photo now (at the 5.0-second mark!)
      let selfie = "";
      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 320;
        canvas.height = videoRef.current.videoHeight || 240;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          selfie = canvas.toDataURL('image/jpeg');
        }
      }
      if (!selfie) {
        selfie = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop";
      }

      const response = await attendanceApi.punch({
        isCheckingIn,
        latitude: lat,
        longitude: lng,
        selfieBase64: selfie,
        deviceInfo: navigator.userAgent,
        workMode,
        shift: selectedShift
      });

      // 6. Success
      setScanStep('success');
      setScanProgress(100);

      // Update state locally first to toggle dashboard buttons immediately
      if (isCheckingIn) {
        setIsCheckedIn(true);
        if (response.checkInTime) {
          setCheckInTime(response.checkInTime);
        }
      } else {
        setIsCheckedIn(false);
        setCheckInTime(null);
      }

      // Refresh logs and state from backend
      const updatedLogs = await attendanceApi.getLogs();
      setLogs(updatedLogs);

      const updatedStatus = await attendanceApi.getStatus();
      setIsCheckedIn(updatedStatus.isCheckedIn);
      setCheckInTime(updatedStatus.checkInTime);

      // Late arrival toast
      const punchMsg = response.message || "Attendance updated!";
      if (isCheckingIn && (punchMsg.toLowerCase().includes('late') || response.isLate)) {
        toast(
          () => (
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-lg">⚠️</span>
              <div>
                <p className="font-bold text-amber-700 text-sm">Late Arrival Marked</p>
                <p className="text-xs text-slate-600">{punchMsg}</p>
              </div>
            </div>
          ),
          { duration: 5000, style: { border: '1px solid #f59e0b', background: '#fffbeb' } }
        );
      } else {
        toast.success(punchMsg);
      }

      setTimeout(() => {
        if (activeStream) {
          activeStream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        setCameraActive(false);
        setIsScanning(false);
        setScanStep('idle');
        setPunchError(null);
        setLiveAddress(null);
        setPunchPopup(null);
      }, 3000);

    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "Attendance punch failed.";
      // Show failure INSIDE the popup camera box instead of just toast
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setCameraActive(false);
      setIsScanning(false);
      setScanStep('failed');
      setScanProgress(0);
      setPunchError(errMsg);
      // Auto-close after 3 seconds
      setTimeout(() => {
        setScanStep('idle');
        setPunchError(null);
        setLiveAddress(null);
        setPunchPopup(null);
      }, 3000);
    }
  };

  // Submit regularization — connected to backend
  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regDate || !regReason.trim()) {
      toast.error('Please input a valid date and correction reason.');
      return;
    }
    const formatTimeString = (t24: string) => {
      const [hStr, mStr] = t24.split(':');
      const h = parseInt(hStr);
      const ampm = h >= 12 ? 'PM' : 'AM';
      return `${String(h % 12 || 12).padStart(2, '0')}:${mStr} ${ampm}`;
    };
    try {
      const result = await attendanceApi.submitRegularization({
        type: 'regularization',
        date: regDate,
        requestedIn: formatTimeString(regIn),
        requestedOut: formatTimeString(regOut),
        reason: regReason,
      });
      toast.success(`Regularization submitted! ID: ${result.id}`);
      setIsModalOpen(false);
      setRegDate('');
      setRegReason('');
      // Refresh list
      const regData = await attendanceApi.getRegularizations();
      setRequests(regData);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit regularization.');
    }
  };

  // Report technical issue form submit handler – saves to backend DB
  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueReason.trim()) {
      toast.error('Please input details of the issue.');
      return;
    }
    try {
      const todayStr = getLocalDateString(new Date());
      const result = await attendanceApi.submitRegularization({
        type: 'issue',
        date: todayStr,
        reason: issueReason,
        category: issueCategory,
      });
      toast.success(`Support Ticket raised! Ticket ID: ${result.id}.`);
      setIssueReason('');
      setIsIssuePopupOpen(false);
      // Refresh list from backend
      const regData = await attendanceApi.getRegularizations();
      setRequests(regData);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit issue report.');
    }
  };

  // Helper status color parser
  const getStatusTagColor = (status: string) => {
    return {
      Pending: 'text-amber-707 bg-amber-50 border-amber-100',
      Approved: 'text-emerald-707 bg-emerald-50 border-emerald-100',
      Rejected: 'text-rose-707 bg-rose-50 border-rose-100'
    }[status] || 'text-slate-600 bg-slate-50 border-slate-100';
  };

  // Filter logs based on table Month & Year dropdowns
  const getFilteredLogs = () => {
    return logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getMonth() === tableMonth && logDate.getFullYear() === tableYear;
    });
  };

  const handleDayClick = async (dateStr: string, dayNum: number, log?: AttendanceLog) => {
    setCheckInAddr(null);
    setCheckOutAddr(null);
    setSelectedDayDetail({ date: dateStr, dayNum, log });
    
    // Reverse geocode the punch-in location if available
    if (log?.checkInLat && log?.checkInLng) {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${log.checkInLat}&lon=${log.checkInLng}`
        );
        const json = await resp.json();
        const addr = json?.display_name || `${log.checkInLat}, ${log.checkInLng}`;
        setCheckInAddr(addr.split(',').slice(0, 3).join(',').trim());
      } catch (_) {
        setCheckInAddr(`${log.checkInLat.toFixed(5)}, ${log.checkInLng.toFixed(5)}`);
      }
    }

    // Reverse geocode the punch-out location if available
    if (log?.checkOutLat && log?.checkOutLng) {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${log.checkOutLat}&lon=${log.checkOutLng}`
        );
        const json = await resp.json();
        const addr = json?.display_name || `${log.checkOutLat}, ${log.checkOutLng}`;
        setCheckOutAddr(addr.split(',').slice(0, 3).join(',').trim());
      } catch (_) {
        setCheckOutAddr(`${log.checkOutLat.toFixed(5)}, ${log.checkOutLng.toFixed(5)}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-40 min-h-[60vh] bg-slate-50/20">
        <Toaster position="top-right" />
        <RefreshCw className="w-10 h-10 text-[#0D47A1] animate-spin mb-3" />
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Syncing Attendance Parameters...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] w-full mx-auto px-2 sm:px-4 py-4 space-y-4 select-text text-slate-808 text-left animate-slideUp lg:h-[calc(100vh-95px)] lg:overflow-hidden lg:flex lg:flex-col">
      <Toaster position="top-right" />

      {/* CSS animation stylesheet */}
      <style>{`
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scaleUp {
          animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* 1. Seven Status Cards Grid (Directly matching image styling) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Card 1: Present Days */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-[105px]">
          <span className="text-slate-500 text-xs font-semibold">Present Days</span>
          <div className="flex items-center justify-between mt-2 mb-1">
            <span className="text-xl font-bold text-emerald-600">{totalPresent}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-slate-400 text-[10px] font-semibold">
            {Math.round((totalPresent / (totalPresent + totalAbsent || 1)) * 100)}% present
          </span>
        </div>

        {/* Card 2: Absent Days */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-[105px]">
          <span className="text-slate-500 text-xs font-semibold">Absent Days</span>
          <div className="flex items-center justify-between mt-2 mb-1">
            <span className="text-xl font-bold text-rose-600">{totalAbsent}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-50 text-rose-600">
              <X className="w-4 h-4" />
            </div>
          </div>
          <span className="text-slate-400 text-[10px] font-semibold">
            {Math.round((totalAbsent / (totalPresent + totalAbsent || 1)) * 100)}% absent
          </span>
        </div>

        {/* Card 3: Half Days */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-[105px]">
          <span className="text-slate-500 text-xs font-semibold">Half Days</span>
          <div className="flex items-center justify-between mt-2 mb-1">
            <span className="text-xl font-bold text-amber-600">{totalHalfDays}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-slate-400 text-[10px] font-semibold">{totalHalfDays} Half Days</span>
        </div>

        {/* Card 4: Paid Leaves Days */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-[105px]">
          <span className="text-slate-500 text-xs font-semibold">Paid Leaves Days</span>
          <div className="flex items-center justify-between mt-2 mb-1">
            <span className="text-xl font-bold text-purple-600">{totalLeaves}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600">
              <span className="font-bold text-sm">₹</span>
            </div>
          </div>
          <span className="text-slate-400 text-[10px] font-semibold">{totalLeaves} Paid Leaves Days</span>
        </div>

        {/* Card 5: Week Off Days */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-[105px]">
          <span className="text-slate-500 text-xs font-semibold">Week Off Days</span>
          <div className="flex items-center justify-between mt-2 mb-1">
            <span className="text-xl font-bold text-slate-700">{totalWeekOffs}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 text-slate-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <span className="text-slate-400 text-[10px] font-semibold">Week Off Days</span>
        </div>

        {/* Card 6: Late Arrivals Days */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-[105px]">
          <span className="text-slate-500 text-xs font-semibold">Late Arrivals Days</span>
          <div className="flex items-center justify-between mt-2 mb-1">
            <span className="text-xl font-bold text-orange-600">{totalLate}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50 text-orange-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-slate-400 text-[10px] font-semibold">
            {Math.round((totalLate / (totalPresent || 1)) * 100)}% late
          </span>
        </div>

        {/* Card 7: Avg. Hours */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-[105px]">
          <span className="text-slate-500 text-xs font-semibold">Avg. Hours</span>
          <div className="flex items-center justify-between mt-2 mb-1">
            <span className="text-xl font-bold text-blue-600">{avgHoursStr}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-slate-400 text-[10px] font-semibold">per employee</span>
        </div>
      </div>

      {/* 2. Sleek Action Buttons Row + Real-time Clock Timer placed to the right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 p-3 rounded-2xl border border-slate-100/50 shadow-2xs">
        <div className="flex items-center gap-3 flex-wrap">
          {isWeeklyOff ? (
            <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl">
              <span className="text-lg">🏖️</span>
              <div>
                <span className="text-xs font-bold text-slate-700 block">Weekly Off — {todayDayName}</span>
                <span className="text-[10px] text-slate-500 font-medium">Attendance marking disabled today</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenPunchPopup(isCheckedIn)}
              className="bg-[#0D47A1] hover:bg-blue-800 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95 flex items-center space-x-2 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-blue-200 animate-pulse" />
              <span>Mark {isCheckedIn ? 'Check-Out' : 'Check-In'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsIssuePopupOpen(true)}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-6 rounded-xl shadow-xs transition-all duration-200 flex items-center space-x-2 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Report Issue</span>
          </button>
        </div>

        {/* Real-time Ticking Clock widget placed directly on the right side of the buttons */}
        <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl shadow-2xs self-start sm:self-auto">
          <span className="text-sm font-bold text-slate-800 tabular-nums">{formatTime(time)}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
            {formatDateLong(time)}
          </span>
        </div>
      </div>

      {/* 3. Bottom Grid: Calendar (col-5) and Adjustment Logs Table (col-7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:flex-1 lg:min-h-0 lg:overflow-hidden">
        {/* Month-wise Interactive Calendar */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-md p-5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Attendance Calendar</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Click cells to view snaps</p>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={handlePrevMonth}
                disabled={isPrevDisabled}
                className={`p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer ${isPrevDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider min-w-[100px] text-center">
                {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
              </span>
              <button
                onClick={handleNextMonth}
                disabled={isNextDisabled}
                className={`p-1.5 rounded-lg hover:bg-slate-105 transition cursor-pointer ${isNextDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-3 uppercase">
            <span>
              <span className="hidden sm:inline">Sunday</span>
              <span className="sm:hidden">Sun</span>
            </span>
            <span>
              <span className="hidden sm:inline">Monday</span>
              <span className="sm:hidden">Mon</span>
            </span>
            <span>
              <span className="hidden sm:inline">Tuesday</span>
              <span className="sm:hidden">Tue</span>
            </span>
            <span>
              <span className="hidden sm:inline">Wednesday</span>
              <span className="sm:hidden">Wed</span>
            </span>
            <span>
              <span className="hidden sm:inline">Thursday</span>
              <span className="sm:hidden">Thu</span>
            </span>
            <span>
              <span className="hidden sm:inline">Friday</span>
              <span className="sm:hidden">Fri</span>
            </span>
            <span>
              <span className="hidden sm:inline">Saturday</span>
              <span className="sm:hidden">Sat</span>
            </span>
          </div>

          {/* Days cells (COMPLETELY REMOVED TIMING LABELS) */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold">
            {Array.from({ length: startDay }).map((_, i) => (
              <span key={`empty-${i}`} className="p-2.5" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const formattedDay = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayLog = logs.find(l => l.date === formattedDay);
              const classes = getDayStatusColor(dayNum);
              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => handleDayClick(formattedDay, dayNum, dayLog)}
                  className={`p-1.5 rounded-xl text-[11px] flex flex-col items-center justify-center min-h-[42px] transition-all duration-200 hover:scale-105 active:scale-95 border cursor-pointer ${classes}`}
                  title={`Date: ${dayNum} ${monthNames[calendarDate.getMonth()]}`}
                >
                  <span className="font-semibold">{dayNum}</span>
                  {dayLog && dayLog.status?.toLowerCase() === 'late' && (
                    <span className="text-[7px] font-black tracking-wider mt-0.5 text-yellow-300 uppercase">LATE</span>
                  )}
                  {dayLog && (dayLog.status?.toLowerCase() === 'half_day' || dayLog.status?.toLowerCase() === 'half day') && (
                    <span className="text-[6.5px] font-black tracking-wider mt-0.5 text-white/90 uppercase">HALF DAY</span>
                  )}
                  {dayLog && (dayLog.status?.toLowerCase() === 'on_leave' || dayLog.status?.toLowerCase() === 'on leave') && (
                    <span className="text-[7px] font-black tracking-wider mt-0.5 text-white/90 uppercase">LEAVE</span>
                  )}
                  {dayLog && dayLog.status?.toLowerCase() === 'holiday' && (
                    <Palmtree size={12} className="mt-0.5 text-white/90" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-[9px] font-semibold text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-600 inline-block" />
              <span>Present / Recorded</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-purple-600 border border-purple-700 inline-block" />
              <span>On Leave</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-orange-500 border border-orange-600 inline-block" />
              <span>Half Day</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-red-500 border border-red-600 inline-block" />
              <span>Absent (No In-Log Check)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#0d75db] border-[#0c6ecf] inline-flex items-center justify-center text-white"><Palmtree size={6} /></span>
              <span>Holiday</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-600 inline-flex items-center justify-center text-[5px] font-extrabold text-yellow-400">L</span>
              <span>Late Check-in</span>
            </div>
          </div>
        </div>

        {/* Adjustment Logs (Unified Scrollable Table - MNC Level Premium look, smaller text and no bold headers) */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-5 flex flex-col lg:h-full lg:min-h-0 lg:overflow-hidden border-none justify-between">
          <div className="flex flex-col lg:h-full lg:min-h-0 flex-grow">
            <div className="pb-3 border-b border-slate-100 mb-4 text-left flex-none">
              <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">Adjustment Logs</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Regularization & Issues</p>
            </div>

            {/* Scrollable Adjustment Table (MNC level professional styling) */}
            <div className="overflow-x-auto overflow-y-auto lg:flex-1 lg:min-h-0 bg-white rounded-2xl">
              <table className="w-full text-left border-collapse text-[10px] select-text">
                <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-xs z-10">
                  <tr className="text-slate-500 font-bold uppercase tracking-wider text-[8px] border-b border-slate-100">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Request Type & Reason</th>
                    <th className="py-3 px-4">Requested Shift</th>
                    <th className="py-3 px-4 text-center">Approval Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-normal text-slate-600">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                        No adjustment records found.
                      </td>
                    </tr>
                  ) : (
                    requests.map((req) => {
                      const isIssue = req.reason.startsWith('[Issue:');
                      const typeLabel = isIssue ? 'Issue Report' : 'Regularization';
                      const cleanReason = req.reason.replace(/^\[Issue:\s*[^\]]+\]\s*/, '').replace(/^\[Regularization\]\s*/, '');

                      return (
                        <tr key={req.id} className="hover:bg-blue-50/20 transition-all duration-150 border-b border-slate-50 last:border-0">
                          <td className="py-3.5 px-4 tabular-nums font-medium text-slate-500">
                            {new Date(req.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-3.5 px-4 max-w-[180px] truncate font-medium text-slate-700" title={req.reason}>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold mr-1.5 ${isIssue ? 'bg-rose-50 text-rose-600 border border-rose-100/50' : 'bg-blue-50 text-blue-600 border border-blue-100/50'}`}>
                              {typeLabel}
                            </span>
                            <span>{cleanReason}</span>
                          </td>
                          <td className="py-3.5 px-4 tabular-nums font-medium text-slate-500">
                            {req.requestedIn === '-' ? 'N/A' : `${req.requestedIn} - ${req.requestedOut}`}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[8px] font-bold border uppercase tracking-wider ${getStatusTagColor(req.status)}`}>
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[9px] text-slate-400 italic text-left mt-3 flex-none">
            * All tickets undergo automated compliance verification by HR.
          </p>
        </div>
      </div>

      {/* Modals & Popups */}

      {/* Mark Attendance Center Dialog Modal (Opaque background blurred with bg-black/10 backdrop-blur-md covering sidebar and navbar) */}
      {punchPopup && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300"
          style={{ zIndex: 9999 }}
        >

          {/* Main Card Viewport - Width expanded (max-w-sm to max-w-[360px]) and height h-[500px] to support larger camera box */}
          <div className="relative bg-white text-slate-808 rounded-3xl w-full max-w-[360px] h-[500px] shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-300 scale-100 animate-scaleUp flex flex-col justify-between p-6">

            {/* Header: clock & dynamic check-in/out title */}
            <div className="relative text-center pb-2.5 border-b border-slate-100 flex flex-col items-center w-full">
              <button
                type="button"
                onClick={handleClosePunchPopup}
                className="absolute top-0 right-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-all cursor-pointer z-10"
              >
                <X size={16} />
              </button>

              <h3 className="text-base font-black text-slate-808 tracking-tight">
                Attendance Terminal
              </h3>
              <span className="text-2xl font-black text-[#0D47A1] tabular-nums block mt-1">
                {formatTime(time)}
              </span>
              <span className="text-[10px] text-slate-404 font-bold uppercase tracking-wider block mt-0.5">
                {formatDateLong(time)}
              </span>
              {/* Duty Location — shown when GPS resolves */}
              <div className="flex items-center justify-center gap-1 mt-1.5">
                <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="text-[9px] font-bold text-slate-500 truncate max-w-[260px]">
                  {liveAddress
                    ? liveAddress
                    : assignedBranch
                      ? assignedBranch.name
                      : 'Detecting location...'}
                </span>
              </div>
            </div>

            {/* Centered Camera Screen (HEIGHT & WIDTH INCREASED to w-72 h-72, about 288px wide & tall) */}
            <div className="flex flex-col items-center my-3 relative">
              <div className="relative w-72 h-72 rounded-3xl overflow-hidden shadow-inner border-2 border-slate-205 bg-slate-950 flex items-center justify-center">

                {/* Live Webcam Video stream */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />

                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-404 p-4 text-center z-10 bg-slate-900 border border-slate-800">
                    <Camera className="w-10 h-10 text-[#0d47a1] opacity-80 mb-2.5 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-slate-200 tracking-widest">Webcam Offline</span>
                    <span className="text-[8px] font-bold text-slate-500 mt-1">
                      Click {punchPopup.isCheckingIn ? 'Check-In' : 'Check-Out'} below to start verification
                    </span>
                  </div>
                )}
                {cameraActive && !stream && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 p-4 text-center z-10 bg-slate-950">
                    <RefreshCw className="w-5 h-5 text-slate-450 animate-spin mb-1.5" />
                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Loading camera...</span>
                  </div>
                )}

                {/* Dashed face alignment guide silhouette overlay (Scaled up to match w-72 camera viewport) */}
                {stream && !isScanning && (
                  <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                    <div className="w-44 h-52 border-2 border-dashed border-white/40 rounded-[120px] animate-pulse" />
                  </div>
                )}

                {/* Scan Laser sweeps when verifying */}
                {isScanning && (
                  <>
                    <style>{`
                      @keyframes scan {
                        0% { top: 0%; }
                        50% { top: 100%; }
                        100% { top: 0%; }
                      }
                    `}</style>
                    {/* Sliding laser line */}
                    <div 
                      className="absolute left-0 w-full h-1 bg-cyan-400 opacity-90 shadow-[0_0_12px_#22d3ee] z-20 pointer-events-none" 
                      style={{ animation: 'scan 2.5s linear infinite' }}
                    />
                    {/* Glowing viewport gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-cyan-500/5 z-10 pointer-events-none" />
                    {/* Glowing pulsing scan corners */}
                    <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-cyan-400 rounded-tl-md shadow-[0_0_8px_#22d3ee] z-20 animate-pulse" />
                    <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-400 rounded-tr-md shadow-[0_0_8px_#22d3ee] z-20 animate-pulse" />
                    <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-cyan-400 rounded-bl-md shadow-[0_0_8px_#22d3ee] z-20 animate-pulse" />
                    <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-cyan-400 rounded-br-md shadow-[0_0_8px_#22d3ee] z-20 animate-pulse" />
                  </>
                )}

                {/* Step Banner overlay inside camera box */}
                {isScanning && scanStep !== 'success' && scanStep !== 'failed' && (
                  <div className="absolute inset-x-0 bottom-2 bg-slate-950/80 py-1.5 text-center text-white text-[8px] font-black uppercase tracking-widest leading-none z-20">
                    {scanStep === 'initializing' && 'Initializing Terminal...'}
                    {scanStep === 'face' && 'Aligning Face...'}
                    {scanStep === 'gps' && 'Verifying Location...'}
                  </div>
                )}

                {/* Success Verification overlay checkmark (Sahi ka icon) inside the camera box */}
                {scanStep === 'success' && (
                  <div className="absolute inset-0 bg-emerald-500 flex flex-col items-center justify-center z-30 text-white gap-1.5 animate-[fadeIn_0.15s_ease-out]">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <Check className="w-8 h-8 text-emerald-600 stroke-[3.5px]" />
                    </div>
                    <span className="text-[11px] font-black tracking-widest uppercase">Verified</span>
                    <span className="text-[9px] font-bold opacity-90">
                      {punchPopup.isCheckingIn ? 'Check-In Successful' : 'Check-Out Successful'}
                    </span>
                    <span className="text-[8px] font-bold opacity-80 tabular-nums">
                      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                {/* Failure Verification overlay — shown when face/location mismatch */}
                {scanStep === 'failed' && punchError && (
                  <div className="absolute inset-0 bg-rose-600 flex flex-col items-center justify-center z-30 text-white gap-2 animate-[fadeIn_0.15s_ease-out] px-4 text-center">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <X className="w-8 h-8 text-rose-600 stroke-[3.5px]" />
                    </div>
                    <span className="text-[11px] font-black tracking-widest uppercase">Verification Failed</span>
                    <span className="text-[9px] font-semibold opacity-90 leading-tight max-w-[220px]">
                      {punchError}
                    </span>
                    <span className="text-[8px] font-bold opacity-70 mt-1">Closing in 3s...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Check-In / Check-Out action button at the bottom */}
            <div className="w-full mt-2">
              {punchPopup.isCheckingIn ? (
                <button
                  type="button"
                  disabled={isScanning || scanStep === 'success'}
                  onClick={() => handleStartPunch(true)}
                  className="w-full py-3 text-sm font-black rounded-2xl transition cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed bg-[#0D47A1] text-white hover:bg-blue-808 shadow-md hover:shadow-lg active:scale-[0.98] transform duration-150"
                >
                  {isScanning ? 'Verifying...' : 'Check-In'}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isScanning || scanStep === 'success'}
                  onClick={() => handleStartPunch(false)}
                  className="w-full py-3 text-sm font-black rounded-2xl transition cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed bg-rose-600 text-white hover:bg-rose-700 shadow-md hover:shadow-lg active:scale-[0.98] transform duration-150"
                >
                  {isScanning ? 'Verifying...' : 'Check-Out'}
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* SalaryBox Styled Day Details Slide-up Modal (Opaque background blurred with bg-black/10 backdrop-blur-md covering sidebar and navbar) */}
      {selectedDayDetail && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300"
          style={{ zIndex: 9999 }}
        >
          <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 transform transition-all duration-300 scale-100 animate-scaleUp border-t-[4px] border-t-emerald-500 text-left">
            {/* Close Button */}
            <button
              onClick={() => setSelectedDayDetail(null)}
              className="absolute top-4 right-4 text-slate-405 hover:text-slate-655 hover:bg-slate-100 p-1.5 rounded-lg transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Selected Date Header */}
            <div className="mb-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">ATTENDANCE SUMMARY</span>
              <h3 className="text-xs font-black text-slate-808 mt-0.5">
                {new Date(selectedDayDetail.date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' })}
              </h3>
            </div>

            {selectedDayDetail.log ? (
              <div className="space-y-4">
                {/* Large Status Badge */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-550">Day Status</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider
                    ${selectedDayDetail.log.status === 'Present' ? 'text-emerald-707 bg-emerald-50 border-emerald-200' :
                      selectedDayDetail.log.status === 'Late' ? 'text-amber-707 bg-amber-50 border-amber-200' :
                        selectedDayDetail.log.status === 'Half Day' ? 'text-blue-707 bg-blue-50 border-blue-200' :
                          'text-purple-707 bg-purple-50 border-purple-200'
                    }`}
                  >
                    {selectedDayDetail.log.status}
                  </span>
                </div>

                {/* In & Out Grid with Thumbs */}
                <div className="grid grid-cols-2 gap-3">
                  {/* In Punch Card */}
                  <div className="bg-slate-55 border border-slate-100 p-3 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-404 uppercase tracking-wide">PUNCH IN</span>
                      <span className="text-xs font-black text-slate-808 mt-1 tabular-nums block">{selectedDayDetail.log.checkIn}</span>
                      
                      {selectedDayDetail.log.checkIn !== '-' && (
                        <span className="text-[8px] text-slate-500 font-semibold mt-1 flex items-start gap-1 leading-normal">
                          <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0 mt-0.5" />
                          <span className="truncate max-w-[120px]" title={checkInAddr || 'Resolving...'}>
                            {checkInAddr ? checkInAddr : selectedDayDetail.log.checkInLat ? 'Resolving...' : 'Office'}
                          </span>
                        </span>
                      )}
                    </div>
                    <div
                      onClick={() => selectedDayDetail.log?.faceCapture && setZoomedImage(selectedDayDetail.log.faceCapture)}
                      className={`mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-250 flex items-center justify-center group ${selectedDayDetail.log.faceCapture ? 'cursor-zoom-in' : ''}`}
                    >
                      {selectedDayDetail.log.faceCapture ? (
                        <>
                          <img src={selectedDayDetail.log.faceCapture} className="w-full h-full object-cover transform -scale-x-100 transition-transform duration-300 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <span className="text-[8px] font-bold text-white uppercase tracking-wider">Zoom</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-404">
                          <Camera className="w-5 h-5 mb-1" />
                          <span className="text-[8px] uppercase">No Selfie</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Out Punch Card */}
                  <div className="bg-slate-55 border border-slate-100 p-3 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-404 uppercase tracking-wide">PUNCH OUT</span>
                      <span className="text-xs font-black text-slate-808 mt-1 tabular-nums block">{selectedDayDetail.log.checkOut}</span>
                      
                      {selectedDayDetail.log.checkOut !== '-' && (
                        <span className="text-[8px] text-slate-500 font-semibold mt-1 flex items-start gap-1 leading-normal">
                          <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0 mt-0.5" />
                          <span className="truncate max-w-[120px]" title={checkOutAddr || 'Resolving...'}>
                            {checkOutAddr ? checkOutAddr : selectedDayDetail.log.checkOutLat ? 'Resolving...' : 'Office'}
                          </span>
                        </span>
                      )}
                    </div>
                    {/* Fallback checkout face: faceCaptureOut or faceCapture as fallback */}
                    {(() => {
                      const outFace = selectedDayDetail.log.faceCaptureOut || (selectedDayDetail.log.checkOut !== '-' ? selectedDayDetail.log.faceCapture : undefined);
                      return (
                        <div
                          onClick={() => outFace && setZoomedImage(outFace)}
                          className={`mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-250 flex items-center justify-center group ${outFace ? 'cursor-zoom-in' : ''}`}
                        >
                          {outFace ? (
                            <>
                              <img src={outFace} className="w-full h-full object-cover transform -scale-x-100 transition-transform duration-300 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-white uppercase tracking-wider">Zoom</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-404">
                              <Camera className="w-5 h-5 mb-1" />
                              <span className="text-[8px] uppercase">No Selfie</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Total Working Hours */}
                <div className="bg-slate-55 border border-slate-100 p-3 rounded-2xl flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-505">Total Work Hours</span>
                  <span className="font-black text-slate-808 tabular-nums">{selectedDayDetail.log.hours}</span>
                </div>

                {/* Duty Location — real punch address from GPS */}
                <div className="bg-slate-55 border border-slate-100 p-3 rounded-2xl text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-505">Duty Location</span>
                    {(selectedDayDetail.log.checkInLat || selectedDayDetail.log.checkOutLat) && (
                      <MapPin className="w-3 h-3 text-rose-400" />
                    )}
                  </div>
                  <div className="space-y-1 mt-1 text-[10px] font-semibold text-slate-600">
                    {selectedDayDetail.log.checkIn !== '-' && (
                      <div className="flex items-start gap-1 leading-tight">
                        <span className="text-[8px] font-black text-blue-600 uppercase shrink-0 mt-0.5">IN:</span>
                        <span className="text-slate-700 truncate max-w-[280px]">
                          {checkInAddr ? checkInAddr : selectedDayDetail.log.checkInLat ? 'Resolving address...' : 'Allotted Office Branch'}
                        </span>
                      </div>
                    )}
                    {selectedDayDetail.log.checkOut !== '-' && (
                      <div className="flex items-start gap-1 leading-tight">
                        <span className="text-[8px] font-black text-[#0D47A1] uppercase shrink-0 mt-0.5">OUT:</span>
                        <span className="text-slate-700 truncate max-w-[280px]">
                          {checkOutAddr ? checkOutAddr : selectedDayDetail.log.checkOutLat ? 'Resolving address...' : 'Allotted Office Branch'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDayDetail(null)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-xl text-xs transition cursor-pointer text-center"
                >
                  Okay, Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="py-6 text-center text-slate-505 font-semibold">
                  <AlertCircle className="w-8 h-8 text-rose-505 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs">No active log found for this day.</p>
                  <p className="text-[9px] text-slate-455 mt-1">Status: Absent / Off-day</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedDayDetail(null);
                      setIsModalOpen(true);
                      setRegDate(selectedDayDetail.date);
                    }}
                    className="flex-1 bg-[#0D47A1] hover:bg-blue-808 text-white font-extrabold py-2 rounded-xl transition cursor-pointer text-center text-xs"
                  >
                    Request Correction
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDayDetail(null)}
                    className="flex-1 bg-slate-105 hover:bg-slate-200 text-slate-700 font-extrabold py-2 rounded-xl transition cursor-pointer text-center text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Report Attendance Issue Popup Modal (Opaque background blurred with bg-black/10 backdrop-blur-md covering sidebar and navbar) */}
      {isIssuePopupOpen && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-305"
          style={{ zIndex: 9999 }}
        >
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 p-6 transform transition-all border-t-[4px] border-t-rose-500 animate-scaleUp text-left">

            {/* Close Button */}
            <button
              onClick={() => setIsIssuePopupOpen(false)}
              className="absolute top-4 right-4 text-slate-405 hover:text-slate-655 hover:bg-slate-100 p-1.5 rounded-lg transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-2.5 mb-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-505" />
              <h3 className="text-xs font-black text-slate-805 uppercase tracking-wide">Report Attendance Issue</h3>
            </div>

            <p className="text-[11px] text-slate-550 mb-4 font-semibold">
              Select the problem category below and provide a description so the HR/IT support desk can verify it.
            </p>

            <form onSubmit={handleReportIssue} className="space-y-4 text-xs font-semibold">
              {/* Truein/SalaryBox Category Selector Pills */}
              <div>
                <label className="block text-[9px] font-bold text-slate-404 uppercase tracking-wide mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'GPS Boundary Mismatch',
                    'Webcam access error',
                    'Face match failed',
                    'Other technical issue'
                  ].map((cat) => {
                    const isSelected = issueCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setIssueCategory(cat)}
                        className={`p-2.5 rounded-xl border text-left text-[11px] transition-all cursor-pointer font-bold
                          ${isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-extrabold shadow-2xs'
                            : 'border-slate-200 text-slate-505 hover:bg-slate-55'
                          }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description TextBox */}
              <div>
                <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-wide mb-1">Issue Details</label>
                <textarea
                  value={issueReason}
                  onChange={(e) => setIssueReason(e.target.value)}
                  placeholder="Detail the issue (e.g., coordinates mismatch, system not detecting camera)..."
                  className="w-full bg-slate-55 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-707 focus:outline-none focus:ring-1 focus:ring-blue-550 h-24 resize-none"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0D47A1] hover:bg-blue-808 text-white font-extrabold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Submit Issue
                </button>
                <button
                  type="button"
                  onClick={() => setIsIssuePopupOpen(false)}
                  className="flex-1 bg-slate-105 hover:bg-slate-200 text-slate-750 font-extrabold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Attendance Regularization Application Modal (Opaque background blurred with bg-black/10 backdrop-blur-md covering sidebar and navbar) */}
      {isModalOpen && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          style={{ zIndex: 9999 }}
        >
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 p-6 transform transition-all border-t-[4px] border-t-blue-750 text-left">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-455 hover:text-slate-655 hover:bg-slate-100 p-1.5 rounded-lg transition-all cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="text-xs font-black text-slate-855 uppercase tracking-wide mb-4">Request Regularization</h3>

            <form onSubmit={handleRegSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-wide mb-1">Target Date</label>
                <input
                  type="date"
                  value={regDate}
                  onChange={(e) => setRegDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-707 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-wide mb-1">Requested In-Time</label>
                  <input
                    type="time"
                    value={regIn}
                    onChange={(e) => setRegIn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-707 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-wide mb-1">Requested Out-Time</label>
                  <input
                    type="time"
                    value={regOut}
                    onChange={(e) => setRegOut(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-707 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-455 uppercase tracking-wide mb-1">Reason for Correction</label>
                <textarea
                  value={regReason}
                  onChange={(e) => setRegReason(e.target.value)}
                  placeholder="Describe why check-in/out logs were missed or incorrect..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-707 focus:outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0D47A1] hover:bg-blue-808 text-white font-extrabold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-105 hover:bg-slate-205 text-slate-750 font-extrabold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Lightbox / Zoomed Image Modal */}
      {zoomedImage && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm z-[10000] animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-sm w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-6 right-6 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all cursor-pointer z-10"
            >
              <X size={18} />
            </button>
            <div className="w-full aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-950 flex items-center justify-center">
              <img src={zoomedImage} className="w-full h-full object-cover transform -scale-x-100" />
            </div>
            <div className="text-center mt-3">
              <span className="text-xs font-black text-slate-707 uppercase tracking-wider">Captured Selfie Verification</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Attendance;
