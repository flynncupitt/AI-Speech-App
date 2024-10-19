import React, { useRef } from 'react';

interface ShareResultsProps {
  username: string;
  filename: string;
  mumbledWords: number;
  fillerWords: number;
  stats: number;
  wordsPerMinute: number;
}

const ShareResults: React.FC<ShareResultsProps> = ({
  username,
  filename,
  mumbledWords,
  fillerWords,
  stats,
  wordsPerMinute,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const downloadImage = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'canvas-image.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  };

  const drawCanvas = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // Fill background color (dark gray)
    ctx.fillStyle = '#1f1f1f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Username
    ctx.fillStyle = '#D5D5D5';
    ctx.font = 'bold 70px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${username}'s Results`, width / 2, 360);

    //File Name
    ctx.fillStyle = '#8E30F2';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${filename}`, width / 2, 400);

    // Set "Mumbled Words" text
    ctx.fillStyle = '#F23030';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText(`${mumbledWords}`, width / 2 - 150, 550);
    ctx.font = '30px sans-serif';
    ctx.fillText('Mumbled Words', width / 2 - 150, 590);

    // Set "Filler Words" text
    ctx.fillStyle = '#F2AE30';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText(`${fillerWords}`, width / 2 + 150, 550);
    ctx.font = '30px sans-serif';
    ctx.fillText('Filler Words', width / 2 + 150, 590);

    // Set "Stats" text
    ctx.fillStyle = '#D5D5D5';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText(`${stats}`, width / 2 - 150, 740);
    ctx.font = '30px sans-serif';
    ctx.fillText('Stats', width / 2 - 150, 780);

    // Set "Words Per Minute" text
    ctx.fillStyle = '#50F230';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText(`${wordsPerMinute}`, width / 2 + 150, 740);
    ctx.font = '30px sans-serif';
    ctx.fillText('Words Per Minute', width / 2 + 150, 780);
  };

  React.useEffect(() => {
    drawCanvas();
  }, [mumbledWords, fillerWords, stats, wordsPerMinute]);

  return (
    <div className="inline-block items-center pl-3">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button
        onClick={downloadImage}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Share
      </button>
    </div>
  );
};

export default ShareResults;
