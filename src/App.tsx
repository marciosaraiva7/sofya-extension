import { useEffect, useState } from 'react';
import './App.css';

// Declaração simples para o objeto chrome da API de extensões
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const chrome: any;

function App() {
  const [transcript, setTranscript] = useState('');

  const startTranscription = () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('transcriber.html'),
      type: 'popup',
      focused: false,
      width: 300,
      height: 200,
    });
  };

  useEffect(() => {
    const handler = (message: { type: string; text: string }) => {
      if (message.type === 'transcription') {
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
        <p className="transcript">{transcript}</p>
      </header>
    </div>
  );
}

export default App;
