import React, { useEffect, useState } from 'react';
import './Ad.css';
import QRCode from 'qrcode';

const loadedTvImage = new Image();
loadedTvImage.src = '/linklocalplaceholderblack.png';

var actualCallbackToUse = null;

const Ad = () => {
  const [logo, setLogo] = useState('');
  const [background, setBackground] = useState('');
  const [topRightText, setTopRightText] = useState('');
  const [bottomLeftText1, setBottomLeftText1] = useState('');
  const [bottomLeftText2, setBottomLeftText2] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [ctx, setCtx] = useState(null);
  const [canvas, setCanvas] = useState(null);

  const [topFont, setTopFont] = useState(55);
  const [bottomFont1, setBottomFont1] = useState(55);
  const [bottomFont2, setBottomFont2] = useState(55);

  useEffect(() => {
    const mCanvas = document.getElementById("canvas");
    const mCtx = mCanvas.getContext("2d");

    const aspectRatio = 1920 / 1080;

    function resizeCanvas() {
      mCanvas.style.width = window.innerWidth/2 + 'px';
      mCanvas.style.height = window.innerWidth / 2 / aspectRatio + 'px';
    }
  
    //window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  
    const width = 1920; // Width of the canvas
    const height = 1080; // Height of the canvas
    
    // Set the canvas dimensions
    mCanvas.width = width;
    mCanvas.height = height;
    setCtx(mCtx);
    setCanvas(mCanvas);

    clearScreen(mCtx, mCanvas);
    mCtx.drawImage(loadedTvImage, 0, 0, 1628,912);
  }, [ctx, canvas]);

  const resetCanvasToTransparent = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOverlay(ctx, canvas, qrCode, logo, topRightText, bottomLeftText1, bottomLeftText2, parseInt(topFont), parseInt(bottomFont1), parseInt(bottomFont2));
  }

  useEffect(() => {
    handleBackground(ctx, canvas, background, () => { 
      drawOverlay(ctx, canvas, qrCode, logo, topRightText, bottomLeftText1, bottomLeftText2, parseInt(topFont), parseInt(bottomFont1), parseInt(bottomFont2));
    })
  }, [qrCode, logo, background, topRightText, bottomLeftText1, bottomLeftText2, canvas, ctx, topFont, bottomFont1, bottomFont2]);

  return (
    <div className='ad'>
        <h2>Company Logo (Image above barcode)</h2>
        <input type="file" accept="image/*" onChange={(e) => {
            if (e.target.files.length > 0) {
                setLogo(URL.createObjectURL(e.target.files[0]));
            }
        }} /><br/>
        <h2>Background Image or Video</h2>
        <input type="file" accept="image/*,video/*" onChange={(e) => {
            if (e.target.files.length > 0) {
                setBackground(URL.createObjectURL(e.target.files[0]));
            }
        }} /><br/>
        <h2>Enter Company Website</h2>
        <input type="file" accept="image/*" onChange={(e) => {
            if (e.target.files.length > 0) {
                setQrCode(URL.createObjectURL(e.target.files[0]));
            }
        }} /><br/>
        <h2>Top Right Text</h2>
        <input type="text" placeholder="Top right text" value={topRightText} onChange={(e) => setTopRightText(e.target.value)} />
        <input type="range" min="10" max="128" value={topFont} onChange={(e) => setTopFont(e.target.value)} />
        <input type="number" min="10" max="128" value={topFont} onChange={(e) => setTopFont(e.target.value)} />
        <br/>
        <h2>Bottom Text 1</h2>
        <input type="text" placeholder="Bottom left top text" value={bottomLeftText1} onChange={(e) => setBottomLeftText1(e.target.value)} />
        <input type="range" min="10" max="128" value={bottomFont1} onChange={(e) => setBottomFont1(e.target.value)} />
        <input type="number" min="10" max="128" value={bottomFont1} onChange={(e) => setBottomFont1(e.target.value)} />
        <br/>
        <h2>Bottom Text 2</h2>
        <input type="text" placeholder="Bottom left bottom text" value={bottomLeftText2} onChange={(e) => setBottomLeftText2(e.target.value)} />
        <input type="range" min="10" max="128" value={bottomFont2} onChange={(e) => setBottomFont2(e.target.value)} />
        <input type="number" min="10" max="128" value={bottomFont2} onChange={(e) => setBottomFont2(e.target.value)} />
        <br/>
        <div>
          <h1>Preview</h1>
          <button onClick={() => downloadCanvas(resetCanvasToTransparent)}>Download Image</button>
        </div>
        <canvas id="canvas" width="1920" height="1080">
          Your browser does not support the canvas element.
        </canvas>
    </div>
  );
};

const logoImage = new Image();
const backgroundImage = new Image();
const backgroundVideo = document.createElement('video');
const qrImage = new Image();
let prevBackground;
let isBackgroundAnImage;

