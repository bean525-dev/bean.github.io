const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');
let currentSeries = "";

// MAPPING: These should match your Python script's logic
const config = {
    "TOS": {
        bg: "images/TOS_BG.jpg", // Change to your actual BG filename
        font: "TOS-Font",
        size: 100,
        color: "#FFFF00",
        type: "staggered"
    },
    "TNG": {
        bg: "images/TNG_BG.jpg",
        font: "TNG-Font",
        size: 80,
        color: "#FFFFFF",
        type: "centered"
    },
    "DS9": {
        bg: "images/DS9_BG.jpg",
        font: "DS9-Font",
        size: 90,
        type: "gradient"
    }
};

function openEditor(series) {
    currentSeries = series;
    document.getElementById('picker-screen').style.display = 'none';
    document.getElementById('editor-screen').style.display = 'block';
    document.getElementById('series-title').innerText = series;
}

function goBack() {
    document.getElementById('picker-screen').style.display = 'block';
    document.getElementById('editor-screen').style.display = 'none';
}

function generate() {
    const text = document.getElementById('user-text').value.toUpperCase();
    const settings = config[currentSeries];
    const img = new Image();
    img.src = settings.bg;

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        ctx.font = `${settings.size}px ${settings.font}`;
        ctx.textBaseline = "middle";

        if (settings.type === "staggered") {
            // TOS logic: one word per line, shifting right
            let words = text.split(" ");
            let x = 150;
            let y = 300;
            words.forEach(word => {
                ctx.fillStyle = "black"; // Shadow
                ctx.fillText(word, x+4, y+4);
                ctx.fillStyle = settings.color;
                ctx.fillText(word, x, y);
                x += 80;
                y += settings.size + 20;
            });
        } else if (settings.type === "gradient") {
            // DS9 logic: Top-to-bottom gold gradient
            ctx.textAlign = "center";
            let grad = ctx.createLinearGradient(0, 400, 0, 500);
            grad.addColorStop(0, "#f0ad4e");
            grad.addColorStop(1, "#8b4513");
            ctx.fillStyle = grad;
            ctx.fillText(text, canvas.width/2, 450);
        } else {
            // TNG logic: Simple centered text
            ctx.textAlign = "center";
            ctx.fillStyle = settings.color;
            ctx.fillText(text, canvas.width/2, canvas.height/2);
        }
    };
}

function download() {
    const link = document.createElement('a');
    link.download = 'trek-title.png';
    link.href = canvas.toDataURL();
    link.click();
}
