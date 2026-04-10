import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const CROPS = [
  { id: "maize",     label: "Maize",     emoji: "🌽" },
  { id: "tomato",    label: "Tomato",    emoji: "🍅" },
  { id: "pepper",    label: "Pepper",    emoji: "🫑" },
  { id: "potato",    label: "Potato",    emoji: "🥔" },
  { id: "groundnut", label: "Groundnut", emoji: "🥜" },
];

const URGENCY_STYLES = {
  "Immediate action needed": { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
  "Monitor closely":          { bg: "#FEF9C3", color: "#854D0E", dot: "#EAB308" },
  "No action needed":         { bg: "#DCFCE7", color: "#166534", dot: "#22C55E" },
};

const HOVER_STYLE = `
  .farm-btn {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  .farm-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(65,36,2,.12) !important;
    filter: brightness(1.1);
  }
  .farm-btn:active {
    transform: translateY(0);
  }
  .crop-tag:hover {
    border-color: #BA7517 !important;
    background: #FFF8ED !important;
  }
  .crop-tag-active:hover {
    background: #855310 !important;
  }
  @media (max-width: 640px) {
    .mobile-px-4 { padding-left: 16px !important; padding-right: 16px !important; }
    .mobile-pt-8 { padding-top: 32px !important; }
    .mobile-text-3xl { font-size: 24px !important; }
    .mobile-stack { flex-direction: column !important; align-items: stretch !important; }
    .mobile-full { width: 100% !important; margin-left: 0 !important; margin-right: 0 !important; }
    .mobile-grid-1 { grid-template-columns: 1fr !important; }
  }
`;

// ── SVG icon helpers ────────────────────────────────────────────────────────
const IconLeaf = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 22V12M12 12C12 7 7 4 2 5c0 5 3 9 10 7M12 12c0-5 5-8 10-7-1 5-4 9-10 7"
      stroke="#BA7517" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconCamera = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      stroke="#BA7517" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="4" stroke="#BA7517" strokeWidth="1.5"/>
  </svg>
);

