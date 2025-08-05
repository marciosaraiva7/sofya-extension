// Página de transcrição que captura áudio e envia o texto ao popup
// Declaração simples para evitar erros de tipos
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const chrome: any;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  recognition.onresult = (event: any) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    // Envia a transcrição parcial para o popup
    chrome.runtime.sendMessage({ type: 'transcription', text: transcript });
  };

  recognition.start();
}
