
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FeedbackState, FeedbackType, GameState } from './types';
import { PulsatingCircle } from './components/PulsatingCircle';
import { ProgressBar } from './components/ProgressBar';
import { FeedbackMessage } from './components/FeedbackMessage';
import { StartIcon, StopIcon, RestartIcon, HeartIcon } from './components/Icons';

// Constants
const TARGET_BPM = 110;
const BEAT_INTERVAL = 60000 / TARGET_BPM; // ~545ms
const PERFECT_THRESHOLD = 80; // ms - More human-friendly
const ACCEPTABLE_THRESHOLD = 200; // ms - More human-friendly

const PROGRESS_INCREMENT_PERFECT = 5;
const PROGRESS_INCREMENT_ACCEPTABLE = 2;
const PROGRESS_DECREMENT_POOR = 8;
const PROGRESS_DECREMENT_MISSED = 10;

// Tiny base64 encoded mp3 for a click sound
const CLICK_SOUND_B64 = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIwAAHwAAB1AAAAAATEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//OEAAAAAAAAAAAAAAAAAAAAAAAFhpbmcAAAAPAAAAEAAABIwAAHwAAB1AAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV-';

const sendScoreToStoryline = (score: number, status: string) => {
  try {
    // @ts-ignore - GetPlayer is a Storyline specific function on the parent window
    const player = window.parent.GetPlayer();
    if (player) {
      player.SetVar("PuntajeRCP", score);
      player.SetVar("EstadoRCP", status); // "Aprobado" or "Fallido"
    }
  } catch (e) {
    console.log("Modo Dev: Storyline no detectado. Datos:", { score, status });
  }
};

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.Idle);
    const [progress, setProgress] = useState(0);
    const [feedback, setFeedback] = useState<FeedbackState>({ text: 'Presiona Iniciar para comenzar', type: FeedbackType.INFO });
    const [pulse, setPulse] = useState(0);

    const nextBeatTimeRef = useRef<number>(0);
    const animationFrameIdRef = useRef<number>(0);
    const beatAudioRef = useRef<HTMLAudioElement | null>(null);

    const FEEDBACK_MAP: Record<FeedbackType, { text: string; color: string }> = {
        [FeedbackType.PERFECT]: { text: '¡RITMO PERFECTO!', color: 'text-green-400' },
        [FeedbackType.ACCEPTABLE]: { text: 'Aceptable', color: 'text-yellow-400' },
        [FeedbackType.POOR]: { text: 'Fuera de ritmo', color: 'text-red-400' },
        [FeedbackType.MISSED]: { text: 'Compresión Omitida', color: 'text-red-600' },
        [FeedbackType.INFO]: { text: 'Presiona Iniciar para comenzar', color: 'text-gray-400' },
        [FeedbackType.COMPLETE]: { text: '¡Entrenamiento Completo!', color: 'text-blue-400' },
    };

    const playBeatSound = useCallback(() => {
        if (beatAudioRef.current) {
            beatAudioRef.current.currentTime = 0;
            beatAudioRef.current.play().catch(e => console.error("Error playing sound:", e));
        }
    }, []);

    const updateProgress = (amount: number) => {
        setProgress(prev => Math.max(0, Math.min(100, prev + amount)));
    };

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (gameState !== GameState.Running || (event.key !== ' ' && event.key.toLowerCase() !== 'c')) {
            return;
        }
        event.preventDefault();

        const currentTime = performance.now();
        const timeDiff = Math.abs(currentTime - nextBeatTimeRef.current);
        
        let newFeedbackType: FeedbackType;
        if (timeDiff <= PERFECT_THRESHOLD) {
            newFeedbackType = FeedbackType.PERFECT;
            updateProgress(PROGRESS_INCREMENT_PERFECT);
            playBeatSound();
        } else if (timeDiff <= ACCEPTABLE_THRESHOLD) {
            newFeedbackType = FeedbackType.ACCEPTABLE;
            updateProgress(PROGRESS_INCREMENT_ACCEPTABLE);
            playBeatSound();
        } else {
            newFeedbackType = FeedbackType.POOR;
            updateProgress(-PROGRESS_DECREMENT_POOR);
        }

        setFeedback({ text: FEEDBACK_MAP[newFeedbackType].text, type: newFeedbackType });
        nextBeatTimeRef.current += BEAT_INTERVAL;

    }, [gameState, FEEDBACK_MAP, playBeatSound]);
    
    const gameLoop = useCallback((timestamp: number) => {
        if (gameState !== GameState.Running) return;
    
        if (timestamp > nextBeatTimeRef.current + ACCEPTABLE_THRESHOLD) {
            setFeedback({ text: FEEDBACK_MAP[FeedbackType.MISSED].text, type: FeedbackType.MISSED });
            updateProgress(-PROGRESS_DECREMENT_MISSED);
            nextBeatTimeRef.current += BEAT_INTERVAL;
        }
    
        const timeSinceLastIdealBeat = timestamp - (nextBeatTimeRef.current - BEAT_INTERVAL);
        const pulsePhase = (timeSinceLastIdealBeat % BEAT_INTERVAL) / BEAT_INTERVAL;
        const newPulse = Math.sin(pulsePhase * Math.PI * 2);
        setPulse(newPulse);
    
        animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    }, [gameState, FEEDBACK_MAP]);

    useEffect(() => {
        if (gameState === GameState.Running) {
            nextBeatTimeRef.current = performance.now() + BEAT_INTERVAL;
            animationFrameIdRef.current = requestAnimationFrame(gameLoop);
            window.addEventListener('keydown', handleKeyPress);
        } else {
            cancelAnimationFrame(animationFrameIdRef.current);
            window.removeEventListener('keydown', handleKeyPress);
        }

        return () => {
            cancelAnimationFrame(animationFrameIdRef.current);
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [gameState, gameLoop, handleKeyPress]);

    useEffect(() => {
        if (progress >= 100) {
            setGameState(GameState.Finished);
            setFeedback({ text: FEEDBACK_MAP[FeedbackType.COMPLETE].text, type: FeedbackType.COMPLETE });
            sendScoreToStoryline(100, "Aprobado");
        }
    }, [progress, FEEDBACK_MAP]);
    
    const startGame = () => {
        if (!beatAudioRef.current) {
           beatAudioRef.current = new Audio(CLICK_SOUND_B64);
        }
        
        setProgress(0);
        setFeedback({ text: 'Sigue el ritmo del círculo', type: FeedbackType.INFO });
        setGameState(GameState.Running);
    };

    const stopGame = () => {
        setGameState(GameState.Idle);
        setFeedback({ text: 'Entrenamiento detenido. Presiona Iniciar para continuar', type: FeedbackType.INFO });
    };

    const getButton = () => {
        switch (gameState) {
            case GameState.Running:
                return (
                    <button onClick={stopGame} className="flex items-center justify-center gap-2 w-48 px-6 py-3 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200">
                        <StopIcon /> Detener
                    </button>
                );
            case GameState.Finished:
                return (
                    <button onClick={startGame} className="flex items-center justify-center gap-2 w-48 px-6 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200">
                       <RestartIcon /> Reiniciar
                    </button>
                );
            case GameState.Idle:
            default:
                return (
                    <button onClick={startGame} className="flex items-center justify-center gap-2 w-48 px-6 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200">
                        <StartIcon /> Iniciar
                    </button>
                );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 font-sans">
            <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-blue-300 flex items-center gap-3">
                    <HeartIcon />
                    Entrenador de Ritmo RCP
                </h1>
                <p className="text-lg text-gray-400 mt-2">Presiona [Espacio] o [C] al ritmo del círculo</p>
            </header>
            
            <main className="flex flex-col items-center justify-center w-full max-w-2xl bg-gray-800/50 rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-700">
                <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-8">
                    <PulsatingCircle pulse={pulse} />
                </div>

                <FeedbackMessage feedback={feedback} color={FEEDBACK_MAP[feedback.type].color} />

                <div className="w-full mt-8">
                    <ProgressBar progress={progress} />
                </div>
            </main>

            <footer className="mt-10">
                {getButton()}
            </footer>
        </div>
    );
};

export default App;