function handleBackground(ctx, canvas, background, drawOverlayHelper) {
  if (!ctx || !canvas) return;
  if (background) {
    const needsToLoad = prevBackground !== background;
    if (needsToLoad) {

      setTimeout(async () => {
        isBackgroundAnImage = await isAnImage(background);

        backgroundVideo.onloadedmetadata = null
        backgroundVideo.src = '';

        prevBackground = background;

        if (isBackgroundAnImage === null) {
          alert("It seems this file is not an image or video. If you believe this is a mistake please contact me.")
          return
        }

        if (isBackgroundAnImage === true) {
          backgroundImage.onload = function() {

          clearScreen(ctx, canvas);
            handleBackground(ctx, canvas, background, drawOverlayHelper);
          };
          backgroundImage.src = background;
        } 
        
        if (isBackgroundAnImage === false) {
          backgroundVideo.onloadedmetadata = null
          backgroundVideo.src = background;
          backgroundVideo.muted = true;
          backgroundVideo.loop = true;

          clearScreen(ctx, canvas);
          backgroundVideo.load();
          handleBackground(ctx, canvas, background, drawOverlayHelper);
        }
      });
      return
  }

  if (isBackgroundAnImage) {
    clearScreen(ctx, canvas);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    drawOverlayHelper();
  } else {
    actualCallbackToUse = drawOverlayHelper;
    backgroundVideo.onloadedmetadata = function() {
      backgroundVideo.play();
        function drawVideo() {
            if (backgroundVideo.readyState === backgroundVideo.HAVE_ENOUGH_DATA) {
                ctx.drawImage(backgroundVideo, 0, 0, canvas.width, canvas.height);
                actualCallbackToUse();
            }
            if (background === backgroundVideo.src)
              requestAnimationFrame(drawVideo);
        }

        drawVideo();
    };
  }
} else {
    clearScreen(ctx, canvas);
    drawOverlayHelper();
  }
}

function clearScreen(ctx, canvas) {
  const squareSize = 10; // Size of each square
  const colors = ['white', 'lightgrey']; // Colors for the squares

  for (let y = 0; y < canvas.height; y += squareSize) {
      for (let x = 0; x < canvas.width; x += squareSize) {
          // Calculate the index for the colors array based on the row and column
          const colorIndex = (Math.floor(x / squareSize) + Math.floor(y / squareSize)) % colors.length;

          // Set the fill style and draw the square
          ctx.fillStyle = colors[colorIndex];
          ctx.fillRect(x, y, squareSize, squareSize);
      }
  }
}

function drawOverlay(ctx, canvas, qrCode, logo, topRightText, bottomLeftText1, bottomLeftText2, topFont, bottomFont1, bottomFont2) {
  const qrCodeSize = 280;
  const rectWidth = 1628;
  const rectHeight = 912;
  const canvasWidth = 1920;
  const canvasHeight = 1080;

  // Calculate the center position of the white space
  const textX = 30//(canvasWidth - rectWidth) / 2 + rectWidth / 2;
  const textY = rectHeight + (canvasHeight - rectHeight) / 2;
  ctx.fontWeight = 'bold';
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.fontWeight = '900';
  ctx.lineWidth = 3;
  // ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  
  if (bottomLeftText1 && bottomLeftText2) {
    const totalHeight = bottomFont1 + bottomFont2;
    const textY1 = textY - totalHeight / 4;
    const textY2 = textY + totalHeight / 4;

    drawTextWithStroke(ctx, bottomLeftText1, textX, textY1, bottomFont1);
    drawTextWithStroke(ctx, bottomLeftText2, textX, textY2, bottomFont2);
  } else if (bottomLeftText1) {
    drawTextWithStroke(ctx, bottomLeftText1, textX, textY, bottomFont1, bottomFont1);
  } else if (bottomLeftText2) {
    drawTextWithStroke(ctx, bottomLeftText2, textX, textY, bottomFont2, bottomFont2);
  }

  const words = topRightText.split(' ');

  const padding = 10; // Padding inside the box
  const maxWidth = canvasWidth - rectWidth - 2 * padding; // Maximum width of the text

  let line = '';
  let fontSize = parseInt(topFont);
  let y = padding + fontSize/2;
  if (logo) {
    y += logoImage.height;
  }
  if (qrCode) {
    y += qrCodeSize;
  }

  ctx.font = `${fontSize}px Roboto`;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      drawTextWithStroke(ctx, line, rectWidth + padding, y, topFont);
      line = words[n] + ' ';
      y += fontSize;
    }
    else {
      line = testLine;
    }
  }
  drawTextWithStroke(ctx, line, rectWidth + padding, y, topFont);

  //drwa black reactangle 
  ctx.fillStyle = "black";
  ctx.fillRect(rectWidth, 0, canvasWidth - rectWidth, logoImage.height + qrCodeSize);

  if (logo) {
    if (logoImage.src === logo) {
      // Calculate the height to maintain the aspect ratio
      const height = qrCodeSize * (logoImage.height / logoImage.width);

      // Calculate the position for the logo to be directly above the QR code
      const x = canvas.width - qrCodeSize - 5;
      const y = 10//canvas.height - qrCodeSize - height - 10; // Subtract an additional 10 for spacing
      ctx.drawImage(logoImage, x, y, qrCodeSize, height);
    } else {
      logoImage.onload = function() {
        // Calculate the height to maintain the aspect ratio
        const height = qrCodeSize * (logoImage.height / logoImage.width);

        // Calculate the position for the logo to be directly above the QR code
        const x = canvas.width - qrCodeSize - 5;
        const y = 10//canvas.height - qrCodeSize - height - 10; // Subtract an additional 10 for spacing

            ctx.drawImage(logoImage, x, y, qrCodeSize, height);
          };
          logoImage.src = logo;
        }
      drawQRCodeImage(qrCode, qrImage, qrCodeSize, canvas, ctx, logoImage.height);
  } 
  drawQRCodeImage(qrCode, qrImage, qrCodeSize, canvas, ctx);

  ctx.drawImage(loadedTvImage, 0, 0, 1628, 912);

    
}

