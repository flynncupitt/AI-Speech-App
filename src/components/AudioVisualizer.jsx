import React, { useRef, useEffect } from 'react';

export default function AudioVisualizer({ audioFile }) {
    const canvasRef = useRef(null);
    const audioRef = useRef(null);

    // Scaling factor for the canvas size
    const scaleFactor = 0.5;  // Adjust this value to control the overall scaling

    useEffect(() => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const audioElement = new Audio(audioFile);
        audioRef.current = audioElement;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

        const source = audioCtx.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');

        function drawVisualizer() {
            requestAnimationFrame(drawVisualizer);
            analyser.getByteFrequencyData(dataArray);

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = ((canvas.width / bufferLength) * 2.5) * scaleFactor;
            const barSpacing = 1 * scaleFactor;  // Adjust spacing
            const centerX = (canvas.width/ 2)  // Adjust center X
            const centerY = (canvas.height/ 2)  // Adjust center Y
            const smoothFactor = 10;
            const shiftAmount = 0;

            // Draw horizontal middle line
            canvasCtx.beginPath();
            canvasCtx.moveTo(0, centerY);  // Start from the left edge
            canvasCtx.lineTo(canvas.width, centerY);  // Draw to the right edge
            canvasCtx.strokeStyle = '#8E30F2';  // Line color
            canvasCtx.lineWidth = 1;  // Line thickness
            canvasCtx.stroke();  // Draw the line

            // Draw original waveform (top side)
            canvasCtx.beginPath();
            canvasCtx.moveTo(centerX - 10 * scaleFactor, centerY);

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 2) * scaleFactor;  // Adjust bar height
                const x = centerX + (i * barWidth) + barSpacing;
                const y = centerY - barHeight;

                if (i === 0) {
                    canvasCtx.lineTo(x, y);
                } else {
                    const prevX = centerX + ((i - 1) * barWidth) + barSpacing;
                    const prevY = centerY - (dataArray[i - 1] / 2) * scaleFactor;

                    const controlX1 = prevX + (x - prevX) / smoothFactor;
                    const controlY1 = prevY;
                    const controlX2 = x - (x - prevX) / smoothFactor;
                    const controlY2 = y;

                    canvasCtx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, x, y);
                }
            }

            // Complete the top side by connecting back to center
            canvasCtx.lineTo(centerX + barWidth * bufferLength, centerY);
            canvasCtx.lineTo(centerX, centerY);
            canvasCtx.closePath();
            canvasCtx.fillStyle = '#8E30F2';
            canvasCtx.fill();

            // Draw vertically mirrored waveform (left side)
            canvasCtx.beginPath();
            canvasCtx.moveTo(centerX + 10 * scaleFactor, centerY);

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 2) * scaleFactor;
                const x = centerX - (i * barWidth) - barSpacing;
                const y = centerY - barHeight;

                if (i === 0) {
                    canvasCtx.lineTo(x, y);
                } else {
                    const prevX = centerX - ((i - 1) * barWidth) - barSpacing;
                    const prevY = centerY - (dataArray[i - 1] / 2) * scaleFactor;

                    const controlX1 = prevX + (x - prevX) / smoothFactor;
                    const controlY1 = prevY;
                    const controlX2 = x - (x - prevX) / smoothFactor;
                    const controlY2 = y;

                    canvasCtx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, x, y);
                }
            }

            // Complete the left side by connecting back to center
            canvasCtx.lineTo(centerX - barWidth * bufferLength, centerY);
            canvasCtx.lineTo(centerX, centerY);
            canvasCtx.closePath();
            canvasCtx.fillStyle = '#8E30F2';
            canvasCtx.fill();

            // Draw horizontally mirrored waveform (bottom side)
            canvasCtx.beginPath();
            canvasCtx.moveTo(centerX - 10 * scaleFactor, centerY);

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 2) * scaleFactor;
                const x = centerX + (i * barWidth) + barSpacing;
                const y = centerY + barHeight;

                if (i === 0) {
                    canvasCtx.lineTo(x, y);
                } else {
                    const prevX = centerX + ((i - 1) * barWidth) + barSpacing;
                    const prevY = centerY + (dataArray[i - 1] / 2) * scaleFactor;

                    const controlX1 = prevX + (x - prevX) / smoothFactor;
                    const controlY1 = prevY;
                    const controlX2 = x - (x - prevX) / smoothFactor;
                    const controlY2 = y;

                    canvasCtx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, x, y);
                }
            }

            // Complete the bottom side by connecting back to center
            canvasCtx.lineTo(centerX + barWidth * bufferLength, centerY);
            canvasCtx.lineTo(centerX, centerY);
            canvasCtx.closePath();
            canvasCtx.fillStyle = '#8E30F2';
            canvasCtx.fill();

            // Draw horizontally and vertically mirrored waveform (right side)
            canvasCtx.beginPath();
            canvasCtx.moveTo(centerX + 10 * scaleFactor, centerY);

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 2) * scaleFactor;
                const x = centerX - (i * barWidth) - barSpacing;
                const y = centerY + barHeight;

                if (i === 0) {
                    canvasCtx.lineTo(x, y);
                } else {
                    const prevX = centerX - ((i - 1) * barWidth) - barSpacing;
                    const prevY = centerY + (dataArray[i - 1] / 2) * scaleFactor;

                    const controlX1 = prevX + (x - prevX) / smoothFactor;
                    const controlY1 = prevY;
                    const controlX2 = x - (x - prevX) / smoothFactor;
                    const controlY2 = y;

                    canvasCtx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, x, y);
                }
            }

            // Complete the right side by connecting back to center
            canvasCtx.lineTo(centerX - barWidth * bufferLength, centerY);
            canvasCtx.lineTo(centerX, centerY);
            canvasCtx.closePath();
            canvasCtx.fillStyle = '#8E30F2';
            canvasCtx.fill();
        }

        drawVisualizer();

        setTimeout(() => {
            audioElement.play();
        }, 2000);

        return () => {
            audioCtx.close();
        };
    }, [audioFile, scaleFactor]);

    return (
        <div className="AudioVisualizer">
            {/* Apply scaling factor to the canvas dimensions */}
            <canvas 
                ref={canvasRef} 
                width={155}  // Scaled width
                height={155}  // Scaled height
            ></canvas>
        </div>
    );
}
