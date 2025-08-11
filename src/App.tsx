import { useEffect, useState } from "react";
import { SofyaTranscriber } from "sofya.transcription";
import "./App.css";

// Declaração simples para o objeto chrome da API de extensões
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const chrome: any;

function App() {
  const [transcript, setTranscript] = useState("");

  const transcriber = new SofyaTranscriber({
    apiKey: "kRx7FgVM11HdZqp63sNtY56UwCcXvlzrLm8bJeF",
    config: {
      language: "pt-BR",
    },
  });

  const startTranscription = () => {
    chrome.windows.create({
      url: chrome.runtime.getURL("transcriber.html"),
      type: "popup",
      focused: false,
      width: 300,
      height: 200,
    });
    transcriber.on("ready", () => {
      // Get media stream
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((mediaStream) => {
          // Start transcription
          transcriber.startTranscription(mediaStream);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    });
  };

  const pauseTranscription = () => {
    transcriber.stopTranscription();
  };

  const resumeTranscription = () => {
    transcriber.resumeTranscription();
  };

  const stopTranscription = async () => {
    await transcriber.stopTranscription();
  };

  useEffect(() => {
    const handler = (message: { type: string; text: string }) => {
      if (message.type === "transcription") {
        setTranscript(message.text);
      }
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Transcrição em Tempo Real</h1>
        <button onClick={startTranscription}>Transcrever áudio</button>
        <button onClick={pauseTranscription}>Pausar</button>
        <button onClick={resumeTranscription}>Resumir</button>
        <button onClick={stopTranscription}>Parar</button>
        <p className="transcript">{transcript}</p>
      </header>
    </div>
  );
}

export default App;
