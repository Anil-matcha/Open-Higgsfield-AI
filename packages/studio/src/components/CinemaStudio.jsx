"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants (inlined from promptUtils) ───────────────────────────────────

const CAMERA_MAP = {
  "Modular 8K Digital": "modular 8K digital cinema camera",
  "Full-Frame Cine Digital": "full-frame digital cinema camera",
  "Grand Format 70mm Film": "grand format 70mm film camera",
  "Studio Digital S35": "Super 35 studio digital camera",
  "Classic 16mm Film": "classic 16mm film camera",
  "Premium Large Format Digital": "premium large-format digital cinema camera",
};

const LENS_MAP = {
  "Creative Tilt Lens": "creative tilt lens effect",
  "Compact Anamorphic": "compact anamorphic lens",
  "Extreme Macro": "extreme macro lens",
  "70s Cinema Prime": "1970s cinema prime lens",
  "Classic Anamorphic": "classic anamorphic lens",
  "Premium Modern Prime": "premium modern prime lens",
  "Warm Cinema Prime": "warm-toned cinema prime lens",
  "Swirl Bokeh Portrait": "swirl bokeh portrait lens",
  "Vintage Prime": "vintage prime lens",
  "Halation Diffusion": "halation diffusion filter",
  "Clinical Sharp Prime": "ultra-sharp clinical prime lens",
};

const FOCAL_PERSPECTIVE = {
  8: "ultra-wide perspective",
  14: "wide-angle perspective",
  24: "wide-angle dynamic perspective",
  35: "natural cinematic perspective",
  50: "standard portrait perspective",
  85: "classic portrait perspective",
};

const APERTURE_EFFECT = {
  "f/1.4": "shallow depth of field, creamy bokeh",
  "f/4": "balanced depth of field",
  "f/11": "deep focus clarity, sharp foreground to background",
};

const ASSET_URLS = {
  "Modular 8K Digital": "/assets/cinema/modular_8k_digital.webp",
  "Full-Frame Cine Digital": "/assets/cinema/full_frame_cine_digital.webp",
  "Grand Format 70mm Film": "/assets/cinema/grand_format_70mm_film.webp",
  "Studio Digital S35": "/assets/cinema/studio_digital_s35.webp",
  "Classic 16mm Film": "/assets/cinema/classic_16mm_film.webp",
  "Premium Large Format Digital":
    "/assets/cinema/premium_large_format_digital.webp",
  "Creative Tilt Lens": "/assets/cinema/creative_tilt_lens.webp",
  "Compact Anamorphic": "/assets/cinema/compact_anamorphic.webp",
  "Extreme Macro": "/assets/cinema/extreme_macro.webp",
  "70s Cinema Prime": "/assets/cinema/70s_cinema_prime.webp",
  "Classic Anamorphic": "/assets/cinema/classic_anamorphic.webp",
  "Premium Modern Prime": "/assets/cinema/premium_modern_prime.webp",
  "Warm Cinema Prime": "/assets/cinema/warm_cinema_prime.webp",
  "Swirl Bokeh Portrait": "/assets/cinema/swirl_bokeh_portrait.webp",
  "Vintage Prime": "/assets/cinema/vintage_prime.webp",
  "Halation Diffusion": "/assets/cinema/halation_diffusion.webp",
  "Clinical Sharp Prime": "/assets/cinema/clinical_sharp_prime.webp",
  "f/1.4": "/assets/cinema/f_1_4.webp",
  "f/4": "/assets/cinema/f_4.webp",
  "f/11": "/assets/cinema/f_11.webp",
};

const ASPECT_RATIOS = ["16:9", "21:9", "9:16", "1:1", "4:5"];
const RESOLUTIONS = ["1K", "2K", "4K"];
const CAMERAS = Object.keys(CAMERA_MAP);
const LENSES = Object.keys(LENS_MAP);
const FOCAL_LENGTHS = Object.keys(FOCAL_PERSPECTIVE).map((k) => parseInt(k));
const APERTURES = Object.keys(APERTURE_EFFECT);

