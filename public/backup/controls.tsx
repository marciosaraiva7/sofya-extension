import React from "react";
import { SofyaTranscriber } from "sofya.transcription";

export const Transcriber = () => {
  const transcriberRef = React.useRef<SofyaTranscriber | null>(null);
  const [inputText, setInputText] = React.useState("");
  const [isTranscribing, setIsTranscribing] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const lastRecognized = React.useRef("");
  const isTranscribingRef = React.useRef(false);

  const getMediaStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return stream;
  };

  const startTranscription = async () => {
    try {
      const stream = await getMediaStream();

      // Create the transcriber with API key connection
      const transcriber = new SofyaTranscriber({
        apiKey: import.meta.env.VITE_SPEECH_KEY,
        config: {
          language: "pt-BR",
        },
      });

      transcriberRef.current = transcriber;

      transcriber.on("ready", () => {
        transcriber.startTranscription(stream);
        setIsTranscribing(true);
      });

      // ------------------------------------------------------------------------
      // The 'recognizing' event provides real-time updates of the ongoing transcription.
      // We update the display text but don't save it to lastRecognized because it's still provisional.
      // This allows us to show the user what's being transcribed in real-time while keeping
      // the confirmed text separate.
      // ------------------------------------------------------------------------
      transcriber.on("recognizing", (result: string) => {
        isTranscribingRef.current = true;
        const currentText = lastRecognized.current;
        const newText = currentText ? `${currentText} ${result}` : result;
        setInputText(newText);
      });

      // ------------------------------------------------------------------------
      // The 'recognized' event provides the final, confirmed transcription.
      // We save it to lastRecognized as it's the confirmed text that new chunks will be appended to.
      // This ensures we maintain a history of all confirmed transcriptions.
      // ------------------------------------------------------------------------
      transcriber.on("recognized", (result: string) => {
        const currentText = lastRecognized.current;
        const newText = currentText ? `${currentText} ${result}` : result;
        lastRecognized.current = newText;
        setInputText(newText);
        isTranscribingRef.current = false;
      });

      transcriber.on("error", (error: Error) => {
        console.error("Transcription error:", error);
      });
    } catch (error) {
      console.error("Error starting transcription:", error);
    }
  };

  const pauseTranscription = () => {
    if (transcriberRef.current && isTranscribing && !isPaused) {
      transcriberRef.current.pauseTranscription();
      setIsPaused(true);
    }
  };

  const resumeTranscription = () => {
    if (transcriberRef.current && isTranscribing && isPaused) {
      transcriberRef.current.resumeTranscription();
      setIsPaused(false);
    }
  };

  const stopTranscription = async () => {
    if (transcriberRef.current) {
      await transcriberRef.current.stopTranscription();
      setIsTranscribing(false);
      setIsPaused(false);
    }
  };

  return (
    <div>
      <div>
        <button onClick={startTranscription} disabled={isTranscribing}>
          Start Transcription
        </button>
        <button
          onClick={pauseTranscription}
          disabled={!isTranscribing || isPaused}
        >
          Pause
        </button>
        <button
          onClick={resumeTranscription}
          disabled={!isTranscribing || !isPaused}
        >
          Resume
        </button>
        <button onClick={stopTranscription} disabled={!isTranscribing}>
          Stop Transcription
        </button>
      </div>
      <div>
        <p>
          Status:{" "}
          {isTranscribing ? (isPaused ? "Paused" : "Transcribing") : "Stopped"}
        </p>
      </div>
      <div>
        <h3>Transcription:</h3>
        <p>{inputText}</p>
      </div>
    </div>
  );
};
