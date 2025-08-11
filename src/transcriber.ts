import { SofyaTranscriber } from "sofya.transcription";

// Declaração simples para evitar erros de tipos
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const chrome: any;

const transcriber = new SofyaTranscriber({
  apiKey: "kRx7FgVM11HdZqp63sNtY56UwCcXvlzrLm8bJeF",
  config: {
    language: "pt-BR",
  },
});

transcriber.on("recognizing", (text: string) => {
  chrome.runtime.sendMessage({ type: "transcription", text });
});

transcriber.on("recognized", (text: string) => {
  chrome.runtime.sendMessage({ type: "transcription", text });
});

transcriber.on("error", (error: unknown) => {
  console.error("Transcription error:", error);
});

transcriber.on("ready", () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((mediaStream) => {
      transcriber.startTranscription(mediaStream);
    })
    .catch((error: unknown) => {
      console.error("Error accessing microphone:", error);
    });
});

