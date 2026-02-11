import React, { useEffect, useMemo, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

export default function Waveform({ file, onSelectionChange }) {
  const containerRef = useRef(null);
  const wsRef = useRef(null);
  const regionRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !file) return;

    // Create Object URL
    const audioUrl = URL.createObjectURL(file);
    let isAborted = false;

    // Destroy previous instance if it exists
    if (wsRef.current) {
      try {
        wsRef.current.destroy();
      } catch (e) {
        // ignore
      }
      wsRef.current = null;
    }

    // Init Plugins
    const wsRegions = RegionsPlugin.create();

    // Init WaveSurfer
    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 120,
      normalize: true,
      waveColor: "#475569",
      progressColor: "#818cf8",
      cursorColor: "#2dd4bf",
      barWidth: 2,
      barGap: 3,
      barRadius: 3,
      plugins: [wsRegions],
    });

    wsRef.current = ws;

    // Handlers
    ws.on("ready", () => {
      if (isAborted) return;
      setIsReady(true);
      const dur = ws.getDuration();
      setDuration(dur);

      const start = 0;
      const end = Math.min(dur, 600);

      const r = wsRegions.addRegion({
        start,
        end,
        drag: true,
        resize: true,
        color: "rgba(129, 140, 248, 0.15)",
      });

      regionRef.current = r;
      onSelectionChange?.({ startSec: start, endSec: end, durationSec: dur });
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("finish", () => setIsPlaying(false));

    wsRegions.on("region-updated", (region) => {
      onSelectionChange?.({
        startSec: region.start,
        endSec: region.end,
        durationSec: ws.getDuration(),
      });
    });

    wsRegions.on("region-out", (region) => {
      onSelectionChange?.({
        startSec: region.start,
        endSec: region.end,
        durationSec: ws.getDuration(),
      });
    });

    // SAFER LOAD: Async load with try/catch to handle aborts
    (async () => {
      try {
        await ws.load(audioUrl);
      } catch (err) {
        // Only log real errors, ignore aborts/interruptions
        if (!isAborted && err.name !== 'AbortError') {
            console.warn("WaveSurfer load error:", err);
        }
      }
    })();

    // CLEANUP FUNCTION
    return () => {
      isAborted = true;
      URL.revokeObjectURL(audioUrl);
      
      if (ws) {
        // Stop audio first
        try { ws.pause(); } catch (e) {}
        
        // Unsubscribe all events
        try { ws.unAll(); } catch (e) {}

        // Destroy instance safely
        try {
          ws.destroy();
        } catch (err) {
          // Completely ignore errors during cleanup (e.g. AbortError)
        }
      }
      wsRef.current = null;
    };
  }, [file, onSelectionChange]);

  const toggle = () => {
    if (!wsRef.current) return;
    wsRef.current.playPause();
  };

  const playRegion = () => {
    const ws = wsRef.current;
    const region = regionRef.current;
    if (!ws || !region) return;
    ws.play(region.start, region.end);
  };

  const selectFull = () => {
    const ws = wsRef.current;
    const region = regionRef.current;
    if (!ws || !region) return;
    const dur = ws.getDuration();
    region.setOptions({ start: 0, end: dur });
    onSelectionChange?.({ startSec: 0, endSec: dur, durationSec: dur });
  };

  return (
    <div className="stack">
      <div ref={containerRef} className="card" />
      <div className="kpi">
        <button className="btn secondary" disabled={!isReady} onClick={toggle}>
          {isPlaying ? "Pause" : "Play/Pause"}
        </button>
        <button className="btn secondary" disabled={!isReady} onClick={playRegion}>
          Play Selection
        </button>
        <button className="btn secondary" disabled={!isReady} onClick={selectFull}>
          Select Full
        </button>
        <span className="pill">Duration: {duration.toFixed(2)}s</span>
        <span className="pill">Drag/resize region to select</span>
      </div>
      <div className="muted">
        Tip: Default selection is the full song (up to 10 min).
      </div>
    </div>
  );
}