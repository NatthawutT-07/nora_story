import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

/**
 * Hook to manage confetti effects
 * @param {string[]} colors - Array of confetti colors
 * @param {number} cooldown - Milliseconds between allowed triggers
 */
export const useConfetti = (colors = ['#f43f5e', '#ec4899', '#f97316', '#fbbf24'], cooldown = 3500) => {
    const [canTrigger, setCanTrigger] = useState(true);

    const triggerConfetti = useCallback(() => {
        if (!canTrigger) return;

        setCanTrigger(false);
        setTimeout(() => setCanTrigger(true), cooldown);

        // Heart shape path
        const heart = confetti.shapeFromPath({
            path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
        });

        const duration = 4 * 1000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 4 * (timeLeft / duration);

            confetti({
                particleCount,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.6 },
                colors,
                shapes: [heart, 'circle'],
                scalar: 1.2,
                zIndex: 99999
            });
            confetti({
                particleCount,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.6 },
                colors,
                shapes: [heart, 'circle'],
                scalar: 1.2,
                zIndex: 99999
            });
        }, 200);
    }, [canTrigger, colors, cooldown]);

    return {
        triggerConfetti,
        canTrigger
    };
};
