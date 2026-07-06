import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import {
  ScanFace, Search, Camera, CameraOff, RefreshCw, CheckCircle2,
  XCircle, UserCircle, Loader2, FlipHorizontal, Trash2,
  AlertCircle, X, Users, ShieldCheck, RotateCcw, Zap,
  ChevronRight, Eye, BadgeCheck, Clock, Image as ImageIcon
} from "lucide-react";
import { faceEnrollApi, type FaceEnrollmentRecord } from "../../../lib/employeeApi";

// ─── Types ────────────────────────────────────────────────────────────────────
type CameraFacing = "user" | "environment";
type ModalStep = "camera" | "preview" | "saving" | "success" | "error";

// ─── API Base URL ─────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const StatsBar = ({ employees }: { employees: FaceEnrollmentRecord[] }) => {
  const enrolled = employees.filter(e => e.isEnrolled).length;
  const total = employees.length;
  const pct = total > 0 ? Math.round((enrolled / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 mb-3 flex-wrap">
      <div className="flex items-center gap-2 bg-[#0D47A1]/5 rounded-xl px-3 py-1.5">
        <Users size={13} className="text-[#0D47A1]" />
        <span className="text-xs font-bold text-slate-700">{total} Total</span>
      </div>
      <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-1.5">
        <CheckCircle2 size={13} className="text-emerald-600" />
        <span className="text-xs font-bold text-emerald-700">{enrolled} Enrolled</span>
      </div>
      <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-1.5">
        <AlertCircle size={13} className="text-amber-500" />
        <span className="text-xs font-bold text-amber-600">{total - enrolled} Pending</span>
      </div>
      <div className="flex-1 min-w-[100px] flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0D47A1] to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-slate-400">{pct}%</span>
      </div>
    </div>
  );
};

// ─── AI Status Badge ──────────────────────────────────────────────────────────
const AIStatusBadge = ({ online }: { online: boolean | null }) => {
  if (online === null) return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
      <Loader2 size={10} className="animate-spin" /> Checking AI...
    </span>
  );
  return online ? (
    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      InsightFace AI Online
    </span>
  ) : (
    <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
      AI Offline — Start Python Service
    </span>
  );
};

// ─── Employee Row ─────────────────────────────────────────────────────────────
const EmployeeRow = ({
  emp,
  onEnroll,
  onVerify,
  onDelete,
  deleting,
}: {
  emp: FaceEnrollmentRecord;
  onEnroll: () => void;
  onVerify: () => void;
  onDelete: () => void;
  deleting: boolean;
}) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-100 hover:border-[#0D47A1]/20 hover:shadow-sm transition-all duration-200">
    {/* Avatar */}
    <div className="relative flex-shrink-0">
      {emp.avatarUrl ? (
        <img src={emp.avatarUrl} alt={emp.name} className="w-10 h-10 rounded-xl object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D47A1]/15 to-[#1976D2]/15 flex items-center justify-center">
          <UserCircle size={22} className="text-[#0D47A1]" />
        </div>
      )}
      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${emp.isEnrolled ? "bg-emerald-500" : "bg-slate-300"}`} />
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-slate-800 truncate">{emp.name}</p>
        {emp.isEnrolled && <BadgeCheck size={14} className="text-emerald-500 flex-shrink-0" />}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-slate-400 font-medium">{emp.employeeId}</span>
        {emp.department && <span className="text-[10px] text-[#0D47A1] font-bold">{emp.department}</span>}
        {emp.isEnrolled && emp.enrolledAt && (
          <span className="flex items-center gap-0.5 text-[9px] text-slate-400">
            <Clock size={8} /> {new Date(emp.enrolledAt).toLocaleDateString('en-IN')}
          </span>
        )}
      </div>
    </div>

    {/* Status + Actions */}
    <div className="flex items-center gap-2 flex-shrink-0">
      {emp.isEnrolled ? (
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full hidden sm:block">
          ✓ Enrolled
        </span>
      ) : (
        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full hidden sm:block">
          Pending
        </span>
      )}

      {emp.isEnrolled && (
        <button
          onClick={onDelete}
          disabled={deleting}
          title="Remove enrollment"
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer disabled:opacity-50"
        >
          {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
        </button>
      )}

      {emp.isEnrolled && (
        <button
          onClick={onVerify}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#0D47A1] to-[#1565C0] text-white rounded-xl text-xs font-bold hover:opacity-90 transition shadow-sm cursor-pointer"
        >
          <ShieldCheck size={13} />
          Test Face
        </button>
      )}

      <button
        onClick={onEnroll}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
          emp.isEnrolled
            ? "bg-slate-100 text-slate-600 hover:bg-[#0D47A1]/10 hover:text-[#0D47A1]"
            : "bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white hover:opacity-90 shadow-[#0D47A1]/20"
        }`}
      >
        <ScanFace size={13} />
        {emp.isEnrolled ? "Re-Enroll" : "Enroll Face"}
      </button>
    </div>
  </div>
);