const IconMicroscope = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M6 18h12M6 22h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 10l1.5-7h1l1.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 16v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M1 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4.5L1 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconUpload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconCheck = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#16A34A" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 4L12 14.01l-3-3" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconWarning = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconSearch = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="#6B7280" strokeWidth="2"/>
    <path d="M21 21l-4.35-4.35" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconNotes = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconPill = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M10.5 20.5L3.5 13.5a5 5 0 0 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8.5" y1="11.5" x2="15.5" y2="4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function CropHealth() {
  const [selectedCrop, setSelectedCrop] = useState("maize");
  const [imagePreview, setImagePreview]  = useState(null);
  const [imageBase64, setImageBase64]    = useState(null);
  const [result, setResult]              = useState(null);
  const [loading, setLoading]            = useState(false);
  const [error, setError]                = useState(null);
  const [mode, setMode]                  = useState("upload");
  const [dragOver, setDragOver]          = useState(false);

  const location = useLocation();

  useEffect(() => {
    // 1. Check for state passed through navigation (Standard/Reliable)
    if (location.state?.image) {
      setImagePreview(location.state.image);
      setImageBase64(location.state.image);
      if (location.state.crop) setSelectedCrop(location.state.crop);
      
      // AUTO-SHOW RESULT: If result was already calculated on the homepage
      if (location.state.result) {
        setResult(location.state.result);
        // Smooth scroll to results on mobile
        setTimeout(() => {
          document.getElementById('diagnosis-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
      return;
    }

    // 2. Fallback to session storage (Legacy/Backup)
    const pending = sessionStorage.getItem('pending_crop_image');
    if (pending) {
      setImagePreview(pending);
      setImageBase64(pending);
      sessionStorage.removeItem('pending_crop_image');
    }
  }, [location]);

  const fileInputRef   = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef       = useRef(null);
  const canvasRef      = useRef(null);
  const streamRef      = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const readFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImageBase64(e.target.result);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => readFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    readFile(e.dataTransfer.files[0]);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCameraActive(true);
    } catch {
      setError("Camera access denied. Please allow camera permission or use file upload.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current; const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setImagePreview(dataUrl); setImageBase64(dataUrl);
    setResult(null); setError(null); stopCamera();
  };

  const handleModeSwitch = (m) => { setMode(m); if (m !== "camera") stopCamera(); };

  const analyse = async () => {
    if (!imageBase64) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/detect-disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64, crop: selectedCrop }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setImagePreview(null); setImageBase64(null); setResult(null); setError(null); stopCamera(); };

  const handleCorrectCrop = (detected) => {
    const crop = CROPS.find(c => c.label.toLowerCase() === detected.toLowerCase() || c.id === detected.toLowerCase());
    if (crop) {
      setSelectedCrop(crop.id);
      // Re-run analysis or just update the UI state
      setResult(prev => ({ ...prev, is_crop_mismatch: false }));
    }
  };

  const urgencyStyle = result ? URGENCY_STYLES[result.urgency] || URGENCY_STYLES["Monitor closely"] : null;
  const statusIcon = result
    ? result.status === "healthy" ? <IconCheck />
    : result.status === "diseased" ? <IconWarning />
    : <IconSearch />
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#FFFBF5", fontFamily: "'Inter', 'Geist', sans-serif" }}>
      <style>{HOVER_STYLE}</style>
      <div className="mobile-pt-8 mobile-px-4" style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 0" }}>
        {/* Back link */}
        <Link to="/" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "#854F0B", textDecoration: "none", fontSize: 13, marginBottom: 32,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Back to home
        </Link>

        <h1 className="mobile-text-3xl" style={{ fontSize: 32, fontWeight: 600, color: "#412402", margin: "0 0 6px", letterSpacing: "-0.5px" }}>
          Crop Disease Detection
        </h1>
        <p style={{ color: "#854F0B", margin: "0 0 44px", fontSize: 15, lineHeight: 1.5 }}>
          Upload or snap a photo of your crop leaf for an instant AI diagnosis
        </p>

        {/* ── Step 1: Pick Crop ─────────────────────────────────────── */}
        <Section label="01" title="Select your crop">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CROPS.map((c) => (
              <button key={c.id} onClick={() => setSelectedCrop(c.id)} 
                className={`farm-btn ${selectedCrop === c.id ? "crop-tag-active" : "crop-tag"}`}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "10px 20px", borderRadius: 999,
                  border: `1px solid ${selectedCrop === c.id ? "#BA7517" : "#E8D5B0"}`,
                  background: selectedCrop === c.id ? "#BA7517" : "white",
                  color: selectedCrop === c.id ? "#fff" : "#633806",
                  fontWeight: 500, fontSize: 13, cursor: "pointer",
                  boxShadow: selectedCrop === c.id ? "0 2px 8px rgba(186,117,23,.25)" : "none",
                }}>
                <span style={{ fontSize: 16 }}>{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Step 2: Upload or Camera ───────────────────────────────── */}
        <Section label="02" title="Provide a photo">
          {/* Mode toggle */}
          <div style={{
            display: "inline-flex", background: "#F5EDD8",
            borderRadius: 999, padding: 3, marginBottom: 20,
          }}>
            {[
              { id: "upload", icon: <IconUpload />, label: "Upload" },
              { id: "camera", icon: <IconCamera size={14} />, label: "Camera" },
            ].map(({ id, icon, label }) => (
              <button key={id} onClick={() => handleModeSwitch(id)} 
                className="farm-btn"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 24px", borderRadius: 999, border: "none",
                  background: mode === id ? "#412402" : "transparent",
                  color: mode === id ? "#FFFBF5" : "#854F0B",
                  fontWeight: 500, fontSize: 13, cursor: "pointer",
                }}>
                <span style={{ display: "flex" }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Upload area */}
          {mode === "upload" && !imagePreview && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `1.5px dashed ${dragOver ? "#BA7517" : "#D4B896"}`,
                borderRadius: 16, padding: "44px 24px",
                background: dragOver ? "#FFF8ED" : "rgba(250,238,218,0.2)",
                textAlign: "center",
                transition: "all .15s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                <IconLeaf size={44} />
              </div>
              <p style={{ color: "#412402", fontWeight: 600, margin: "0 0 4px", fontSize: 15 }}>
                Drop your photo here
              </p>
              <p style={{ color: "#854F0B", fontSize: 13, margin: "0 0 20px" }}>
                or click to browse — JPG, PNG, WEBP supported
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="farm-btn"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#412402", color: "#FAEEDA",
                  border: "none", borderRadius: 999,
                  padding: "14px 32px", fontSize: 14, fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                <IconUpload />
                Upload Photo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </div>
          )}

          {/* Camera area */}
          {mode === "camera" && !imagePreview && (
            <div style={{ textAlign: "center" }}>
              {cameraActive ? (
                <div>
                  <video ref={videoRef} autoPlay playsInline style={{
                    width: "100%", maxWidth: 480, borderRadius: 16,
                    border: "1px solid #E8D5B0", background: "#000",
                  }} />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <div className="mobile-stack" style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
                    <ActionBtn onClick={capturePhoto} primary>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
                        <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Capture
                    </ActionBtn>
                    <ActionBtn onClick={stopCamera}>Cancel</ActionBtn>
                  </div>
                </div>
              ) : (
                <div style={{
                  border: "1.5px dashed #D4B896", borderRadius: 16, padding: "44px 24px",
                  background: "rgba(250,238,218,0.2)",
                }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                    <IconCamera size={44} />
                  </div>
                  <p style={{ color: "#412402", fontWeight: 600, margin: "0 0 16px", fontSize: 15 }}>
                    Use your device camera
                  </p>
                  <ActionBtn onClick={startCamera} primary>Open Camera</ActionBtn>
                  <p style={{ color: "#854F0B", fontSize: 12, marginTop: 14 }}>
                    or{" "}
                    <span
                      onClick={() => cameraInputRef.current?.click()}
                      style={{ color: "#BA7517", cursor: "pointer", textDecoration: "underline" }}
                    >
                      take a photo directly
                    </span>
                  </p>
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: "none" }} />
                </div>
              )}
            </div>
          )}

          {/* Preview */}
          {imagePreview && (
            <div style={{ textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <img src={imagePreview} alt="Crop preview" style={{
                  maxWidth: "100%", maxHeight: 360, borderRadius: 16,
                  border: "1px solid #E8D5B0", objectFit: "cover",
                  boxShadow: "0 4px 24px rgba(65,36,2,.10)",
                }} />
                <button onClick={reset} style={{
                  position: "absolute", top: 10, right: 10,
                  background: "rgba(65,36,2,0.75)", color: "#fff", border: "none",
                  borderRadius: 999, width: 30, height: 30,
                  cursor: "pointer", fontSize: 13, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <p style={{ color: "#854F0B", fontSize: 12, marginTop: 8 }}>
                Click × to change photo
              </p>
            </div>
          )}
        </Section>

        {/* ── Analyse Button ─────────────────────────────────────────── */}
        {imagePreview && !result && (
          <div style={{ textAlign: "center", margin: "8px 0 40px" }}>
            <button
              onClick={analyse}
              disabled={loading}
              style={{
                background: loading ? "#633806" : "#412402",
                color: "#FFFBF5", border: "none", borderRadius: 999,
                padding: "16px 56px", fontSize: 15, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 20px rgba(65,36,2,.20)",
                display: "inline-flex", alignItems: "center", gap: 10,
              }}
              className="farm-btn"
            >
              {loading ? (
                <>
                  <Spinner />
                  Analysing your crop…
                </>
              ) : (
                <>
                  <IconMicroscope />
                  Analyse Crop
                </>
              )}
            </button>
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────────────── */}
        {error && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA",
            borderRadius: 12, padding: "14px 18px", marginBottom: 32,
            color: "#991B1B", fontSize: 13,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* ── Results ───────────────────────────────────────────────── */}
        {result && (
          <div id="diagnosis-results" style={{ marginBottom: 64 }}>
            <Section label="03" title="Diagnosis Results">

              {/* Mismatch Warning */}
              {result.is_crop_mismatch && (
                <div style={{
                  background: "#FFF7ED", border: "1px solid #FFEDD5", borderRadius: 16,
                  padding: "16px 20px", marginBottom: 20, display: "flex", flexDirection: "column", gap: 12
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#EA580C" strokeWidth="2"/>
                      <path d="M12 8v4M12 16h.01" stroke="#EA580C" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span style={{ color: "#9A3412", fontWeight: 600, fontSize: 14 }}>
                      Crop Mismatch Detected
                    </span>
                  </div>
                  <p style={{ color: "#C2410C", fontSize: 13, margin: 0 }}>
                    This looks more like <strong>{result.detected_crop}</strong> than {selectedCrop}. 
                    Treatment results might be inaccurate if the crop type is wrong.
                  </p>
                  <button 
                    onClick={() => handleCorrectCrop(result.detected_crop)}
                    className="farm-btn"
                    style={{
                      alignSelf: "flex-start", background: "#EA580C", color: "white",
                      border: "none", borderRadius: 8, padding: "8px 16px",
                      fontSize: 13, fontWeight: 600, cursor: "pointer"
                    }}
                  >
                    Correct to {result.detected_crop}
                  </button>
                </div>
              )}

              {/* Status banner */}
              <div style={{
                borderRadius: 16, padding: "20px 22px", marginBottom: 20,
                background: result.status === "healthy"  ? "#F0FDF4" :
                            result.status === "diseased" ? "#FFFBEB" : "#F9FAFB",
                border: "1px solid",
                borderColor: result.status === "healthy"  ? "#86EFAC" :
                             result.status === "diseased" ? "#FCD34D" : "#E5E7EB",
                display: "flex", alignItems: "center", gap: 16,
              }}>
                {statusIcon}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "#412402", marginBottom: 4 }}>
                    {result.disease_name}
                  </div>
                  <div style={{ color: "#854F0B", fontSize: 13 }}>
                    Confidence: <strong>{result.confidence}</strong>
                    {" · "}
                    {CROPS.find(c => c.id === selectedCrop)?.label}
                  </div>
                </div>
              </div>

              {/* Description */}
              <ResultCard icon={<IconNotes />} title="What we found">
                <p style={{ color: "#412402", lineHeight: 1.7, margin: 0, fontSize: 14 }}>{result.description}</p>
              </ResultCard>

              {/* Urgency */}
              {urgencyStyle && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: urgencyStyle.bg, borderRadius: 999,
                  padding: "7px 16px", margin: "0 0 16px",
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: urgencyStyle.dot, display: "inline-block",
                  }} />
                  <span style={{ color: urgencyStyle.color, fontWeight: 600, fontSize: 13 }}>
                    {result.urgency}
                  </span>
                </div>
              )}

              {/* Treatment */}
              {result.treatment?.length > 0 && (
                <ResultCard icon={<IconPill />} title="Treatment Steps">
                  <ol style={{ margin: 0, padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {result.treatment.map((step, i) => (
                      <li key={i} style={{ color: "#412402", lineHeight: 1.6, fontSize: 14 }}>
                        {step.replace(/^Step \d+:\s*/i, "")}
                      </li>
                    ))}
                  </ol>
                </ResultCard>
              )}

              {/* Prevention */}
              {result.prevention && (
                <ResultCard icon={<IconShield />} title="Prevention Tip">
                  <p style={{ color: "#412402", lineHeight: 1.7, margin: 0, fontSize: 14 }}>{result.prevention}</p>
                </ResultCard>
              )}

              {/* Analyse another */}
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <button onClick={reset}
                  className="farm-btn"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "white", color: "#412402",
                    border: "1px solid #E8D5B0", borderRadius: 999,
                    padding: "12px 32px", fontSize: 14, fontWeight: 500,
                    cursor: "pointer",
                  }}>
                  <IconRefresh />
                  Analyse Another Photo
                </button>
              </div>
            </Section>
          </div>
        )}

        {!result && <div style={{ height: 64 }} />}
      </div>
    </div>
  );
}

// ── Small reusable pieces ──────────────────────────────────────────────────

function Section({ label, title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: "#FAC775" }}>{label}</span>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#412402", margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ResultCard({ icon, title, children }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #F0E6D0",
      borderRadius: 14, padding: "16px 18px", marginBottom: 12,
      boxShadow: "0 1px 8px rgba(65,36,2,.04)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        fontWeight: 600, color: "#BA7517", marginBottom: 10, fontSize: 13,
      }}>
        <span style={{ opacity: 0.85 }}>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

function ActionBtn({ children, onClick, primary }) {
  return (
    <button onClick={onClick} 
      className="farm-btn"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: primary ? "#412402" : "white",
        color:      primary ? "#FFFBF5" : "#412402",
        border: primary ? "none" : "1px solid #E8D5B0",
        borderRadius: 999, padding: "12px 32px",
        fontSize: 14, fontWeight: 500, cursor: "pointer",
      }}>
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span style={{
      width: 16, height: 16, border: "2px solid rgba(250,238,218,0.3)",
      borderTop: "2px solid #FAEEDA", borderRadius: "50%",
      display: "inline-block",
      animation: "spin 0.8s linear infinite",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}