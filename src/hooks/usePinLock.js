import { useState, useEffect } from 'react';

/**
 * Hook to manage PIN lock state and validation
 * @param {string} correctPin - The expected PIN code
 * @param {boolean} initiallyLocked - Whether to start in LOCKED state
 */
export const usePinLock = (correctPin, initiallyLocked = true) => {
    const [viewState, setViewState] = useState(correctPin && initiallyLocked ? 'LOCKED' : 'CONTENT');
    const [pinInput, setPinInput] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (pinInput.length === 4) {
            if (pinInput === correctPin) {
                handleUnlock();
            } else {
                handleError();
            }
        }
    }, [pinInput, correctPin]);

    const handleUnlock = () => {
        setViewState('CONTENT');
        // We return true so the component can trigger effects (like confetti)
        return true;
    };

    const handleError = () => {
        setShowError(true);
        setTimeout(() => {
            setPinInput("");
            setShowError(false);
        }, 500);
    };

    const handleKeyPress = (num) => {
        if (pinInput.length < 4) {
            setPinInput(prev => prev + num);
        }
    };

    const handleBackspace = () => {
        setPinInput(prev => prev.slice(0, -1));
    };

    return {
        viewState,
        setViewState,
        pinInput,
        showError,
        handleKeyPress,
        handleBackspace,
        isLocked: viewState === 'LOCKED'
    };
};
