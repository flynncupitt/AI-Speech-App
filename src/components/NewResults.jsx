import React, { useRef, useState, useEffect } from 'react';
import './NewResults.css';
import tyler from '../assets/Tyler, The Creator - ARE WE STILL FRIENDS_ (Lyrics).mp3';
import hellnah from '../assets/He-HELL NAH.mp3'
import WaveSurferPlayer from './WaveSurferPlayer.jsx';
import AudioVisualizer from './AudioVisualizer.jsx';

export default function NewResults() {
    const record = { recording: '1', mumbled: 3, filler: 2, stat: 0, wpm: 0 };
    const message = "Well Done!";
    const waveSurferRef = useRef(null); // Reference to the WaveSurferPlayer component
    const [isPlaying, setIsPlaying] = useState(false); // To toggle the play/pause icon
    const [progress, setProgress] = useState(0); // Track the current progress for the purple circle
    const [duration, setDuration] = useState(0); // Track the duration of the audio

    // Define shapes with position, duration, and type
    const shapes = [
        { position: 10, duration: 10, type: 'mumbled' },   // Mumbled word starting at 10 seconds, lasting 5 seconds
        { position: 30, duration: 5, type: 'filler' },    // Filler word starting at 30 seconds, lasting 3 seconds
        { position: 50, duration: 7, type: 'mumbled' },   // Mumbled word starting at 50 seconds, lasting 4 seconds
        { position: 120, duration: 3, type: 'filler' },    // Filler word starting at 70 seconds, lasting 2 seconds
        { position: 240, duration: 4, type: 'mumbled' },   // Mumbled word starting at 90 seconds, lasting 3 seconds
    ]; 

    // Define colors based on type
    const getShapeColor = (type) => {
        switch (type) {
            case 'mumbled':
                return '#F23030';
            case 'filler':
                return '#F2AE30';
            default:
                return '#414141'; // Default color if type is unknown
        }
    };

    const handlePlayPause = () => {
        if (waveSurferRef.current) {
            waveSurferRef.current.playPause(); // Trigger playPause from the WaveSurferPlayer component
            setIsPlaying(!isPlaying); // Toggle play/pause state
        }
    };

    useEffect(() => {
        if (waveSurferRef.current) {
            // Get duration from WaveSurfer when the audio file is loaded
            const wavesurfer = waveSurferRef.current.getInstance();
            wavesurfer.on('ready', () => {
                setDuration(wavesurfer.getDuration());
            });
        }
    }, []);

    useEffect(() => {
        console.log(`Progress updated: ${progress}`);
    }, [progress]);

    return (
        <div className="NewResult">
            <AudioVisualizer audioFile={hellnah}/>
            <div className="Results">
                <h1>{message}</h1>
                <div className="Stats">
                    <div className="Mumbled">
                        <h2>{record.mumbled}</h2>
                        <h3>Mumbled Words</h3>
                    </div>
                    <div className="Filler">
                        <h2>{record.filler}</h2>
                        <h3>Filler <br />Words</h3>
                    </div>
                    <div className="statsus">
                        <h2>{record.stat}</h2>
                        <h3>Stats</h3>
                    </div>
                    <div className="WPM">
                        <h2>{record.wpm}</h2>
                        <h3>Words Per Minute</h3>
                    </div>
                </div>
            </div>
            {/* WaveSurfer Player */}
            <div style={{ maxWidth: '360px', margin: 'auto'}}>
                <WaveSurferPlayer
                    ref={waveSurferRef}
                    audioFile={tyler}
                    onProgress={setProgress} // Handle progress updates
                />
            </div>

            <div className="Bar">
                <div className="progress-bar">
                    {shapes.map((shape, index) => {
                        // Calculate position and width (duration) as percentages based on total duration
                        const leftPosition = (shape.position / duration) * 100;
                        const shapeWidth = (shape.duration / duration) * 100;

                        return (
                            <div
                                key={index}
                                className="shape"
                                style={{
                                    height: '4px',
                                    left: `${leftPosition}%`,
                                    width: `${shapeWidth}%`,
                                    backgroundColor: getShapeColor(shape.type),
                                }}
                            ></div>
                        );
                    })}
                    <div
                        className="progress-circle"
                        style={{
                            margin: 'auto',
                            top: '-4px',
                            left: `${(progress * 100)}% `, // Set position based on progress (0-1 scale)
                            transition: 'left 0.5s linear', // Smooth transition for smoother movement
                        }}
                    ></div>
                </div>
            </div>

            <div className="Test">
                <div className="buttonlist">
                    <button onClick={handlePlayPause} className="play-pause-btn">
                        <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
