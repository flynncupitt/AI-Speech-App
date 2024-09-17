import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import WaveSurfer from 'wavesurfer.js';

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

const WaveSurferPlayer = forwardRef(({ audioFile, onProgress }, ref) => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const intervalRef = useRef(0); // Ref to store the interval ID

    useEffect(() => {
        if (!waveformRef.current) return;

        // Initialize WaveSurfer
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#D5D5D5",
            progressColor: "#414141",
            height: 75,
            responsive: true,
            hideScrollbar: true,
            cursorColor: "#8E30F2",
            barWidth: 2,
            barGap: 5,
        });

        // Load the audio file
        wavesurfer.current.load(audioFile);

        // Function to immediately update progress
        const updateProgress = () => {
            const currentTime = wavesurfer.current.getCurrentTime();
            const duration = wavesurfer.current.getDuration();
            if (!isNaN(currentTime) && !isNaN(duration) && duration > 0) {
                const progress = currentTime / duration;  // Calculate progress as a fraction (0-1)
                if (onProgress) {
                    onProgress(progress);  // Immediately update purple cursor position
                }
            }
        };

        // Handle waveform click to move the cursor and seek audio
        waveformRef.current.addEventListener('click', (e) => {
            const waveformRect = waveformRef.current.getBoundingClientRect();
            const clickX = e.clientX - waveformRect.left; // Get click position relative to waveform
            const waveformWidth = waveformRect.width;
            const seekPosition = clickX / waveformWidth; // Calculate seek position (0-1)

            // Seek to the calculated position in the audio
            wavesurfer.current.seekTo(seekPosition);

            if (onProgress) {
                onProgress(seekPosition);  // Update the visual progress as well
            }
        });

        // Handle play/pause button press
        wavesurfer.current.on('play', () => {
            updateProgress(); // Update immediately when play is triggered
            intervalRef.current = setInterval(updateProgress, 500); // Move cursor every second
        });

        wavesurfer.current.on('pause', () => {
            clearInterval(intervalRef.current); // Clear interval when paused
            updateProgress(); // Update progress immediately when paused
        });

        wavesurfer.current.on('seek', (seekProgress) => {
            if (onProgress) {
                onProgress(seekProgress);  // Update based on the seek progress value
            }
        });

        // Clean up WaveSurfer and interval on component unmount
        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }
            clearInterval(intervalRef.current); // Ensure interval is cleared on unmount
        };
    }, [audioFile, onProgress]);

    // Expose playPause function to parent
    useImperativeHandle(ref, () => ({
        playPause: () => {
            if (wavesurfer.current.isPlaying()) {
                wavesurfer.current.pause();
            } else {
                wavesurfer.current.play();
            }
        },
        getInstance: () => wavesurfer.current, // Expose the WaveSurfer instance
    }));

    return (
        <div>
            <div ref={waveformRef} id="waveform"></div>
        </div>
    );
});

export default WaveSurferPlayer;
