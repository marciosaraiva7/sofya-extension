/**
 * Simple Content script for Sofya Extension
 * Shows a basic "Start recording" button when user is authenticated
 */

// Check if modal is already injected to prevent duplicates
if (!window.sofyaModalInjected && !document.querySelector('#sofya-modal-root')) {
  window.sofyaModalInjected = true;

  class SimpleSofyaModal {
    constructor() {
      this.isAuthenticated = false;
      this.shadowRoot = null;
      this.modalRoot = null;
      
      // Recording state
      this.isRecording = false;
      this.isPaused = false;
      this.transcribedText = '';
      this.transcriber = null;
      this.mediaStream = null;
      this.lastRecognized = '';
      
      // Check authentication status
      this.checkAuthStatus().then(() => {
        if (this.isAuthenticated) {
          this.init();
        }
      });
    }

    async checkAuthStatus() {
      try {
        const authData = localStorage.getItem('sofya_mocked_auth');
        console.log('Sofya: Checking auth status...', authData);
        
        if (authData) {
          const parsed = JSON.parse(authData);
          const isExpired = Date.now() - parsed.loginTime > 24 * 60 * 60 * 1000;
          this.isAuthenticated = !isExpired && parsed.isAuthenticated;
          console.log('Sofya: Auth status:', this.isAuthenticated, 'User:', parsed.email);
        } else {
          console.log('Sofya: No auth data found');
          this.isAuthenticated = false;
        }
      } catch (error) {
        console.error('Sofya: Error checking auth status:', error);
        this.isAuthenticated = false;
      }
    }

    init() {
      console.log('Sofya: Initializing modal...');
      this.createModalRoot();
      this.createShadowDOM();
      this.render();
      this.attachEventListeners();
      console.log('Sofya: Modal initialized successfully');
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
      
      const style = document.createElement('style');
      style.textContent = `
        :host {
          all: initial;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }
        
        .sofya-button {
          background: #E8F0FC;
          color: white;
          border: none;
          border-radius: 32px;
          padding: 0;
          width: 37px;
          height: 37px;
          cursor: pointer;
          box-shadow: 0px 4px 12px rgba(107, 134, 214, 0.3);
          transition: all 0.2s ease;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .sofya-button:hover {
          background: #365FD7;
          transform: translateY(-2px);
          box-shadow: 0px 6px 16px rgba(107, 134, 214, 0.4);
        }
        
        .sofya-button:active {
          transform: translateY(0);
          box-shadow: 0px 2px 8px rgba(107, 134, 214, 0.3);
        }
        
        .sofya-recorder {
          background: #FFFFFF;
          border: none;
          border-radius: 20px;
          padding: 10px 15px;
          width: 415px;
          height: 96px;
          box-shadow: 0px 5px 15px rgba(54, 95, 215, 0.15);
          display: flex;
          align-items: center;
          font-family: inherit;
          position: relative;
        }
        
        .waveform-container {
          flex: 1;
          height: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-right: 20px;
        }
        
        .waveform-line {
          width: 2.5px;
          background: #9CB1F0;
          border-radius: 1px;
          transition: height 0.1s ease;
        }
        
        .controls-container {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .control-button {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-family: inherit;
        }
        
        .control-text {
          font-size: 16px;
          font-weight: 400;
          color: rgba(75, 85, 118, 0.75);
        }
        
        .pause-icon {
          width: 13px;
          height: 15px;
          display: flex;
          gap: 3px;
        }
        
        .pause-bar {
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
        
        .stop-section {
          background: #E3EAFF;
          border-radius: 0px 20px 20px 0px;
          padding: 10px 1px;
          height: 76px;
          min-width: 77px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          position: absolute;
          right: 0;
          top: 10px;
        }
        
        .stop-icon {
          width: 18.7px;
          height: 18.7px;
          fill: #4B5576;
        }
        
        .stop-text {
          font-size: 16px;
          font-weight: 400;
          color: #4B5576;
          text-align: center;
        }
      `;
      this.shadowRoot.appendChild(style);
    }

    render() {
      const button = document.createElement('button');
      button.className = 'sofya-button';
      
      // Create the Sofya logo SVG directly
      const logoSvg = document.createElement('div');
      logoSvg.innerHTML = `
        <svg width="21" height="25" viewBox="0 0 21 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.75507 24.3648C7.95956 24.6814 6.24133 23.4785 5.9248 21.6834C5.60826 19.8882 6.81146 18.1702 8.60696 17.8537C10.7392 17.4777 12.168 15.4368 11.792 13.3043C11.4755 11.5091 12.6784 9.79118 14.4736 9.47465C16.2691 9.15806 17.9873 10.3609 18.3038 12.1561C18.6204 13.9515 17.4173 15.6698 15.6218 15.9864C13.4895 16.3624 12.0607 18.4029 12.4366 20.5352C12.7532 22.3303 11.5502 24.0482 9.75507 24.3648Z" fill="#B55CAF"/>
          <path d="M2.77033 14.9274C1.48113 13.6382 1.48096 11.5408 2.7699 10.2518C4.05883 8.96292 6.15629 8.96309 7.44549 10.2523C8.97648 11.7832 11.4678 11.7831 12.999 10.2518C14.288 8.96292 16.3853 8.96292 17.6742 10.2518C18.9634 11.541 18.9636 13.6384 17.6746 14.9274C16.3855 16.2165 14.2878 16.2165 12.9986 14.9274C11.4676 13.3964 8.97648 13.3964 7.44549 14.9274C6.15655 16.2163 4.05927 16.2163 2.77033 14.9274Z" fill="#35D3C7"/>
          <path d="M5.79437 15.5254C3.99887 15.842 2.28064 14.6391 1.9641 12.844C1.64757 11.0489 2.85077 9.33089 4.64627 9.0143C6.77853 8.63833 8.20734 6.59749 7.8313 4.4649C7.51477 2.66979 8.71772 0.951822 10.5129 0.635295C12.3084 0.318702 14.0266 1.52159 14.3431 3.31671C14.6597 5.11213 13.4566 6.83044 11.6611 7.14703C9.52882 7.523 8.09996 9.56359 8.47593 11.6958C8.79247 13.4909 7.58951 15.2089 5.79437 15.5254Z" fill="#365FD7"/>
          <path d="M1.85556 13.0266C1.77805 12.587 1.79175 12.1518 1.88296 11.7408C2.01693 11.1562 2.31115 10.6012 2.76564 10.1467C4.0546 8.85774 6.15198 8.85806 7.44127 10.1473C7.71009 10.4161 8.00854 10.6378 8.32619 10.8122C8.29185 11.1599 8.3038 11.5179 8.36738 11.8786C8.68414 13.6735 7.48115 15.3914 5.68583 15.7081C5.49253 15.7422 5.30012 15.7586 5.11026 15.7586C3.53675 15.7586 2.13822 14.6283 1.85556 13.0266Z" fill="#0B4796"/>
          <path d="M12.9951 14.8223C12.7263 14.5535 12.428 14.332 12.1104 14.1576C12.1449 13.8094 12.133 13.4511 12.0693 13.09C11.7529 11.2951 12.9559 9.57725 14.7509 9.26049C16.5465 8.94405 18.2647 10.147 18.5811 11.942C18.6567 12.37 18.6458 12.7937 18.5611 13.195C18.4308 13.7918 18.1341 14.3592 17.6711 14.8223C17.0264 15.4669 16.1797 15.7892 15.333 15.7892C14.4863 15.7892 13.6396 15.4669 12.9951 14.8223Z" fill="#0B4796"/>
        </svg>
      `;
      
      button.appendChild(logoSvg.firstElementChild);
      
      this.shadowRoot.appendChild(button);
      this.button = button;
    }

    attachEventListeners() {
      this.button.addEventListener('click', () => {
        this.handleStartRecording();
      });
    }

    handleStartRecording() {
      // Simple alert for now - just a dumb button
      alert('Recording started! (This is a placeholder)');
      console.log('Sofya: Recording started');
    }

    // Public method to update auth status
    updateAuthStatus(isAuthenticated) {
      console.log('Sofya: updateAuthStatus called - isAuthenticated:', isAuthenticated);
      const wasAuthenticated = this.isAuthenticated;
      this.isAuthenticated = isAuthenticated;
      
      if (isAuthenticated && !wasAuthenticated) {
        // User just logged in, show modal
        console.log('Sofya: User logged in, showing modal...');
        if (!this.modalRoot) {
          this.init();
        }
      } else if (!isAuthenticated && wasAuthenticated) {
        // User logged out, hide modal
        console.log('Sofya: User logged out, hiding modal...');
        if (this.modalRoot) {
          this.modalRoot.remove();
          this.modalRoot = null;
          this.shadowRoot = null;
        }
      }
    }
  }

  // Initialize modal
  window.sofyaModal = new SimpleSofyaModal();
  
  // Listen for messages from the extension
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Sofya: Message received:', message);
    if (message.type === 'SOFYA_AUTH_STATUS') {
      window.sofyaModal.updateAuthStatus(message.isAuthenticated);
    }
  });
  
  console.log('Sofya: Content script loaded');
}