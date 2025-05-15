import { useRef, useEffect, useState, useCallback } from "react";
import "./FullscreenCanvas.css";

interface FullscreenCanvasProps {
    draw: (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        deltaTime: number,
        totalTime: number
    ) => void;
    loop?: boolean;
}

export function FullscreenCanvas({
    draw,
    loop = false,
}: FullscreenCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const rafRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const totalTimeRef = useRef<number>(0);

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;
    };

    const renderFrame = useCallback(
        (time: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            if (lastTimeRef.current === 0) {
                lastTimeRef.current = time;
            }
            const deltaTime = (time - lastTimeRef.current) / 1000;
            lastTimeRef.current = time;
            totalTimeRef.current += deltaTime;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            draw(
                ctx,
                canvas.width,
                canvas.height,
                deltaTime,
                totalTimeRef.current
            );

            if (loop) {
                rafRef.current = requestAnimationFrame(renderFrame);
            }
        },
        [draw, loop]
    );

    useEffect(() => {
        setIsTouchDevice(
            "ontouchstart" in window || navigator.maxTouchPoints > 0
        );
        setShowButton(document.fullscreenElement == null);

        resizeCanvas();
        lastTimeRef.current = 0;
        totalTimeRef.current = 0;
        rafRef.current = requestAnimationFrame(renderFrame);

        const handleResize = () => {
            resizeCanvas();
        };

        const handleFullscreenChange = () => {
            setShowButton(document.fullscreenElement == null);
        };

        window.addEventListener("resize", handleResize, { passive: true });
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [draw, loop, renderFrame]);

    const enterFullscreen = () => {
        const container = canvasRef.current?.parentElement;
        if (!container) return;

        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if ("webkitRequestFullscreen" in container) {
            (
                container as HTMLElement & {
                    webkitRequestFullscreen: () => void;
                }
            ).webkitRequestFullscreen();
        }
    };

    return (
        <div className="canvas-container">
            {isTouchDevice && showButton && (
                <button className="fullscreen-button" onClick={enterFullscreen}>
                    Enter Fullscreen
                </button>
            )}
            <canvas ref={canvasRef} />
        </div>
    );
}
