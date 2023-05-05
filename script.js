
const container = document.getElementById("container");
const canvas = document.getElementById("canvas1");
const file = document.getElementById("fileupload");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
let audioSource;
let analyser;
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

//listen for new file upload
file.addEventListener("change", function(){
    const files = this.files;
    //set file as audio and play it
    const audio1 = document.getElementById("audio1");
    audio1.src = URL.createObjectURL(files[0]);
    const audioCtx = new (window.AudioContext || webkitURL.webkitAudio)();
    audio1.load();
    audio1.play();
    
    //setup analyser
    audioSource = audioCtx.createMediaElementSource(audio1);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    //fast fourier transformation - basically gets the frequency data and you're choosing sth like the bitrate (must be multiples of 32)
    analyser.fftSize = 1024;
    //number of bars in our visualiser (half of fftSize)
    const bufferLength = analyser.frequencyBinCount;
    //array for unassigned 8 bit integers
    const dataArray = new Uint8Array(bufferLength);

    //making the width of the bars add up to fit screen
    const barWidth = canvas.width/bufferLength;
    let barHeight;
    let x;

    function animate(){
        x=0;
        //clear whole canvas
        ctx.clearRect(0,0, canvas.width, canvas.height);
        //gets frequency data (the volume of each frequency chunk) to use as height of bars
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray)
        //call parent function to create animation loop
        requestAnimationFrame(animate);
    }
    animate();
})


function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray){
    for(let i = 0; i < bufferLength; i++){
        //setting height to volume of frequency
        barHeight = dataArray[i] * 2 ;
        //time to rotate the canvas to make a circular visualiser
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(i * Math.PI * 8 / bufferLength);
        //if you make hue = i * 15 you get the spectrum of the rainbow around the circle
        const hue = i * 5;
        ctx.fillStyle = "hsl(" + hue + ", 100%, 50%)";
        ctx.fillRect(0, 0, barWidth,  barHeight);
        x+=barWidth;
        //restore canvas to original position
        ctx.restore();
    }
}
