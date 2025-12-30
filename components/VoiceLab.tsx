
import React, { useState, useEffect, useRef } from 'react';
import { getGeminiChat } from '../services/aiService';

const VoiceLab: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<{ user: string; ai: string }[]>([]);
  const [status, setStatus] = useState<string>('Ready for a dialogue.');

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const chatInstance = useRef<any>(null);

  useEffect(() => {
    chatInstance.current = getGeminiChat();
    
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          processUserVoice(text);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('STT Error:', event.error);
        setIsListening(false);
        setStatus(`Error: ${event.error}. Please try again.`);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setStatus("Your browser does not support Speech Recognition.");
    }
  }, []);

  const speakResponse = (text: string) => {
    // 停止之前的朗读
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    
    // 尝试寻找高质量的英国男声（符合教授形象）
    const targetVoice = voices.find(v => v.lang.includes('en-GB') && (v.name.includes('Male') || v.name.includes('Google'))) ||
                      voices.find(v => v.lang.startsWith('en')) ||
                      voices[0];
    
    if (targetVoice) utterance.voice = targetVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onstart = () => setStatus('Professor Gong is speaking...');
    utterance.onend = () => setStatus('Conversation active.');
    
    synthRef.current.speak(utterance);
  };

  const processUserVoice = async (text: string) => {
    setIsProcessing(true);
    setStatus('Analyzing your utterance...');
    
    try {
      if (!chatInstance.current) chatInstance.current = getGeminiChat();
      
      const result = await chatInstance.current.sendMessage({ message: text });
      const aiResponse = result.text || "I'm sorry, I couldn't process that.";
      
      setTranscript(prev => [...prev, { user: text, ai: aiResponse }]);
      speakResponse(aiResponse);
    } catch (error) {
      console.error("Voice Chat Error:", error);
      setStatus('Communication failure. Please check your API key.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setStatus('Listening...');
      } catch (e) {
        console.error("Mic access failed", e);
        setStatus("Could not access microphone.");
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 md:p-8">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold serif mb-3 text-slate-800">Voice Laboratory</h2>
        <p className="text-slate-500 italic leading-relaxed">"Speak clearly, and let us refine your eloquence together."</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 mb-8 px-2">
        {transcript.length === 0 && !isListening && !isProcessing && (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="font-medium text-slate-400">Tap the microphone to begin.</p>
          </div>
        )}
        
        {transcript.map((t, i) => (
          <div key={i} className="space-y-4 animate-in slide-in-from-bottom-3 duration-500">
            <div className="flex justify-end">
              <span className="bg-indigo-600 text-white px-5 py-3 rounded-2xl rounded-tr-none text-sm shadow-md max-w-[85%]">{t.user}</span>
            </div>
            <div className="flex justify-start">
              <span className="bg-white border border-slate-200 text-slate-800 px-5 py-4 rounded-2xl rounded-tl-none text-sm shadow-sm leading-relaxed max-w-[85%] whitespace-pre-wrap">{t.ai}</span>
            </div>
          </div>
        ))}

        {(isListening || isProcessing) && (
          <div className="flex flex-col items-center space-y-4 py-6">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{status}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center p-10 bg-white border border-slate-100 rounded-[3rem] shadow-2xl">
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`group relative flex items-center justify-center w-24 h-24 rounded-full text-white shadow-2xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50 ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-900 hover:bg-slate-800'
          }`}
        >
          {isListening && <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>}
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isListening ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" : "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"} />
          </svg>
        </button>
        <p className="mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
          {isListening ? 'Stop recording' : 'Start speaking'}
        </p>
      </div>
    </div>
  );
};

export default VoiceLab;