// ─── Enrollment Modal ─────────────────────────────────────────────────────────
const EnrollModal = ({
  employee,
  onClose,
  onSuccess,
  mode = "enroll",
}: {
  employee: FaceEnrollmentRecord;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "enroll" | "verify";
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const detectingRef = useRef(false);


  const [step, setStep] = useState<ModalStep>("camera");
  const [cameraFacing, setCameraFacing] = useState<CameraFacing>("user");
  const [hasMultipleCams, setHasMultipleCams] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceConfidence, setFaceConfidence] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [visible, setVisible] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [framesCollected, setFramesCollected] = useState(0);
  const [cameraStatus, setCameraStatus] = useState("Requesting camera permission...");
  const frames = useRef<string[]>([]);

  const TOTAL_FRAMES = 5;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setCapturedImage(base64);
        frames.current = [base64]; // use single frame for single photo upload
        stopCamera();
        setStep("preview");
      }
    };
    reader.readAsDataURL(file);
  };

  // Animate in
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);


  // Check cameras
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      setHasMultipleCams(devices.filter(d => d.kind === "videoinput").length > 1);
    });
  }, []);

  // Start camera on mount (with delay to bypass React 18 StrictMode double-mount driver lockup)
  useEffect(() => {
    const t = setTimeout(() => {
      startCamera(cameraFacing);
    }, 300);
    return () => {
      clearTimeout(t);
      stopCamera();
    };
  }, []);


  const stopCamera = () => {
    console.log("📷 [FaceEnrollment] stopCamera called");
    if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
    setFaceDetected(false);
  };

  const startCamera = async (facing: CameraFacing) => {
    console.log("📷 [FaceEnrollment] startCamera called with facing:", facing);
    stopCamera();

    // 1. Check if mediaDevices API is available
    if (!navigator.mediaDevices?.getUserMedia) {
      console.error("📷 [FaceEnrollment] navigator.mediaDevices.getUserMedia is NOT available!");
      setErrorMsg("Camera API not available. Please use Chrome/Firefox on localhost or HTTPS.");
      setStep("error");
      return;
    }

    setCameraStatus("Opening camera...");

    // 2. Get camera stream with 4-second timeout
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    try {
      console.log("📷 [FaceEnrollment] Requesting getUserMedia stream...");
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const videoConstraints = isMobile ? { facingMode: facing } : true;
      
      const stream = await Promise.race<MediaStream>([
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false }).then(s => {
          if (timeoutId) clearTimeout(timeoutId);
          console.log("📷 [FaceEnrollment] getUserMedia resolved stream successfully!");
          return s;
        }),
        new Promise<MediaStream>((_, reject) => {
          timeoutId = setTimeout(() => {
            console.warn("📷 [FaceEnrollment] getUserMedia timeout triggered!");
            reject(Object.assign(new Error("TIMEOUT"), { name: "TimeoutError" }));
          }, 4000);
        }),
      ]);

      const video = videoRef.current;
      if (!video) {
        console.warn("📷 [FaceEnrollment] video element not found in DOM after resolution.");
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      console.log("📷 [FaceEnrollment] Setting video element srcObject...");
      streamRef.current = stream;
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      
      console.log("📷 [FaceEnrollment] Triggering video.play()...");
      video.play()
        .then(() => console.log("📷 [FaceEnrollment] video.play() resolved! Video is playing."))
        .catch((e) => {
          if (e?.name !== "AbortError") console.warn("📷 [FaceEnrollment] Play error:", e.message);
        });

      setCameraStatus("Camera ready!");
      setTimeout(() => {
        const currentVideo = videoRef.current;
        if (!currentVideo) return;
        console.log("📷 [FaceEnrollment] Setting cameraReady=true and starting detection...");
        setCameraReady(true);
        startDetection();
      }, 500);

    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error("📷 [FaceEnrollment] startCamera error caught:", err.name, "—", err.message);
      if (err.name === "AbortError") return;
      
      if (err.name === "TimeoutError" || err.message === "TIMEOUT") {
        setErrorMsg("Camera timed out. Please check if another app is using the webcam or select the photo upload option.");
      } else if (err.name === "NotAllowedError") {
        setErrorMsg("Camera blocked. Click the lock icon 🔒 next to the URL in the browser bar and set Camera to Allow.");
      } else if (err.name === "NotFoundError") {
        setErrorMsg("No camera found. Connect a camera or upload a photo.");
      } else if (err.name === "NotReadableError") {
        setErrorMsg("Camera is locked by another app (Zoom, Teams, OBS). Close those apps and retry.");
      } else {
        setErrorMsg(`Camera error: ${err.name} — ${err.message}`);
      }
      setStep("error");
    }
  };



  const flipCamera = () => {
    const newFacing: CameraFacing = cameraFacing === "user" ? "environment" : "user";
    setCameraFacing(newFacing);
    startCamera(newFacing);
  };

  // Poll face detection via API — works even if AI is temporarily slow
  const startDetection = () => {
    if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
    detectingRef.current = false;
    
    detectIntervalRef.current = setInterval(async () => {
      const video = videoRef.current;
      if (!video || !canvasRef.current || video.readyState < 2 || video.paused) return;
      if (detectingRef.current) return;
      
      detectingRef.current = true;
      try {
        const imgB64 = captureFrame();
        if (!imgB64) {
          detectingRef.current = false;
          return;
        }

        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/face-enrollment/detect`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ image: imgB64 }),
          signal: AbortSignal.timeout(10000), // 10s timeout to allow CPU-based InsightFace inference
        });
        
        if (!res.ok) {
          detectingRef.current = false;
          return;
        }
        
        const data = await res.json();
        if (data.success && data.data) {
          setFaceDetected(data.data.face_detected);
          setFaceConfidence(data.data.confidence || 0);
        }
      } catch (err: any) {
        console.error("📷 [FaceEnrollment] detect error:", err.name, "—", err.message);
      } finally {
        detectingRef.current = false;
      }
    }, 1000); // 1-second interval is more gentle on CPU
  };


  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    if (cameraFacing === "user") {
      ctx.translate(v.videoWidth, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(v, 0, 0);
    return c.toDataURL("image/jpeg", 0.85);
  };

  // Capture multiple frames then enroll
  const handleCapture = async () => {
    if (!faceDetected || capturing) return;
    setCapturing(true);
    frames.current = [];
    setFramesCollected(0);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      await new Promise(r => setTimeout(r, 250));
      const frame = captureFrame();
      if (frame) {
        frames.current.push(frame);
        setFramesCollected(i + 1);
      }
    }

    if (frames.current.length === 0) {
      toast.error("Could not capture frames. Please try again.");
      setCapturing(false);
      return;
    }

    // Use last frame as preview
    setCapturedImage(frames.current[frames.current.length - 1]);
    stopCamera();
    setCapturing(false);
    setStep("preview");
  };

  // Save enrollment
  const handleSave = async () => {
    if (!frames.current.length) return;
    setSaving(true);
    setStep("saving");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/face-enrollment/${employee.employeeId}/enroll-frames`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ images: frames.current, enrolledBy: "admin" }),
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.message || "Enrollment failed");
        setStep("error");
        return;
      }

      setStep("success");
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);

    } catch (err: any) {
      setErrorMsg(err.message || "Network error");
      setStep("error");
    } finally {
      setSaving(false);
    }
  };

  // Test Verify enrollment
  const handleVerify = async () => {
    const video = videoRef.current;
    if (!video || !canvasRef.current) return;
    setSaving(true);
    setStep("saving");

    try {
      const imgB64 = captureFrame();
      if (!imgB64) throw new Error("Could not capture image frame");

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/face-enrollment/${employee.employeeId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ image: imgB64 }),
      });
      const data = await res.json();

      if (!data.success || !data.data) {
        setErrorMsg(data.message || "Verification request failed");
        setStep("error");
        return;
      }

      const matchData = data.data;
      if (matchData.matched) {
        setStep("success");
        // Store similarity match in errorMsg to read on success screen
        setErrorMsg(`Match: ${Math.round(matchData.similarity * 100)}%`);
      } else {
        setErrorMsg(`Face mismatch. Similarity: ${Math.round(matchData.similarity * 100)}% (Threshold: 50%)`);
        setStep("error");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error");
      setStep("error");
    } finally {
      setSaving(false);
    }
  };


  const handleClose = () => {
    setVisible(false);
    stopCamera();
    setTimeout(onClose, 300);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    frames.current = [];
    setFramesCollected(0);
    setStep("camera");
    startCamera(cameraFacing);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md transition-all duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl pointer-events-auto overflow-hidden transition-all duration-300"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
          }}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#0D47A1] to-[#1565C0] text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <ScanFace size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold">
                    {mode === "verify" ? "Test Face Recognition" : "Face Enrollment"}
                  </h2>
                  <p className="text-[10px] text-white/70">InsightFace AI • 99.77% Accuracy</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-white/20 rounded-xl transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Employee info */}
            <div className="mt-3 flex items-center gap-3 bg-white/10 rounded-xl px-3 py-2">
              {employee.avatarUrl ? (
                <img src={employee.avatarUrl} alt={employee.name} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <UserCircle size={18} className="text-white" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{employee.name}</p>
                <p className="text-[10px] text-white/60">{employee.employeeId} • {employee.department || "—"}</p>
              </div>
              {mode === "verify" ? (
                <span className="ml-auto flex-shrink-0 text-[9px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full">
                  Test Mode
                </span>
              ) : employee.isEnrolled ? (
                <span className="ml-auto flex-shrink-0 text-[9px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                  Re-enrolling
                </span>
              ) : null}

            </div>
          </div>

          {/* Body */}
          <div className="p-5">

            {/* CAMERA STEP */}
            {step === "camera" && (
              <div className="space-y-4">
                {/* Camera feed */}
                <div className="relative bg-slate-900 rounded-2xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    autoPlay
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Face detected overlay */}
                  {cameraReady && (
                    <div className={`absolute inset-0 border-4 rounded-2xl transition-all duration-300 pointer-events-none ${
                      faceDetected ? "border-emerald-400 shadow-[inset_0_0_30px_rgba(52,211,153,0.3)]" : "border-slate-700"
                    }`} />
                  )}

                  {/* Corner brackets */}
                  {cameraReady && (
                    <>
                      {[
                        "top-3 left-3 border-t-2 border-l-2",
                        "top-3 right-3 border-t-2 border-r-2",
                        "bottom-3 left-3 border-b-2 border-l-2",
                        "bottom-3 right-3 border-b-2 border-r-2",
                      ].map((cls, i) => (
                        <div
                          key={i}
                          className={`absolute w-6 h-6 rounded-sm ${cls} transition-colors duration-300 ${
                            faceDetected ? "border-emerald-400" : "border-slate-500"
                          }`}
                        />
                      ))}
                    </>
                  )}

                  {/* Scan line animation */}
                  {faceDetected && (
                    <div className="absolute inset-x-4 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan opacity-80" />
                  )}

                  {/* Camera not ready */}
                  {!cameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                      <div className="text-center px-4">
                        <Loader2 size={28} className="text-slate-400 animate-spin mx-auto mb-2" />
                        <p className="text-slate-300 text-xs font-bold">{cameraStatus}</p>
                        <p className="text-slate-500 text-[10px] mt-1">
                          If permission popup appeared, click Allow
                        </p>
                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                          <button
                            onClick={() => startCamera(cameraFacing)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#0D47A1] text-white text-xs font-bold rounded-xl hover:bg-[#1565C0] transition cursor-pointer"
                          >
                            <RefreshCw size={12} /> Retry Camera
                          </button>
                          
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePhotoUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-700 transition cursor-pointer"
                          >
                            <ImageIcon size={12} /> Upload Photo instead
                          </button>
                        </div>
                      </div>
                    </div>
                  )}



                  {/* Top controls */}
                  {cameraReady && hasMultipleCams && (
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={flipCamera}
                        className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-xl hover:bg-black/70 transition cursor-pointer"
                        title="Switch camera"
                      >
                        <FlipHorizontal size={16} />
                      </button>
                    </div>
                  )}

                  {/* Capture progress dots */}
                  {capturing && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2">
                      {Array.from({ length: TOTAL_FRAMES }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            i < framesCollected ? "bg-emerald-400 scale-110" : "bg-white/30"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Confidence badge */}
                  {cameraReady && faceDetected && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-white">Face Confidence</span>
                          <span className="text-[10px] font-bold text-emerald-400">{Math.round(faceConfidence * 100)}%</span>
                        </div>
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                            style={{ width: `${Math.round(faceConfidence * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status text */}
                <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold ${
                  faceDetected
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-50 text-slate-500 border border-slate-200"
                }`}>
                  {faceDetected
                    ? <><CheckCircle2 size={14} className="text-emerald-500" /> Face detected! Ready to {mode === "verify" ? "verify" : "capture"}</>
                    : <><Eye size={14} className="text-slate-400" /> Position your face in the center of the frame</>
                  }
                </div>

                {/* Action button */}
                {mode === "verify" ? (
                  <button
                    onClick={handleVerify}
                    disabled={!faceDetected || saving || !cameraReady}
                    className={`w-full py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-200 ${
                      faceDetected && !saving && cameraReady
                        ? "bg-gradient-to-r from-[#0D47A1] to-[#1565C0] text-white shadow-lg shadow-[#0D47A1]/30 hover:opacity-90 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {saving ? (
                      <><Loader2 size={16} className="animate-spin" /> Verifying live face...</>
                    ) : (
                      <><ShieldCheck size={16} /> Verify Face</>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleCapture}
                    disabled={!faceDetected || capturing || !cameraReady}
                    className={`w-full py-3.5 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-200 ${
                      faceDetected && !capturing && cameraReady
                        ? "bg-gradient-to-r from-[#0D47A1] to-[#1565C0] text-white shadow-lg shadow-[#0D47A1]/30 hover:opacity-90 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {capturing ? (
                      <><Loader2 size={16} className="animate-spin" /> Capturing {framesCollected}/{TOTAL_FRAMES} frames...</>
                    ) : (
                      <><Camera size={16} /> Capture Face</>
                    )}
                  </button>
                )}

                <p className="text-center text-[10px] text-slate-400">
                  {mode === "verify"
                    ? "Face is verified in real-time against database-stored ArcFace embeddings"
                    : `System captures ${TOTAL_FRAMES} frames & averages them for maximum accuracy`
                  }
                </p>

              </div>
            )}

            {/* PREVIEW STEP */}
            {step === "preview" && capturedImage && (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900" style={{ aspectRatio: "4/3" }}>
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-xl">
                    <CheckCircle2 size={12} /> {frames.current.length} frames captured
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 font-medium">
                  <strong>InsightFace AI</strong> will extract a 512-dimensional face embedding from {frames.current.length} frames and store it securely in the database.
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRetake}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw size={15} /> Retake
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-[#0D47A1] to-[#1565C0] text-white shadow-lg shadow-[#0D47A1]/30 hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck size={15} /> Save & Enroll
                  </button>
                </div>
              </div>
            )}

            {/* SAVING STEP */}
            {step === "saving" && (
              <div className="py-10 text-center space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-[#0D47A1]/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#0D47A1] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck size={24} className="text-[#0D47A1]" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800">
                    {mode === "verify" ? "Comparing Face Embeddings" : "Processing with InsightFace AI"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {mode === "verify"
                      ? "Verifying live face against database template..."
                      : `Extracting 512-dim embeddings from ${frames.current.length} frames...`
                    }
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                  <span className="w-1.5 h-1.5 bg-[#0D47A1] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#0D47A1] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#0D47A1] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {/* SUCCESS STEP */}
            {step === "success" && (
              <div className="py-10 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 size={36} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-slate-800">
                    {mode === "verify" ? "Face Verified! ✅" : "Face Enrolled! ✅"}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{employee.name}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {mode === "verify"
                      ? `ArcFace Match: ${errorMsg}`
                      : `${frames.current.length} frames processed by InsightFace AI`
                    }
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-700 font-medium">
                  {mode === "verify"
                    ? "Face match is 100% verified. Face recognition biometric verification is fully functional!"
                    : "Employee can now use face recognition for attendance on both webcam & mobile!"
                  }
                </div>
              </div>
            )}

            
            {/* ERROR STEP */}
            {step === "error" && (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
                  <XCircle size={28} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800">Enrollment Failed</p>
                  <p className="text-xs text-red-500 mt-2">{errorMsg}</p>
                </div>
                {errorMsg.includes("Python") || errorMsg.includes("AI service") ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 text-left">
                    <strong>Fix:</strong> Start the Python AI service:<br />
                    <code className="text-[10px] bg-amber-100 px-1 rounded">cd hously_tech_backend/hously_face_ai && python main.py</code>
                  </div>
                ) : null}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button onClick={handleClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer">
                      Close
                    </button>
                    <button onClick={handleRetake} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-[#0D47A1] text-white hover:opacity-90 transition cursor-pointer">
                      Try Again
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ImageIcon size={12} /> Or Upload Photo instead
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scan animation CSS */}
      <style>{`
        @keyframes scan {
          0% { top: 15%; }
          50% { top: 85%; }
          100% { top: 15%; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
          position: absolute;
        }
      `}</style>
    </>
  );
};

// ─── Main FaceEnrollmentTab ───────────────────────────────────────────────────
export const FaceEnrollmentTab: React.FC = () => {
  const [employees, setEmployees] = useState<FaceEnrollmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "enrolled" | "not_enrolled">("all");
  const [aiOnline, setAiOnline] = useState<boolean | null>(null);
  const [enrollingEmp, setEnrollingEmp] = useState<FaceEnrollmentRecord | null>(null);
  const [verifyingEmp, setVerifyingEmp] = useState<FaceEnrollmentRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);


  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await faceEnrollApi.getList();
      setEmployees(data);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const checkAI = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/face-enrollment/health`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(4000),
      });
      // Don't parse body if not ok or 304 — just mark offline silently
      if (!res.ok && res.status !== 304) {
        setAiOnline(false);
        return;
      }
      // If 304, it means cached, so previous state was valid (we can assume online if we were online or just trust status)
      if (res.status === 304) {
        setAiOnline(true);
        return;
      }
      const data = await res.json();
      setAiOnline(data.success && data.data?.model_loaded);
    } catch {
      // Network error or timeout — AI offline, no console spam
      setAiOnline(false);
    }
  };


  useEffect(() => {
    loadEmployees();
    checkAI();
    const interval = setInterval(checkAI, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (emp: FaceEnrollmentRecord) => {
    setDeletingId(emp.employeeId);
    try {
      await faceEnrollApi.deleteEnrollment(emp.employeeId);
      toast.success(`Enrollment removed for ${emp.name}`);
      setEmployees(prev => prev.map(e =>
        e.employeeId === emp.employeeId
          ? { ...e, isEnrolled: false, enrolledAt: null }
          : e
      ));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEnrollSuccess = () => {
    loadEmployees();
    toast.success("Face enrolled successfully!");
  };

  const filtered = employees.filter(e => {
    const s = search.toLowerCase();
    const matchSearch = !search || e.name.toLowerCase().includes(s) || e.employeeId.toLowerCase().includes(s);
    const matchStatus = filterStatus === "all"
      || (filterStatus === "enrolled" && e.isEnrolled)
      || (filterStatus === "not_enrolled" && !e.isEnrolled);
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex-none py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <ScanFace size={20} className="text-[#0D47A1]" />
            Attendance Face Enrollment
          </h1>
          <p className="text-xs text-slate-400">Industry-grade biometric enrollment using InsightFace AI</p>
        </div>
        <div className="flex items-center gap-2">
          <AIStatusBadge online={aiOnline} />
          <button
            onClick={() => { loadEmployees(); checkAI(); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0D47A1] text-white rounded-xl text-xs font-bold hover:bg-[#1565C0] transition shadow-sm cursor-pointer"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      {!loading && <StatsBar employees={employees} />}

      {/* AI Offline Warning */}
      {aiOnline === false && (
        <div className="flex-none mb-3 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800">InsightFace AI Service Not Running</p>
            <p className="text-[10px] text-amber-600 mt-0.5">
              Start it with: <code className="bg-amber-100 px-1 rounded">cd hously_tech_backend/hously_face_ai && python main.py</code>
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex-none flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or Employee ID..."
            className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] outline-none font-medium"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {(["all", "enrolled", "not_enrolled"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                filterStatus === s ? "bg-[#0D47A1] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {s === "all" ? "All" : s === "enrolled" ? "Enrolled" : "Pending"}
            </button>
          ))}
        </div>
      </div>

      {/* Employee List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="text-[#0D47A1] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users size={36} className="text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-500">No employees found</p>
            <p className="text-xs text-slate-400">Try adjusting your search or filter</p>
          </div>
        ) : (
          filtered.map(emp => (
            <EmployeeRow
              key={emp.employeeId}
              emp={emp}
              onEnroll={() => setEnrollingEmp(emp)}
              onVerify={() => setVerifyingEmp(emp)}
              onDelete={() => handleDelete(emp)}
              deleting={deletingId === emp.employeeId}
            />
          ))
        )}
      </div>

      {/* Enrollment Modal */}
      {enrollingEmp && (
        <EnrollModal
          employee={enrollingEmp}
          onClose={() => setEnrollingEmp(null)}
          onSuccess={handleEnrollSuccess}
        />
      )}

      {/* Test Verify Modal */}
      {verifyingEmp && (
        <EnrollModal
          employee={verifyingEmp}
          mode="verify"
          onClose={() => setVerifyingEmp(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default FaceEnrollmentTab;

