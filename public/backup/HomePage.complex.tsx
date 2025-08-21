import { useMockedAuth } from "../contexts/MockedAuthContext";

export const HomePage = () => {
  const { user, logout } = useMockedAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleStartTranscription = async () => {
    try {
      // Get the current active tab
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const activeTab = tabs[0];

      if (!activeTab?.id) {
        console.error("No active tab found");
        return;
      }

      // Check if the tab is a valid web page (not chrome://, chrome-extension://, etc.)
      if (
        !activeTab.url ||
        activeTab.url.startsWith("chrome://") ||
        activeTab.url.startsWith("chrome-extension://") ||
        activeTab.url.startsWith("edge://") ||
        activeTab.url.startsWith("about:")
      ) {
        alert(
          "A transcrição não funciona nesta página. Navegue para um site web para usar a extensão."
        );
        return;
      }

      try {
        // Try to send message to existing content script
        await chrome.tabs.sendMessage(activeTab.id, {
          type: "SOFYA_SHOW_MODAL",
        });

        // Close the extension popup
        window.close();
      } catch {
        // Content script not loaded, inject it manually
        console.log("Content script not found, injecting...");

        try {
          await chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            files: ["content.js"],
          });

          // Wait a bit for the script to load, then try again
          setTimeout(async () => {
            try {
              await chrome.tabs.sendMessage(activeTab.id!, {
                type: "SOFYA_SHOW_MODAL",
              });
              window.close();
            } catch (retryError) {
              console.error(
                "Failed to show modal after script injection:",
                retryError
              );
              alert(
                "Erro ao iniciar transcrição. Recarregue a página e tente novamente."
              );
            }
          }, 500);
        } catch (injectionError) {
          console.error("Failed to inject content script:", injectionError);
          alert(
            "Erro ao iniciar transcrição. Recarregue a página e tente novamente."
          );
        }
      }
    } catch (error) {
      console.error("Error starting transcription:", error);
      alert("Erro ao iniciar transcrição. Tente novamente.");
    }
  };

  return (
    <div className="w-[401px] h-[600px] bg-white flex flex-col p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#365FD7] rounded-lg flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#08194D]">Sofya</h1>
            <p className="text-xs text-[#303A5A] truncate max-w-[180px]">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-[#6B86D6] hover:text-[#365FD7] transition-colors"
        >
          Sair
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#6B86D6]"
          >
            <path
              d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M19 10v2a7 7 0 0 1-14 0v-2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="12"
              y1="19"
              x2="12"
              y2="23"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="8"
              y1="23"
              x2="16"
              y2="23"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-[#08194D] mb-2">
          Bem-vindo ao Sofya
        </h2>
        <p className="text-sm text-[#303A5A] mb-6 max-w-sm">
          Navegue até uma página web e use a extensão para iniciar a transcrição
          médica em tempo real.
        </p>

        {/* Status */}
        <div className="w-full p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-[#08194D]">
              Status: Conectado
            </span>
          </div>
          <p className="text-xs text-[#303A5A]">
            Extensão pronta para uso. Vá para uma página e comece a transcrever.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartTranscription}
          className="mt-6 w-full bg-[#6B86D6] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#365FD7] transition-colors"
        >
          Iniciar Transcrição
        </button>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
        <p className="text-xs text-[#303A5A]">
          © 2025 Sofya. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
