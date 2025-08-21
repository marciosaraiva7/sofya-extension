/**
 * Content script for Sofya Extension Shadow DOM Modal
 * Injects a pill-style modal that transforms into a recorder control bar
 * Only renders when user is authenticated
 */

// Check if modal is already injected to prevent duplicates
if (!window.sofyaModalInjected && !document.querySelector('#sofya-modal-root')) {
  window.sofyaModalInjected = true;
  class SofyaModal {
    constructor() {
      this.isExpanded = false;
      this.isRecording = false;
      this.isAuthenticated = false;
      this.shadowRoot = null;
      this.modalRoot = null;
      
      // Check authentication status from extension storage
      this.checkAuthStatus().then(() => {
        if (this.isAuthenticated) {
          this.init();
        }
      });
    }

    async checkAuthStatus() {
      try {
        // Get authentication status from localStorage (where the extension stores it)
        const authData = localStorage.getItem('sofya_mocked_auth');
        if (authData) {
          const parsed = JSON.parse(authData);
          const isExpired = Date.now() - parsed.loginTime > 24 * 60 * 60 * 1000;
          this.isAuthenticated = !isExpired && parsed.isAuthenticated;
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        this.isAuthenticated = false;
      }
    }

    init() {
      this.createModalRoot();
      this.createShadowDOM();
      this.render();
      this.attachEventListeners();
    }

    createModalRoot() {
      this.modalRoot = document.createElement('div');
      this.modalRoot.id = 'sofya-modal-root';
      this.modalRoot.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        left: 20px !important;
        z-index: 999999 !important;
        pointer-events: auto !important;
      `;
      document.body.appendChild(this.modalRoot);
    }

    createShadowDOM() {
      this.shadowRoot = this.modalRoot.attachShadow({ mode: 'closed' });
      
      // Add styles to shadow DOM
      const style = document.createElement('style');
      style.textContent = this.getStyles();
      this.shadowRoot.appendChild(style);
    }

    getStyles() {
      return `
        :host {
          all: initial;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }
        
        .sofya-modal {
          position: relative;
          background: white;
          border-radius: 20px;
          box-shadow: 0px 5px 15px 0px rgba(54, 95, 215, 0.15);
          transition: all 0.3s ease-in-out;
          cursor: pointer;
          user-select: none;
        }
        
        /* Pill state (collapsed) */
        .sofya-modal.collapsed {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Recorder control bar state (expanded) */
        .sofya-modal.expanded {
          width: 415px;
          height: 96px;
          cursor: default;
        }
        
        .pill-content {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          opacity: 1;
          transition: opacity 0.2s ease;
        }
        
        .sofya-modal.expanded .pill-content {
          opacity: 0;
          pointer-events: none;
        }
        
        .recorder-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          display: flex;
          align-items: center;
          padding: 10px 15px;
          box-sizing: border-box;
        }
        
        .sofya-modal.expanded .recorder-content {
          opacity: 1;
          pointer-events: auto;
        }
        
        .logo {
          width: 24px;
          height: 24px;
        }
        
        .waveform {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 24px;
          margin: 0 20px;
        }
        
        .wave-line {
          width: 2.5px;
          background: #9CB1F0;
          margin: 0 1px;
          border-radius: 1px;
          transition: height 0.1s ease;
        }
        
        .controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .control-button {
          background: none;
          border: none;
          color: #4B5576;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 400;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.2s ease;
        }
        
        .control-button:hover {
          color: #365FD7;
        }
        
        .stop-icon {
          display: flex;
          gap: 3px;
        }
        
        .stop-bar {
          width: 5px;
          height: 15px;
          background: #767D96;
          border-radius: 1px;
        }
        
        .divider {
          width: 1px;
          height: 66px;
          background: #E8F0FC;
        }
        
        .end-button {
          background: #E3EAFF;
          border: none;
          border-radius: 0 20px 20px 0;
          padding: 10px 15px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          color: #4B5576;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 400;
          transition: background-color 0.2s ease;
        }
        
        .end-button:hover {
          background: #d1dcff;
        }
        
        .end-icon {
          width: 18px;
          height: 18px;
        }
        
        @keyframes wave {
          0%, 100% { height: 8px; }
          50% { height: 20px; }
        }
        
        .wave-line.animate {
          animation: wave 1s ease-in-out infinite;
        }
        
        .wave-line:nth-child(2n) {
          animation-delay: 0.1s;
        }
        
        .wave-line:nth-child(3n) {
          animation-delay: 0.2s;
        }
        
        .wave-line:nth-child(4n) {
          animation-delay: 0.3s;
        }
      `;
    }

    render() {
      const modal = document.createElement('div');
      modal.className = 'sofya-modal collapsed';
      modal.innerHTML = `
        <!-- Pill Content (collapsed state) -->
        <div class="pill-content">
          <svg class="logo" viewBox="0 0 159 59" fill="none">
            <path d="M20.5 45.5C31.5 45.5 40.5 36.5 40.5 25.5C40.5 14.5 31.5 5.5 20.5 5.5C9.5 5.5 0.5 14.5 0.5 25.5C0.5 36.5 9.5 45.5 20.5 45.5Z" fill="#365FD7"/>
            <path d="M79.5 25.5C79.5 36.5 70.5 45.5 59.5 45.5C48.5 45.5 39.5 36.5 39.5 25.5C39.5 14.5 48.5 5.5 59.5 5.5C70.5 5.5 79.5 14.5 79.5 25.5Z" fill="#6B86D6"/>
          </svg>
        </div>
        
        <!-- Recorder Content (expanded state) -->
        <div class="recorder-content">
          <div class="waveform">
            ${Array.from({length: 40}, (_, i) => `<div class="wave-line" style="height: ${4 + Math.random() * 16}px;"></div>`).join('')}
          </div>
          
          <div class="controls">
            <button class="control-button pause-btn">Pausar</button>
            <div class="stop-icon">
              <div class="stop-bar"></div>
              <div class="stop-bar"></div>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <button class="end-button">
            <svg class="end-icon" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <rect x="9" y="9" width="6" height="6"/>
            </svg>
            Encerrar
          </button>
        </div>
      `;
      
      this.shadowRoot.appendChild(modal);
      this.modal = modal;
    }

    attachEventListeners() {
      const modal = this.shadowRoot.querySelector('.sofya-modal');
      const pauseBtn = this.shadowRoot.querySelector('.pause-btn');
      const endBtn = this.shadowRoot.querySelector('.end-button');
      
      // Toggle expansion when clicking pill
      modal.addEventListener('click', (e) => {
        if (modal.classList.contains('collapsed')) {
          e.stopPropagation();
          this.expand();
        }
      });
      
      // Pause/Resume functionality
      pauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleRecording();
      });
      
      // End recording
      endBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.endRecording();
      });
      
      // Click outside to collapse
      document.addEventListener('click', (e) => {
        if (!modal.contains(e.target) && modal.classList.contains('expanded')) {
          this.collapse();
        }
      });
    }

    expand() {
      this.modal.classList.remove('collapsed');
      this.modal.classList.add('expanded');
      this.isExpanded = true;
      this.startWaveAnimation();
    }

    collapse() {
      this.modal.classList.remove('expanded');
      this.modal.classList.add('collapsed');
      this.isExpanded = false;
      this.stopWaveAnimation();
    }

    toggleRecording() {
      this.isRecording = !this.isRecording;
      const pauseBtn = this.shadowRoot.querySelector('.pause-btn');
      
      if (this.isRecording) {
        pauseBtn.textContent = 'Pausar';
        this.startWaveAnimation();
      } else {
        pauseBtn.textContent = 'Retomar';
        this.stopWaveAnimation();
      }
    }

    startWaveAnimation() {
      const waveLines = this.shadowRoot.querySelectorAll('.wave-line');
      waveLines.forEach(line => line.classList.add('animate'));
    }

    stopWaveAnimation() {
      const waveLines = this.shadowRoot.querySelectorAll('.wave-line');
      waveLines.forEach(line => line.classList.remove('animate'));
    }

    endRecording() {
      // End recording and collapse
      this.isRecording = false;
      this.collapse();
      
      // Show completion message (could be expanded to show results UI)
      console.log('Recording ended');
    }

    // Public method to update auth status (called from extension popup)
    updateAuthStatus(isAuthenticated) {
      const wasAuthenticated = this.isAuthenticated;
      this.isAuthenticated = isAuthenticated;
      
      if (isAuthenticated && !wasAuthenticated) {
        // User just logged in, show modal
        if (!this.modalRoot) {
          this.init();
        }
      } else if (!isAuthenticated && wasAuthenticated) {
        // User logged out, hide modal
        if (this.modalRoot) {
          this.modalRoot.remove();
          this.modalRoot = null;
          this.shadowRoot = null;
        }
      }
    }
  }

  // Initialize modal
  window.sofyaModal = new SofyaModal();
  
  // Listen for messages from the extension
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SOFYA_AUTH_STATUS') {
      window.sofyaModal.updateAuthStatus(message.isAuthenticated);
    } else if (message.type === 'SOFYA_SHOW_MODAL') {
      // Only show modal if user is authenticated
      if (window.sofyaModal.isAuthenticated) {
        window.sofyaModal.expand();
      }
    }
  });
}