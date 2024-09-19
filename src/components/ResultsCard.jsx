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
  
    const record = { recording: '1', mumbled: 3, filler: 2, stat: 0, wpm: 0 };

    // Array of phrases
    const phrases = [
      "Well Done!",
      "Great Job!",
      "Keep Going!",
      "Nice Work!",
      "Excellent!"
    ];

    // Randomly select a phrase
    const getRandomMessage = () => {
      const randomIndex = Math.floor(Math.random() * phrases.length);
      return phrases[randomIndex];
    };

    // Set the message to a random phrase
    const [message, setMessage] = useState(getRandomMessage());

    const shapes = [
      { position: 10, duration: 10, type: 'mumbled' },
      { position: 30, duration: 5, type: 'filler' },
      { position: 50, duration: 7, type: 'mumbled' },
      { position: 120, duration: 3, type: 'filler' },
      { position: 240, duration: 4, type: 'mumbled' },
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
  
    useEffect(() => {
      console.log(`Progress updated: ${progress}`);
    }, [progress]);
  
    return (
      <div className="NewResult">
        <AudioVisualizer audioFile={audioURL} />  {/* Use passed audioURL */}
        <div className="Results">
          <h1>{message}</h1>  {/* Display random message */}
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
          <WaveSurferPlayer
            ref={waveSurferRef}
            audioFile={audioURL}  /* Use passed audioURL */
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
                transition: 'left 0.5s linear',
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
