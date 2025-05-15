import "./App.css";
import { FullscreenCanvas } from "./FullscreenCanvas";

function draw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    _deltaTime: number,
    totalTime: number
) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    const starCount = 16;
    const baseSize = Math.min(width, height) * 0.04;
    const orbitSpeed = 0.5;
    const rotationSpeed = 4;
    const colorCycleSpeed = 0.5;

    const globalHueShift = (totalTime * colorCycleSpeed * 360) % 360;
    const pulseSpeed = 0.5;

    for (let i = 0; i < starCount; i++) {
        const angle = (i / starCount) * Math.PI * 2 + totalTime * orbitSpeed;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        const positionHue = (i / starCount) * 360;
        const pulseHue = (totalTime * pulseSpeed * 360) % 360;
        const combinedHue = (positionHue + pulseHue + globalHueShift) % 360;

        const pulseFactor =
            0.5 + 0.5 * Math.sin(totalTime * pulseSpeed * Math.PI * 2);
        const starSize = baseSize * (0.8 + pulseFactor * 0.4);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(totalTime * rotationSpeed + angle);

        ctx.fillStyle = `hsl(${combinedHue}, 100%, ${50 + pulseFactor * 20}%)`;
        drawStar(ctx, 0, 0, starSize * 0.4, starSize, 5);

        ctx.restore();
    }
}

function drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
    points: number
) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / points;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < points; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function App() {
    return <FullscreenCanvas draw={draw} loop={true} />;
}

export default App;
