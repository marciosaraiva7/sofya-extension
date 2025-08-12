import { ChromeExtensionTranscriber } from "sofya.transcription.extension.chrome";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const chrome: any;

const transcriber = new ChromeExtensionTranscriber({
  apiKey: "kRx7FgVM11HdZqp63sNtY56UwCcXvlzrLm8bJeF",
  language: "pt-BR",
  onTranscription: (text: string) => {
    chrome.runtime.sendMessage({ type: "transcription", text });
  },
  onError: (error: unknown) => {
    console.error("Transcription error:", error);
  },
});

transcriber.start();
