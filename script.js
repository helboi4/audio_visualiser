
const container = document.getElementById("container");
const canvas = document.getElementById("canvas1");
const file = document.getElementById("fileupload");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
let audioSource;
let analyser;

//TODO: fix issue with file upload button not working

file.addEventListener("change", function(){
    const files = this.files;
    const audio1 = document.getElementById("audio1");
    audio1.src = URL.createObjectURL(files[0]);
    const audioCtx = new (window.AudioContext || webkitURL.webkitAudio)();
    audio1.load();
    audio1.play();
    
    audioSource = audioCtx.createMediaElementSource(audio1);
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 64;
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

// container.addEventListener("click", function(){
//     const audio1 = document.getElementById("audio1");
//     audio1.src = "./audio_assets/audio1.wav";
//     const audioCtx = new (window.AudioContext || webkitURL.webkitAudio)();

//     audio1.play();
//     audioSource = audioCtx.createMediaElementSource(audio1);
//     analyser = audioCtx.createAnalyser();
//     audioSource.connect(analyser);
//     analyser.connect(audioCtx.destination);
//     analyser.fftSize = 64;
//     //number of bars in our visualiser (half of fftSize)
//     const bufferLength = analyser.frequencyBinCount;
//     //array for unassigned 8 bit integers
//     const dataArray = new Uint8Array(bufferLength);

//     //making the width of the bars add up to fit screen
//     const barWidth = canvas.width/bufferLength;
//     let x;

//     function animate(){
//         x=0;
//         //clear whole canvas
//         ctx.clearRect(0,0, canvas.width, canvas.height);
//         //gets frequency data (the volume of each frequency chunk) to use as height of bars
//         analyser.getByteFrequencyData(dataArray);
//         drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray)
//         //call parent function to create animation loop
//         requestAnimationFrame(animate);
//     }
//     animate();
// });

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray){
    for(let i = 0; i < bufferLength; i++){
        //setting height to volume of frequency
        barHeight = dataArray[i];
        ctx.fillStyle = "white";
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x+=barWidth;
    }
}
