function AudioVisualizer() {
    const audioContext = new AudioContext();

// Create a source node from an audio file
fetch('src\assets\Tyler The Creator - SIKE Sound Effect.mp3')
 .then(response => response.arrayBuffer())
 .then(buffer => audioContext.decodeAudioData(buffer))
 .then(audio => {
    const source = audioContext.createBufferSource();
    source.buffer = audio;
    source.connect(audioContext.destination);
    source.start();

    // Create a canvas to draw the waveform
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Create an analyzer node to get the frequency data
    const analyzer = audioContext.createAnalyser();
    source.connect(analyzer);

    // Set up the canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw the waveform
    function draw() {
      requestAnimationFrame(draw);
      const frequencyData = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(frequencyData);

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the waveform
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      for (let i = 0; i < frequencyData.length; i++) {
        const x = i * canvas.width / frequencyData.length;
        const y = canvas.height / 2 - frequencyData[i] * canvas.height / 256;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    draw();
  });
}