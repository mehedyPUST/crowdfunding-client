import confetti from 'canvas-confetti';

export const fireConfetti = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#f97316', '#10b981', '#14b8a6', '#ffffff'],
    });
};

export const fireEmojiConfetti = () => {
    const scalar = 2;
    const coin = confetti.shapeFromText({ text: '🪙', scalar });
    const heart = confetti.shapeFromText({ text: '❤️', scalar });
    const star = confetti.shapeFromText({ text: '⭐', scalar });

    confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.5 },
        shapes: [coin, heart, star],
        scalar,
    });
};

export const fireCelebrationConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#f59e0b', '#f97316', '#10b981'],
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#f59e0b', '#f97316', '#10b981'],
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };
    frame();
};

// Gentle welcome confetti
export const fireWelcomeConfetti = () => {
    const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        colors: ['#f59e0b', '#f97316', '#10b981', '#14b8a6', '#8b5cf6'],
        origin: { y: 0.5 }
    };

    confetti({ ...defaults, particleCount: 40, shapes: ['circle'] });
    setTimeout(() => {
        confetti({ ...defaults, particleCount: 40, shapes: ['circle'] });
    }, 200);
};