function buildNanoBananaPrompt(
  basePrompt,
  camera,
  lens,
  focalLength,
  aperture,
) {
  const cameraDesc = CAMERA_MAP[camera] || camera;
  const lensDesc = LENS_MAP[lens] || lens;
  const perspective = FOCAL_PERSPECTIVE[focalLength] || "";
  const depthEffect = APERTURE_EFFECT[aperture] || "";
  const qualityTags = [
    "professional photography",
    "ultra-detailed",
    "8K resolution",
  ];
  const parts = [
    basePrompt,
    `shot on a ${cameraDesc}`,
    `using a ${lensDesc} at ${focalLength}mm ${perspective ? `(${perspective})` : ""}`,
    `aperture ${aperture}`,
    depthEffect,
    "cinematic lighting",
    "natural color science",
    "high dynamic range",
    qualityTags.join(", "),
  ];
  return parts.filter((p) => p && p.trim() !== "").join(", ");
}

// ─── Dropdown ────────────────────────────────────────────────────────────────

function Dropdown({ items, selected, onSelect, triggerRef, onClose }) {
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ bottom: 0, left: 0 });

  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left,
      });
    }

    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    const timer = setTimeout(
      () => document.addEventListener("click", handler),
      0,
    );
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handler);
    };
  }, [triggerRef, onClose]);

  return (
    <div
      ref={menuRef}
      className="custom-dropdown fixed bg-[#1a1a1a] border border-white/10 rounded-xl py-1 shadow-2xl z-50 flex flex-col min-w-[100px] animate-fade-in"
      style={{ bottom: position.bottom, left: position.left }}
    >
      {items.map((item) => (
        <button
          key={item}
          className={`px-3 py-2 text-xs font-bold text-left hover:bg-white/10 transition-colors ${item === selected ? "text-primary" : "text-white"}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
            onClose();
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

// ─── Scroll Column (Camera Controls) ─────────────────────────────────────────

function ScrollColumn({ title, items, columnKey, value, onChange }) {
  const listRef = useRef(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTopStart = useRef(0);
  const isSnapEnabled = useRef(true);

  // Scroll to initial value on mount
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const timer = setTimeout(() => {
      const target = Array.from(list.children).find(
        (c) => c.dataset.value == String(value),
      );
      if (target) target.scrollIntoView({ block: "center" });
    }, 100);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const centerY = list.scrollTop + list.clientHeight / 2;
    let closest = null;
    let minDist = Infinity;

    const children = Array.from(list.children).filter((c) => c.dataset.value);
    children.forEach((child) => {
      const childCenter = child.offsetTop + child.offsetHeight / 2;
      const dist = Math.abs(centerY - childCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = child;
      }
    });

    children.forEach((child) => {
      const imgBox = child.querySelector("[data-imgbox]");
      const label = child.querySelector("[data-label]");
      const focalSpan = imgBox?.querySelector("[data-focal-text]");
      const isClosest = child === closest;

      if (isClosest) {
        child.classList.remove("opacity-30", "scale-75", "blur-[1px]");
        child.classList.add("opacity-100", "scale-100", "blur-0", "z-30");
        if (imgBox) {
          imgBox.classList.add(
            "border-primary/50",
            "shadow-glow-sm",
            "scale-110",
          );
          imgBox.classList.remove("border-white/10", "bg-white/5");
        }
        if (focalSpan) focalSpan.classList.add("text-primary");
        if (label) label.classList.add("text-primary", "text-shadow-sm");
      } else {
        child.classList.add("opacity-30", "scale-75", "blur-[1px]");
        child.classList.remove("opacity-100", "scale-100", "blur-0", "z-30");
        if (imgBox) {
          imgBox.classList.remove(
            "border-primary/50",
            "shadow-glow-sm",
            "scale-110",
          );
          imgBox.classList.add("border-white/10", "bg-white/5");
        }
        if (focalSpan) focalSpan.classList.remove("text-primary");
        if (label) label.classList.remove("text-primary", "text-shadow-sm");
      }
    });

    if (closest) {
      const newVal =
        columnKey === "focal"
          ? parseInt(closest.dataset.value)
          : closest.dataset.value;
      if (String(newVal) !== String(value)) {
        onChange(newVal);
      }
    }
  }, [columnKey, value, onChange]);

  // Attach scroll handler with initial check
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.addEventListener("scroll", handleScroll);
    const timer = setTimeout(handleScroll, 150);
    return () => {
      list.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [handleScroll]);

  // Mouse drag handlers
  const onMouseDown = (e) => {
    isDragging.current = true;
    isSnapEnabled.current = false;
    listRef.current.classList.add("cursor-grabbing");
    listRef.current.classList.remove("snap-y");
    startY.current = e.pageY - listRef.current.offsetTop;
    scrollTopStart.current = listRef.current.scrollTop;
    e.preventDefault();
  };

  const onMouseLeave = () => {
    isDragging.current = false;
    listRef.current.classList.remove("cursor-grabbing");
    listRef.current.classList.add("snap-y");
  };

  const onMouseUp = () => {
    isDragging.current = false;
    listRef.current.classList.remove("cursor-grabbing");
    listRef.current.classList.add("snap-y");
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const y = e.pageY - listRef.current.offsetTop;
    const walk = (y - startY.current) * 1.5;
    listRef.current.scrollTop = scrollTopStart.current - walk;
  };

  const onItemClick = (item) => {
    const list = listRef.current;
    if (!list) return;
    const target = Array.from(list.children).find(
      (c) => c.dataset.value == String(item),
    );
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="flex flex-col items-center relative w-[140px] md:w-[160px] shrink-0 snap-center group">
      <div className="mb-3 text-[9px] font-black text-white/40 uppercase tracking-[0.2em] text-center">
        {title}
      </div>
      <div className="relative overflow-hidden w-full h-[40vh] md:h-[320px] bg-[#050505]/60 rounded-2xl border border-white/[0.05] shadow-2xl backdrop-blur-2xl transition-transform duration-500 hover:scale-[1.01] hover:border-white/[0.1]">
        {/* Top mask */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-20 pointer-events-none" />
        {/* Bottom mask */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-20 pointer-events-none" />
        {/* Center selection indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[80px] bg-primary/[0.03] border border-primary/[0.1] rounded-2xl pointer-events-none z-0" />

        <div
          ref={listRef}
          className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory relative z-10"
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {/* Top spacer */}
          <div style={{ height: "calc(50% - 50px)" }} />

          {items.map((item) => {
            const imageUrl = ASSET_URLS[item];
            return (
              <div
                key={item}
                data-value={item}
                className="h-[100px] flex flex-col items-center justify-center gap-3 snap-center cursor-pointer transition-all duration-500 ease-out text-white p-2 select-none opacity-30 scale-75 blur-[1px]"
                onClick={() => onItemClick(item)}
              >
                <div
                  data-imgbox="true"
                  className="w-14 h-14 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-500 shadow-inner overflow-hidden relative"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={String(item)}
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : columnKey === "focal" ? (
                    <span
                      data-focal-text="true"
                      className="text-lg font-bold text-white/50"
                    >
                      {item}
                    </span>
                  ) : (
                    <div className="w-3 h-3 bg-white/20 rounded-full" />
                  )}
                </div>
                <span
                  data-label="true"
                  className="text-[9px] md:text-[10px] font-bold uppercase text-center leading-tight max-w-full truncate px-1 tracking-wider"
                >
                  {item}
                </span>
              </div>
            );
          })}

          {/* Bottom spacer */}
          <div style={{ height: "calc(50% - 50px)" }} />
        </div>
      </div>
    </div>
  );
}

function CameraControlsOverlay({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) {
  const backdropRef = useRef(null);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  const updateSetting = (key) => (val) => {
    onSettingsChange((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div
      ref={backdropRef}
      className={`fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-2xl z-[100] flex items-center justify-center transition-all duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-5xl bg-[#0a0a0a]/60 border border-white/10 rounded-2xl p-6 md:p-10 shadow-3xl transform transition-all duration-500 flex flex-col max-h-[90vh] ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-10"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Camera Configuration
            </h2>
            <p className="text-[11px] font-medium text-white/20 uppercase tracking-[0.2em]">
              Select hardware & optics
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scroll columns */}
        <div className="w-full flex justify-start md:justify-center gap-3 md:gap-6 py-4 md:py-8 overflow-x-auto no-scrollbar snap-x px-4 md:px-0">
          <ScrollColumn
            title="Camera"
            items={CAMERAS}
            columnKey="camera"
            value={settings.camera}
            onChange={updateSetting("camera")}
          />
          <ScrollColumn
            title="Lens"
            items={LENSES}
            columnKey="lens"
            value={settings.lens}
            onChange={updateSetting("lens")}
          />
          <ScrollColumn
            title="Focal Length"
            items={FOCAL_LENGTHS}
            columnKey="focal"
            value={settings.focal}
            onChange={updateSetting("focal")}
          />
          <ScrollColumn
            title="Aperture"
            items={APERTURES}
            columnKey="aperture"
            value={settings.aperture}
            onChange={updateSetting("aperture")}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CinemaStudio({
  historyItems,
}) {
  const PERSIST_KEY = "hg_cinema_studio_persistent";

  // ── Settings state ──
  const [settings, setSettings] = useState({
    prompt: "",
    aspect_ratio: "16:9",
    camera: CAMERAS[0],
    lens: LENSES[0],
    focal: 35,
    aperture: "f/1.4",
  });
  const [resolution, setResolution] = useState("2K");

  // ── UI state ──
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState(null); // null = prompt view
  const [fullscreenUrl, setFullscreenUrl] = useState(null);
  const [activeHistoryIndex, setactiveHistoryIndex] = useState(null);

  // ── Internal history state (used when historyItems prop is not provided) ──
  const [internalHistory, setInternalHistory] = useState([]);

  // ── Dropdown state ──
  const [openDropdown, setOpenDropdown] = useState(null); // 'ar' | 'res' | null
  const arBtnRef = useRef(null);
  const resBtnRef = useRef(null);

  // ── Textarea auto-grow ──
  const textareaRef = useRef(null);
  const resultImgRef = useRef(null);

  // ── Persistence: Load ────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PERSIST_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.settings) setSettings(data.settings);
        if (data.resolution) setResolution(data.resolution);
        if (data.internalHistory) setInternalHistory(data.internalHistory);
      }
    } catch (err) {
      console.warn("Failed to load CinemaStudio persistence:", err);
    }
  }, []);

  // ── Persistence: Save ────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const state = {
          settings,
          resolution,
          internalHistory,
        };
        localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
      } catch (err) {
        console.warn("Failed to save CinemaStudio persistence:", err);
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [settings, resolution, internalHistory]);

  // Derive effective history (prop wins over internal)
  const history = historyItems != null ? historyItems : internalHistory;

  useEffect(() => {
    setCanvasUrl(history[0]?.url || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyItems]);

  const formatSummaryValue = () =>
    `${settings.lens}, ${settings.focal}mm, ${settings.aperture}`;

  // ── Textarea auto-height ──
  const handleTextareaInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
    setSettings((prev) => ({ ...prev, prompt: el.value }));
  };

  // ── Generate ──
  const handleGenerate = useCallback(() => {
    alert(
      "Generation is temporarily unavailable because the provider account does not have enough credits yet.",
    );
  }, []);

  // ── Regenerate ──
  const handleRegenerate = useCallback(() => {
    setCanvasUrl(null);
    // Small delay then generate
    setTimeout(() => handleGenerate(), 300);
  }, [handleGenerate]);

  // ── Download ──
  const handleDownload = useCallback(async () => {
    if (!canvasUrl) return;
    try {
      const response = await fetch(canvasUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `cinema-shot-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(canvasUrl, "_blank");
    }
  }, [canvasUrl]);

  // ── Load history item ──
  const loadHistoryItem = (entry, idx) => {
    if (entry.settings) {
      setSettings((prev) => ({
        ...prev,
        camera: entry.settings.camera ?? prev.camera,
        lens: entry.settings.lens ?? prev.lens,
        focal: entry.settings.focal ?? prev.focal,
        aperture: entry.settings.aperture ?? prev.aperture,
        aspect_ratio: entry.settings.aspect_ratio ?? prev.aspect_ratio,
        prompt: entry.settings.prompt ?? prev.prompt,
      }));
      if (entry.settings.resolution) setResolution(entry.settings.resolution);

      // Sync textarea height
      if (textareaRef.current) {
        textareaRef.current.value = entry.settings.prompt || "";
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + "px";
      }
    }
    setCanvasUrl(entry.url);
  };

  const resetToPrompt = () => {
    setCanvasUrl(null);
    setSettings((prev) => ({ ...prev, prompt: "" }));
    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black relative overflow-hidden">
      
      {/* ── CENTRAL GALLERY AREA ── */}
      <div className="flex-1 w-full max-w-7xl mx-auto overflow-y-auto custom-scrollbar pb-40 lg:pb-32 px-2">
        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pt-4 animate-fade-in-up">
            {history.map((entry, idx) => (
              <div
                key={entry.timestamp ?? idx}
                className="relative group rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-xl hover:border-[#d9ff00]/50 transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => loadHistoryItem(entry, idx)}
              >
                <img
                  src={entry.url}
                  alt={`History item ${idx + 1}`}
                  className="w-full aspect-[4/3] object-cover bg-black/40"
                />
                
                {/* Overlay actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    title="Fullscreen"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenUrl(entry.url);
                    }}
                    className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-[#d9ff00] hover:text-black transition-all border border-white/10"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    title="Download"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        const response = await fetch(entry.url);
                        const blob = await response.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = blobUrl;
                        a.download = `cinema-shot-${entry.id || idx}.jpg`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(blobUrl);
                      } catch {
                        window.open(entry.url, "_blank");
                      }
                    }}
                    className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-[#d9ff00] hover:text-black transition-all border border-white/10"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 bg-black/80 backdrop-blur-sm border-t border-white/5 flex-1 flex flex-col justify-between gap-2">
                  <p className="text-white/70 text-xs line-clamp-3 leading-relaxed">
                    {entry.settings?.prompt || "No prompt"}
                  </p>
                  <div className="flex items-center justify-between mt-1 flex-wrap gap-1">
                    <span className="text-[10px] font-bold text-[#d9ff00] px-2 py-0.5 bg-[#d9ff00]/10 rounded border border-[#d9ff00]/20">
                      {entry.settings?.camera || "Standard"}
                    </span>
                    <div className="flex gap-2">
                      <span className="text-[10px] text-white/40">{entry.settings?.lens || "35mm"}</span>
                      {entry.settings?.aspect_ratio && (
                        <span className="text-[10px] text-white/40">{entry.settings.aspect_ratio}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in-up transition-all duration-700 min-h-[50vh]">
            <div className="mb-12 relative group">
              <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
              <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white/[0.02] rounded-[2rem] flex items-center justify-center border border-white/[0.05] overflow-hidden backdrop-blur-sm">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 relative z-10 transition-transform duration-500 group-hover:scale-110">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary opacity-80">
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </div>
                <div className="absolute top-4 right-4 text-[10px] text-primary/40 animate-pulse">REC</div>
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 text-center px-4">
              <span className="text-white/40 font-medium">START CREATING WITH</span><br />
              <span className="text-white uppercase tracking-wider">Cinema Studio</span>
            </h1>
            <p className="text-white/40 text-sm md:text-base font-medium tracking-wide text-center max-w-lg leading-relaxed">
              What would you shoot with infinite budget?
            </p>
          </div>
        )}
      </div>

      {/* ── BOTTOM PROMPT BAR ── */}
      <div className="absolute bottom-4 left-4 right-4 md:left-0 md:right-0 md:mx-auto md:max-w-[95%] lg:max-w-4xl z-30 transition-all duration-700 animate-fade-in-up">
        <div className="mb-3 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
          Provider connection is configured, but cinema generation is temporarily unavailable because the account has insufficient credits.
        </div>

        <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-md p-4 flex justify-between shadow-2xl items-end relative gap-2">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-3 min-h-[80px] justify-between py-1">
            {/* Input Row */}
            <div className="flex items-start gap-4 w-full">
              <textarea
                ref={textareaRef}
                placeholder="Describe your cinema scene..."
                className="w-full bg-transparent border-none text-white text-sm placeholder:text-white/10 focus:outline-none resize-none pt-1 leading-relaxed min-h-[40px] max-h-[150px] md:max-h-[250px] overflow-y-auto custom-scrollbar disabled:opacity-40"
                rows={1}
                onInput={handleTextareaInput}
              />
            </div>
            <div className="flex justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3">
                {/* Aspect Ratio Button */}
                <div className="relative">
                  <button
                    ref={arBtnRef}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] hover:bg-white/10 text-xs font-bold text-white/40 hover:text-white transition-colors rounded-md border border-white/[0.03]"
                    onClick={() =>
                      setOpenDropdown((d) => (d === "ar" ? null : "ar"))
                    }
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
                      <rect x="2" y="7" width="20" height="10" rx="2" ry="2" />
                    </svg>
                    {settings.aspect_ratio}
                  </button>
                  {openDropdown === "ar" && (
                    <Dropdown
                      items={ASPECT_RATIOS}
                      selected={settings.aspect_ratio}
                      onSelect={(val) =>
                        setSettings((prev) => ({ ...prev, aspect_ratio: val }))
                      }
                      triggerRef={arBtnRef}
                      onClose={() => setOpenDropdown(null)}
                    />
                  )}
                </div>

                {/* Resolution Button */}
                <div className="relative">
                  <button
                    ref={resBtnRef}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] hover:bg-white/10 text-xs font-bold text-white/40 hover:text-white transition-colors rounded-md border border-white/[0.03]"
                    onClick={() =>
                      setOpenDropdown((d) => (d === "res" ? null : "res"))
                    }
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    {resolution}
                  </button>
                  {openDropdown === "res" && (
                    <Dropdown
                      items={RESOLUTIONS}
                      selected={resolution}
                      onSelect={setResolution}
                      triggerRef={resBtnRef}
                      onClose={() => setOpenDropdown(null)}
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 h-full self-end mb-1">
                {/* Summary Card (triggers overlay) */}
                <button
                  className="flex flex-col items-start justify-center px-4 py-1.5 bg-white/[0.03] rounded-md border border-white/[0.03] hover:border-white/20 transition-all text-left flex-1 min-w-[100px] md:min-w-[160px] max-w-[240px] h-[50px] relative group overflow-hidden"
                  onClick={() => setIsOverlayOpen(true)}
                >
                  <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#d9ff00] rounded-full shadow-lg shadow-[#d9ff00]/20" />
                  <span className="text-[9px] font-bold text-white/30 uppercase truncate w-full tracking-wider group-hover:text-white transition-colors">
                    {settings.camera}
                  </span>
                  <span className="text-xs font-semibold text-white/70 truncate w-full group-hover:text-[#d9ff00] transition-colors">
                    {formatSummaryValue()}
                  </span>
                </button>

                {/* Generate Button */}
                <button
                  className="h-[50px] px-8 bg-white/10 text-white/60 rounded-md font-medium text-sm transition-all flex items-center justify-center gap-2 border border-white/10 cursor-not-allowed"
                  disabled={true}
                  title="Generation is unavailable until provider credits are added"
                  onClick={handleGenerate}
                >
                  <span>Unavailable</span>
                </button>
              </div>
            </div>
          </div>  
        </div>
      </div>

      {/* ── Camera Controls Overlay ── */}
      <CameraControlsOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}
