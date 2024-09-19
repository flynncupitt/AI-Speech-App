import React, { useRef, useState, useEffect } from 'react';
import './ResultsCard.css';
import hellnah from '../assets/Tyler The Creator - SIKE Sound Effect.mp3';
import WaveSurferPlayer from './WaveSurferPlayer.jsx';
import AudioVisualizer from './AudioVisualizer.jsx';

export default function ResultsCard({ audioURL }) {
    const waveSurferRef = useRef(null); 
    const [isPlaying, setIsPlaying] = useState(false); 
    const [progress, setProgress] = useState(0); 
    const [duration, setDuration] = useState(0);

    // Dummy data for record
    const record = { recording: '1', mumbled: 3, filler: 2, stat: 0, wpm: 0 }; // mumbled and filler set to 0 for demo

    // Phrases for motivational messages
    const phrases = [
      "Well Done!",
      "Great Job!",
      "Keep Going!",
      "Nice Work!",
      "Excellent!"
    ];

    // Conditionally select message based on mumbled and filler words
    const getMessage = () => {
      if (record.mumbled === 0 && record.filler === 0) {
        return "Flawless Work!";
      }
      const randomIndex = Math.floor(Math.random() * phrases.length);
      return phrases[randomIndex];
    };

    // Set the message to the conditional result
    const [message, setMessage] = useState(getMessage());

    // Example shapes data (for visualizing segments in the progress bar)
    const shapes = [
      { position: 1, duration: 0.5, type: 'mumbled' },
      { position: 6, duration: 3, type: 'mumbled' },
      { position: 10, duration: 2, type: 'filler' },
      { position: 15, duration: 2, type: 'mumbled' },
      { position: 17, duration: 2, type: 'filler' },
    ];
  
    const getShapeColor = (type) => {
      switch (type) {
        case 'mumbled':
          return '#F23030';
        case 'filler':
          return '#F2AE30';
        default:
          return '#414141';
      }
    };
  
    const handlePlayPause = () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.playPause();
        setIsPlaying(!isPlaying);
      }
    };

    useEffect(() => {
      if (waveSurferRef.current) {
        const wavesurfer = waveSurferRef.current.getInstance();
        wavesurfer.on('ready', () => {
          setDuration(wavesurfer.getDuration());
        });
      }
    }, []);

    return (
      <div className="NewResult">
        {/* AudioVisualizer using the passed audioURL */}
        <AudioVisualizer audioFile={audioURL} />  
        <div className="Results">
          <h1>{message}</h1>  {/* Display conditional message */}
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
        <div style={{ maxWidth: '360px', margin: 'auto' }}>
          {/* WaveSurferPlayer using the passed audioURL */}
          <WaveSurferPlayer
            ref={waveSurferRef}
            audioFile={audioURL} 
            onProgress={setProgress}
          />
        </div>
        <div className="Bar">
          <div className="progress-bar">
            {shapes.map((shape, index) => {
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
                left: `${(progress * 100)}%`,
                transition: 'left 0.1s linear',
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
