import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Voice navigation hook using the Web Speech API.
 * Supported commands: "home", "bill", "complaint", "service", "status", "back"
 */
export function useVoiceNav() {
    const navigate = useNavigate();
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();

            if (transcript.includes('home') || transcript.includes('dashboard')) navigate('/dashboard');
            else if (transcript.includes('bill') || transcript.includes('payment')) navigate('/bill-payment');
            else if (transcript.includes('complaint')) navigate('/complaint');
            else if (transcript.includes('service')) navigate('/service-request');
            else if (transcript.includes('status') || transcript.includes('track')) navigate('/status');
            else if (transcript.includes('back')) navigate(-1);
        };

        recognition.start();
        recognitionRef.current = recognition;

        return () => recognition.stop();
    }, [navigate]);
}