function createQRcodeImage(url, qrCodeSize, canvas, ctx) {
  QRCode.toCanvas(url, { width: qrCodeSize, margin: 1 }, (err, qrCanvas) => {
    if (err) throw err;

    // Calculate position for QR code to be at the bottom right
    const x = canvas.width - qrCodeSize - 5;
    const y = canvas.height - qrCodeSize - 5;

    ctx.drawImage(qrCanvas, x, y, qrCodeSize, qrCodeSize);
  });
}

function drawQRCodeImage(qrImagePath, imageElement, qrCodeSize, canvas, ctx, height) {
  console.log('draw')
  if (qrImagePath) {
    const x = canvas.width - qrCodeSize - 5;
    const y = height ? height : 0;
    console.log('draw1')
    if (imageElement.src !== qrImagePath) {
      imageElement.onload = function () {
        ctx.drawImage(imageElement, x, y, qrCodeSize, qrCodeSize);
      };
      console.log('draw2')
      imageElement.src = qrImagePath;
    } 
    console.log('draw3')
    ctx.drawImage(imageElement, x, y, qrCodeSize, qrCodeSize);
  }
}

function drawTextWithStroke(ctx, text, x, y, fontSize) {  
  ctx.font = `bold ${fontSize}px `;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 12; // Increase the stroke width
  ctx.shadowColor = "white"; // Set the shadow color
  ctx.shadowBlur = 10; // Set the blur level for the shadow
  ctx.shadowOffsetX = 3; // Set the horizontal distance of the shadow
  ctx.shadowOffsetY = 3; // Set the vertical distance of the shadow
  ctx.strokeText(text, x, y);
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.fillText(text, x, y);
  ctx.strokeText(text, x, y);

  //reset
}

async function isAnImage(blobUrl) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  if (blob.type.startsWith('image/')) {
      return true;
  } else if (blob.type.startsWith('video/')) {
      return false;
  } else {
      return null;
  }
}

function downloadCanvas(reset) {
  if (isBackgroundAnImage === true)
    downloadCanvasAsImage();
  else if (isBackgroundAnImage === false)
    downloadCanvasAsImage();
  else {
    reset()
    downloadCanvasAsImage();
  }
}

function downloadCanvasAsImage() {
  var canvas = document.getElementById('canvas'); // Replace 'yourCanvasId' with your actual canvas ID
  var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // Convert canvas content to data URL

  var link = document.createElement('a');
  link.download = 'canvas-image.png'; // Set the download filename
  link.href = image;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//let recordedChunks = [];

// function startRecording(streamDuration = 5000) { // streamDuration in milliseconds
//   let canvas = document.getElementById('canvas');
//     var stream = canvas.captureStream(); // Capture the stream from the canvas
//     var options = { mimeType: "video/webm; codecs=vp9" }; // Specify the WebM format
//     var mediaRecorder = new MediaRecorder(stream, options);

//     mediaRecorder.ondataavailable = function(e) {
//         if (e.data.size > 0) {
//             recordedChunks.push(e.data);
//         }
//     };

//     mediaRecorder.onstop = function() {
//         var blob = new Blob(recordedChunks, {
//             type: "video/webm"
//         });

//         var url = URL.createObjectURL(blob);
//         var a = document.createElement('a');
//         document.body.appendChild(a);
//         a.style = 'display: none';
//         a.href = url;
//         a.download = 'canvas-recording.webm'; // Change the file extension to .webm
//         a.click();

//         // Cleanup
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//         recordedChunks = [];
//     };

//     mediaRecorder.start();
//     // Stop recording after a specific duration
//     setTimeout(() => {
//         mediaRecorder.stop();
//     }, streamDuration);
// }


export default Ad;