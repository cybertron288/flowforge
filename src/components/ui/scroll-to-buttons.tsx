// components/ScrollArrows.tsx
'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function ScrollArrows() {
    const [showTopButton, setShowTopButton] = useState(false);
    const [showBottomButton, setShowBottomButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.body.scrollHeight;

            setShowTopButton(scrollPosition > 100);
            setShowBottomButton(scrollPosition + windowHeight < documentHeight - 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    return (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2">
            {showTopButton && (
                <button
                    onClick={scrollToTop}
                    className="p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={20} />
                </button>
            )}
            {showBottomButton && (
                <button
                    onClick={scrollToBottom}
                    className="p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition"
                    aria-label="Scroll to bottom"
                >
                    <ArrowDown size={20} />
                </button>
            )}
        </div>
    );
}
