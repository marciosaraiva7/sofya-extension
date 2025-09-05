/**
 * Sofya Floating Composer (ChatGPT-style) — Content Script
 * Pure JS, Shadow DOM isolated, draggable and persistent position.
 */

// Avoid multiple injections
if (
  !window.sofyaModalInjected &&
  !document.querySelector("#sofya-modal-root")
) {
  window.sofyaModalInjected = true;

  class SofyaFloatingComposer {
    constructor() {
      this.isAuthenticated = false;
      this.modalRoot = null;
      this.shadowRoot = null;
      this.wrapper = null; // draggable wrapper
      this.textarea = null;
      this.dragging = false;
      this.dragOffsetX = 0;
      this.dragOffsetY = 0;
      this.positionKey = "sofya_widget_position_v1";

      // Optional recording placeholders
      this.isRecording = false;
      // Transcription state
      this.transcriber = null;
      this.lastRecognized = "";
      this.currentRecognizing = "";
      this.API_KEY = "mZabgaUEdC5uvcKy5iX7uaRNqZURG8SG1vTm5Q19"; // provided speech key

      this.checkAuthStatus().then(() => {
        if (this.isAuthenticated) this.init();
      });
    }

    async checkAuthStatus() {
      try {
        const authData = localStorage.getItem("sofya_mocked_auth");
        if (authData) {
          const parsed = JSON.parse(authData);
          const isExpired = Date.now() - parsed.loginTime > 24 * 60 * 60 * 1000;
          this.isAuthenticated = !isExpired && !!parsed.isAuthenticated;
        } else {
          this.isAuthenticated = false;
        }
      } catch (e) {
        console.error("Sofya: auth check error", e);
        this.isAuthenticated = false;
      }
    }

    init() {
      this.createModalRoot();
      this.createShadowDOM();
      this.render();
      this.restorePosition();
      this.attachGlobalListeners();
      console.log("Sofya: Floating composer initialized");
    }

    createModalRoot() {
      const root = document.createElement("div");
      root.id = "sofya-modal-root";
      root.style.cssText = [
        "position: fixed",
        "inset: 0", // to allow pointer capture while dragging
        "z-index: 2147483647",
        "pointer-events: none", // children re-enable
      ].join(";");
      document.documentElement.appendChild(root);
      this.modalRoot = root;
    }

    createShadowDOM() {
      this.shadowRoot = this.modalRoot.attachShadow({ mode: "closed" });
      const style = document.createElement("style");
      style.textContent = `
        :host { all: initial; }
        .wrapper {
          position: fixed;
          left: 50%;
          bottom: 24px;
          transform: translateX(-50%);
          width: min(92vw, 380px);
          pointer-events: auto;
          user-select: none;
        }
        .bar {
          background: #e8e8ff;
          color: #1f2937;
          border: 1px solid #c9c9ff;
          border-radius: 24px;
          box-shadow: 0 10px 24px rgba(31,41,55,0.18), 0 2px 6px rgba(31,41,55,0.08);
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          cursor: default;
        }
        .drag-strip {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.18);
          cursor: grab;
        }
        .section { display: flex; align-items: center; gap: 8px; }
        .center { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; }
        .btn {
          appearance: none; border: 0; background: transparent; color: inherit;
          width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center;
          cursor: pointer; opacity: 0.9; color: #111827;
        }
        .btn:hover { background: rgba(17,24,39,0.06); opacity: 1; }
        .btn:active { transform: translateY(1px); }
        .badge { font-size: 12px; padding: 4px 8px; border-radius: 8px; background: #dadaff; color: #111827; opacity: 1; flex: 0 0 auto; }
        textarea {
          width: 100%; min-height: 24px; max-height: 180px; resize: none; outline: none; border: none;
          background: transparent; color: #111827; font: 16px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif;
          padding: 8px 6px; user-select: text; caret-color: #111827; margin-left: 6px; margin-right: 6px;
        }
        textarea::placeholder { color: rgba(17,24,39,0.55); }
        .send {
          width: 36px; height: 36px; border-radius: 999px; background: #ffffff; color: #111827; display: grid; place-items: center; border: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(17,24,39,0.10);
        }
        .send[disabled] { opacity: .5; cursor: not-allowed; }
        .hidden { display: none !important; }
        .wave {
          width: 100%; height: 28px; flex: 0 0 auto; opacity: .9; display: block; margin-top: 0;
        }
        .wave.hidden { display: none !important; }
      `;
      this.shadowRoot.appendChild(style);
    }

    svg(icon) {
      const map = {
        play: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
        pause:
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
        stop: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>',
        globe:
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 2.07V6H8.5C9.2 4.77 10.2 3.8 11 4.07zM6.05 7H11v3H4.32a8.01 8.01 0 011.73-3zM4.07 13H11v3H6.05a8.01 8.01 0 01-1.98-3zM8.5 20H11v1.93c-.8.27-1.8-.7-2.5-1.93zM13 21.93V20h2.5c-.7 1.23-1.7 2.2-2.5 1.93zM17.95 17H13v-3h6.68a8.01 8.01 0 01-1.73 3zM19.93 11H13V8h4.95a8.01 8.01 0 011.98 3z"/></svg>',
        send: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
        megaphone:
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 10v4a1 1 0 001 1h2l5 3V6L6 9H4a1 1 0 00-1 1zm15-5v14h2V5h-2z"/></svg>',
        copy:
          '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
      };
      const div = document.createElement("div");
      div.innerHTML = map[icon] || "";
      return div.firstChild;
    }

    render() {
      // Wrapper (draggable)
      const wrapper = document.createElement("div");
      wrapper.className = "wrapper";

      // Composer bar
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.position = "relative";

      // Drag strip (explicit handle)
      const strip = document.createElement("div");
      strip.className = "drag-strip";
      strip.title = "Arraste para mover";

      // Left section
      const left = document.createElement("div");
      left.className = "section";
      // Removed grip ("...") and plus buttons
      // const globeBtn = document.createElement("button");
      // globeBtn.className = "btn";
      // globeBtn.appendChild(this.svg("globe"));
      // globeBtn.title = "Contexto web (placeholder)";
      // const megaBtn = document.createElement("button");
      // megaBtn.className = "btn";
      // megaBtn.appendChild(this.svg("megaphone"));
      // megaBtn.title = "Ferramentas (placeholder)";
      // const badge = document.createElement("span");
      // badge.className = "badge";
      // badge.textContent = "4o";
      left.append(strip);

      // Center (textarea + wave stacked)
      const textarea = document.createElement("textarea");
      textarea.setAttribute("placeholder", "Aqui sera exibida a transcricao");
      textarea.rows = 1;
      textarea.readOnly = true;
      textarea.setAttribute("aria-readonly", "true");
      textarea.style.cursor = "copy";
      textarea.title = "Clique para copiar a transcrição";
      this.textarea = textarea;

      // Right section
      const right = document.createElement("div");
      right.className = "section";
      const recordBtn = document.createElement("button");
      recordBtn.className = "btn";
      recordBtn.appendChild(this.svg("play"));
      recordBtn.title = "Iniciar gravação";
      const wave = document.createElement("canvas");
      wave.className = "wave hidden"; // hidden until recording
      wave.width = 300; // drawing buffer size
      wave.height = 28;
      const sendBtn = document.createElement("button");
      sendBtn.className = "btn send";
      sendBtn.appendChild(this.svg("copy"));
      sendBtn.title = "Copiar transcrição";
      sendBtn.disabled = false;

      right.append(recordBtn, sendBtn);

      // Center column to stack textarea and wave inside the bar
      const center = document.createElement("div");
      center.className = "center";
      center.append(textarea, wave);
      bar.append(left, center, right);
      wrapper.appendChild(bar);

      // Append to shadow root
      this.shadowRoot.appendChild(wrapper);
      this.wrapper = wrapper;

      // Events
      // Make textarea read-only and copy content on click
      textarea.addEventListener("keydown", (e) => {
        // Prevent typing/editing
        e.preventDefault();
      });
      textarea.addEventListener("click", async (e) => {
        e.preventDefault();
        const text = this.textarea?.value || "";
        if (!text) return;
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            // Fallback
            const helper = document.createElement("textarea");
            helper.value = text;
            helper.style.position = "fixed";
            helper.style.opacity = "0";
            helper.style.pointerEvents = "none";
            document.documentElement.appendChild(helper);
            helper.focus();
            helper.select();
            try { document.execCommand("copy"); } catch (_) {}
            helper.remove();
          }
          console.log("[Sofya] Transcrição copiada para a área de transferência");
        } catch (err) {
          console.warn("[Sofya] Falha ao copiar transcrição", err);
        }
      });

      // Copy transcription on button click
      sendBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const text = this.textarea?.value || "";
        if (!text) return;
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            const helper = document.createElement("textarea");
            helper.value = text;
            helper.style.position = "fixed";
            helper.style.opacity = "0";
            helper.style.pointerEvents = "none";
            document.documentElement.appendChild(helper);
            helper.focus();
            helper.select();
            try { document.execCommand("copy"); } catch (_) {}
            helper.remove();
          }
          console.log("[Sofya] Transcrição copiada");
        } catch (err) {
          console.warn("[Sofya] Falha ao copiar transcrição", err);
        }
      });

      // Dragging via strip or grip button or empty bar space
      const dragStarters = [strip, bar];
      dragStarters.forEach((el) => {
        el.addEventListener("pointerdown", (ev) => this.onPointerDown(ev));
      });

      // Prevent drag when interacting with inputs/buttons
      textarea.addEventListener("pointerdown", (e) => e.stopPropagation());
      [recordBtn, wave, sendBtn].forEach((b) => {
        b.addEventListener("pointerdown", (e) => e.stopPropagation());
      });

      // Initial height
      this.autoResize(textarea);

      // Recording button logic
      this.recordBtn = recordBtn;
      this.waveCanvas = wave;
      this.waveCtx = wave.getContext("2d");
      this.isRecording = false;
      this.isPaused = false;
      this.audioContext = null;
      this.analyser = null;
      this.mediaStream = null;
      this.sourceNode = null;
      this.waveTimer = null; // setInterval id
      this.waveHistory = []; // trailing bars
      this.waveOptions = {
        fftSize: 128,
        smoothing: 0.8,
        maxBars: 120,
        interval: 50,
      };

      // Click toggles play/pause/resume
      recordBtn.addEventListener("click", () => {
        if (!this.isRecording) {
          this.startRecording();
        } else {
          // Adapted behavior: clicking while recording stops transcription (pause)
          this.pauseRecording();
        }
      });

      // Long-press to stop (encerrar)
      let stopTimer = null;
      const startStopTimer = () => {
        if (!this.isRecording) return;
        stopTimer = setTimeout(() => {
          this.stopRecording();
        }, 800);
      };
      const clearStopTimer = () => {
        if (stopTimer) clearTimeout(stopTimer);
        stopTimer = null;
      };
      recordBtn.addEventListener("pointerdown", startStopTimer);
      recordBtn.addEventListener("pointerup", clearStopTimer);
      recordBtn.addEventListener("pointerleave", clearStopTimer);
      recordBtn.addEventListener("dragstart", clearStopTimer);

      // Right-click to stop as well
      recordBtn.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (this.isRecording) this.stopRecording();
      });
    }

    autoResize(el) {
      el.style.height = "auto";
      const next = Math.min(180, Math.max(24, el.scrollHeight));
      el.style.height = next + "px";
    }

    submit(text) {
      if (!text) return;
      // Example: notify background/page; adapt to your needs
      try {
        chrome.runtime?.sendMessage?.({ type: "SOFYA_COMPOSER_SUBMIT", text });
      } catch (_) {}
      console.log("[Sofya] submit:", text);
      this.textarea.value = "";
      this.autoResize(this.textarea);
    }

    async ensureTranscriber() {
      if (this.transcriber) return this.transcriber;

      // Use UMD exposed by vendor/sofya.transcription.bundle.js
      // Global is 'SofyaTrancription' (UMD name), containing 'SofyaTranscriber'
      const UMD = globalThis.SofyaTrancription;
      const T = UMD && UMD.SofyaTranscriber ? UMD.SofyaTranscriber : null;

      if (typeof T !== "function") {
        console.warn(
          "[Sofya] Transcriber constructor not found at window.SofyaTrancription.SofyaTranscriber."
        );
        return null;
      }

      try {
        const transcriber = new T({
          apiKey: this.API_KEY,
          config: { language: "pt-BR" },
        });

        // Wire events once
        transcriber.on?.("ready", () => {
          console.log("[Sofya] transcriber ready");
        });
        transcriber.on?.("recognizing", (result) => {
          const prev = (this.lastRecognized || "").trim();
          const chunk = (result || "").trim();
          const display = prev && chunk ? `${prev} ${chunk}` : (prev || chunk);
          this.currentRecognizing = chunk;
          if (this.textarea) {
            this.textarea.value = display;
            this.autoResize(this.textarea);
          }
        });
        transcriber.on?.("recognized", (result) => {
          const prev = (this.lastRecognized || "").trim();
          const chunk = (result || "").trim();
          this.currentRecognizing = "";
          this.lastRecognized = prev && chunk ? `${prev} ${chunk}` : (prev || chunk);
          if (this.textarea) {
            this.textarea.value = this.lastRecognized;
            this.autoResize(this.textarea);
          }
        });
        transcriber.on?.("error", (err) => {
          console.error("[Sofya] Transcription error:", err);
          this.isRecording = false;
          this.updateRecordButtonUI();
          this.stopVisualization();
        });

        this.transcriber = transcriber;
        return this.transcriber;
      } catch (e) {
        console.error("[Sofya] Failed to create transcriber:", e);
        return null;
      }
    }

    // ---- Recording state and UI ----
    updateRecordButtonUI() {
      if (!this.recordBtn) return;
      // Clear current icon
      this.recordBtn.innerHTML = "";
      if (!this.isRecording) {
        this.recordBtn.appendChild(this.svg("play"));
        this.recordBtn.title = "Iniciar gravação";
      } else {
        this.recordBtn.appendChild(this.svg("pause"));
        this.recordBtn.title = "Pausar (encerra) a gravação";
      }
    }

    async startRecording() {
      // Reset text buffers on fresh start
      this.lastRecognized = this.textarea?.value?.trim() || "";
      this.currentRecognizing = "";

      // Acquire mic first, reuse same stream for visualization and transcription
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaStream = stream;
      } catch (err) {
        console.warn(
          "[Sofya] Microphone permission denied or unavailable",
          err
        );
        return;
      }

      const transcriber = await this.ensureTranscriber();
      if (!transcriber) {
        console.warn("[Sofya] Cannot start transcription without transcriber");
      }

      // If we have a transcriber, wait for ready then start with the captured stream
      try {
        if (transcriber?.on) {
          transcriber.on("ready", () => {
            try {
              transcriber.startTranscription(stream);
            } catch (e) {
              console.error("[Sofya] startTranscription failed:", e);
            }
          });
        } else {
          // Best-effort fallback
          transcriber?.startTranscription?.(stream);
        }
      } catch (e) {
        console.error("[Sofya] Failed to start transcription:", e);
      }

      this.isRecording = true;
      this.isPaused = false;
      try {
        chrome.runtime?.sendMessage?.({ type: "SOFYA_RECORDING_START" });
      } catch (_) {}
      console.log("[Sofya] recording: started");
      this.updateRecordButtonUI();
      // Start waveform using existing stream
      this.startVisualization(stream);
    }

    pauseRecording() {
      if (!this.isRecording) return;
      // Adapted: pause == stop transcription session
      const stop = async () => {
        try {
          await this.transcriber?.stopTranscription?.();
        } catch (e) {
          // ignore
        }
        this.transcriber = null;
      };
      stop();
      this.isRecording = false;
      this.isPaused = false;
      try {
        chrome.runtime?.sendMessage?.({ type: "SOFYA_RECORDING_PAUSE" });
      } catch (_) {}
      console.log("[Sofya] recording: paused (stopped)");
      this.updateRecordButtonUI();
      this.stopVisualization();
    }

    resumeRecording() {
      /* no-op in adapted flow */
    }

    stopRecording() {
      if (!this.isRecording) return;
      // Stop transcriber if active
      const stop = async () => {
        try {
          await this.transcriber?.stopTranscription?.();
        } catch (e) {
          // ignore
        }
        this.transcriber = null;
      };
      stop();
      this.isRecording = false;
      this.isPaused = false;
      try {
        chrome.runtime?.sendMessage?.({ type: "SOFYA_RECORDING_STOP" });
      } catch (_) {}
      console.log("[Sofya] recording: stopped");
      this.updateRecordButtonUI();
      this.stopVisualization();
    }

    // ---- Wave visualization (vanilla port of useAudioWaveformStream) ----
    startVisualization(existingStream) {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return;
      } catch (_) {
        return;
      }

      // Show canvas
      if (this.waveCanvas) this.waveCanvas.classList.remove("hidden");

      const useStream = existingStream;
      const getStream = () =>
        useStream
          ? Promise.resolve(useStream)
          : navigator.mediaDevices.getUserMedia({ audio: true });

      getStream()
        .then((stream) => {
          if (!this.mediaStream) this.mediaStream = stream;
          const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
          this.audioContext = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          this.sourceNode = source;
          const analyser = audioCtx.createAnalyser();
          this.analyser = analyser;
          analyser.fftSize = this.waveOptions.fftSize;
          analyser.smoothingTimeConstant = this.waveOptions.smoothing;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const { maxBars, interval } = this.waveOptions;

          const draw = () => {
            if (!this.analyser || !this.waveCtx) return;
            this.analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((s, v) => s + v, 0) / dataArray.length;
            const normalized = Math.pow(avg / 255, 1.5);
            this.waveHistory.push(normalized);
            if (this.waveHistory.length > maxBars) this.waveHistory.shift();
            this.paintWave();
          };

          this.waveTimer = window.setInterval(draw, interval);
        })
        .catch((err) => {
          console.warn("Wave getUserMedia failed", err);
          // Hide canvas if permission denied
          if (this.waveCanvas) this.waveCanvas.classList.add("hidden");
        });
    }

    pauseVisualization() {
      // Stop updating bars and suspend processing to freeze the wave
      if (this.waveTimer) {
        clearInterval(this.waveTimer);
        this.waveTimer = null;
      }
      if (this.audioContext && this.audioContext.state === "running") {
        this.audioContext.suspend?.();
      }
    }

    resumeVisualization() {
      // Resume audio processing and re-arm the interval
      if (this.audioContext && this.audioContext.state === "suspended") {
        this.audioContext.resume?.();
      }
      if (!this.waveTimer && this.analyser && this.waveCtx) {
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        const tick = () => {
          if (!this.analyser || !this.waveCtx) return;
          this.analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((s, v) => s + v, 0) / dataArray.length;
          const normalized = Math.pow(avg / 255, 1.5);
          this.waveHistory.push(normalized);
          if (this.waveHistory.length > this.waveOptions.maxBars)
            this.waveHistory.shift();
          this.paintWave();
        };
        this.waveTimer = window.setInterval(tick, this.waveOptions.interval);
      }
    }

    stopVisualization() {
      if (this.waveTimer) {
        clearInterval(this.waveTimer);
        this.waveTimer = null;
      }
      if (this.sourceNode) {
        try {
          this.sourceNode.disconnect();
        } catch (_) {}
        this.sourceNode = null;
      }
      if (this.analyser) {
        try {
          this.analyser.disconnect();
        } catch (_) {}
        this.analyser = null;
      }
      if (this.audioContext) {
        try {
          this.audioContext.close();
        } catch (_) {}
        this.audioContext = null;
      }
      if (this.mediaStream) {
        try {
          this.mediaStream.getTracks().forEach((t) => t.stop());
        } catch (_) {}
        this.mediaStream = null;
      }
      this.waveHistory = [];
      this.clearWave();
      if (this.waveCanvas) this.waveCanvas.classList.add("hidden");
    }

    paintWave() {
      const ctx = this.waveCtx;
      const canvas = this.waveCanvas;
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      // background subtle
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      const bars = this.waveHistory;
      const count = Math.min(bars.length, this.waveOptions.maxBars);
      if (count === 0) return;
      const barW = Math.max(1, Math.floor(w / this.waveOptions.maxBars));
      const gap = 0; // tight bars
      let x = w - count * (barW + gap);
      for (let i = Math.max(0, bars.length - count); i < bars.length; i++) {
        const v = bars[i];
        const bh = Math.max(2, Math.round(v * (h - 2)));
        const y = Math.round(h / 2 - bh / 2);
        // fade older bars
        const age = bars.length - 1 - i;
        const alpha = Math.max(0.25, 1 - age / this.waveOptions.maxBars);
        ctx.fillStyle = `rgba(17,24,39,${alpha.toFixed(3)})`;
        ctx.fillRect(x, y, barW, bh);
        x += barW + gap;
      }
    }

    clearWave() {
      const ctx = this.waveCtx;
      const canvas = this.waveCanvas;
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // ---- Draggable logic ----
    onPointerDown(ev) {
      // Ignore if clicked on interactive elements inside bar (except our explicit handles)
      const tag =
        ev.target && ev.target.tagName ? ev.target.tagName.toLowerCase() : "";
      if (
        tag === "textarea" ||
        (tag === "button" && !ev.currentTarget.classList.contains("drag-strip"))
      ) {
        if (
          ev.currentTarget.classList &&
          !ev.currentTarget.classList.contains("drag-strip")
        )
          return;
      }
      this.dragging = true;
      this.wrapper.style.cursor = "grabbing";
      const rect = this.wrapper.getBoundingClientRect();
      this.dragOffsetX = ev.clientX - rect.left;
      this.dragOffsetY = ev.clientY - rect.top;

      // When we start dragging, switch from centered transform to absolute left/top
      this.wrapper.style.left = rect.left + "px";
      this.wrapper.style.top = rect.top + "px";
      this.wrapper.style.bottom = "auto";
      this.wrapper.style.transform = "none";

      window.addEventListener("pointermove", this.onPointerMove);
      window.addEventListener("pointerup", this.onPointerUp, { once: true });
    }

    onPointerMove = (ev) => {
      if (!this.dragging) return;
      const x = Math.max(
        8,
        Math.min(
          window.innerWidth - this.wrapper.offsetWidth - 8,
          ev.clientX - this.dragOffsetX
        )
      );
      const y = Math.max(
        8,
        Math.min(
          window.innerHeight - this.wrapper.offsetHeight - 8,
          ev.clientY - this.dragOffsetY
        )
      );
      this.wrapper.style.left = x + "px";
      this.wrapper.style.top = y + "px";
    };

    onPointerUp = () => {
      this.dragging = false;
      this.wrapper.style.cursor = "default";
      this.persistPosition();
      window.removeEventListener("pointermove", this.onPointerMove);
    };

    persistPosition() {
      const rect = this.wrapper.getBoundingClientRect();
      const payload = { left: rect.left, top: rect.top };
      try {
        localStorage.setItem(this.positionKey, JSON.stringify(payload));
      } catch (_) {}
    }

    restorePosition() {
      try {
        const raw = localStorage.getItem(this.positionKey);
        if (!raw) return; // keep default bottom-center
        const pos = JSON.parse(raw);
        if (typeof pos.left === "number" && typeof pos.top === "number") {
          this.wrapper.style.left = pos.left + "px";
          this.wrapper.style.top = pos.top + "px";
          this.wrapper.style.bottom = "auto";
          this.wrapper.style.transform = "none";
        }
      } catch (_) {}
    }

    attachGlobalListeners() {
      // ESC hides/show (optional)
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.wrapper) {
          this.wrapper.classList.toggle("hidden");
        }
      });
    }

    updateAuthStatus(isAuthenticated) {
      const was = this.isAuthenticated;
      this.isAuthenticated = !!isAuthenticated;
      if (this.isAuthenticated && !was) {
        if (!this.modalRoot) this.init();
      } else if (!this.isAuthenticated && was) {
        if (this.modalRoot) {
          this.modalRoot.remove();
          this.modalRoot = null;
          this.shadowRoot = null;
        }
      }
    }
  }

  // Bootstrap
  window.sofyaModal = new SofyaFloatingComposer();

  // Listen to background for auth updates
  try {
    chrome.runtime.onMessage.addListener((message) => {
      if (message && message.type === "SOFYA_AUTH_STATUS") {
        window.sofyaModal.updateAuthStatus(message.isAuthenticated);
      }
      if (message && message.type === "SOFYA_COMPOSER_SET") {
        // Optional external setter for textarea content
        if (window.sofyaModal && window.sofyaModal.textarea) {
          window.sofyaModal.textarea.value = message.text || "";
          window.sofyaModal.autoResize(window.sofyaModal.textarea);
        }
      }
      if (message && message.type === "SOFYA_SHOW_MODAL") {
        // No-op for now; composer is always visible; could toggle if needed
        if (window.sofyaModal && window.sofyaModal.wrapper) {
          window.sofyaModal.wrapper.classList.remove("hidden");
        }
      }
    });
  } catch (_) {}

  console.log("Sofya: Content script with floating composer loaded");
}
