const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');
let currentSeries = "";

// DATA MAPPED FROM YOUR PYTHON SCRIPT
const seriesData = {
    "TOS": {
        font: "TOS-Font",
        templates: [
            { name: "Standard Yellow", bg: "TOS_bg.jpg", color: "yellow", size: 100, x: 0.08, y: 0.15, indent: 120, spacing: 30, wrap: 20 },
            { name: "Mirror Planet", bg: "TOS_mirror.png", color: "yellow", size: 100, x: 0.08, y: 0.15, indent: 100, spacing: 20, wrap: 25 },
            { name: "Spock's Brain Hull", bg: "TOS_hull.png", color: "#7da6ff", size: 95, x: 0.25, y: 0.68, indent: 75, spacing: 20, wrap: 22 }
        ]
    },
    "TAS": {
        font: "TAS-Font",
        templates: [
            { name: "Standard Planet", bg: "TAS_bg.png", color: "#dcb442", size: 175, x: 0.12, y: 0.42, wrap: 10 }
        ]
    },
    "TNG": {
        font: "TNG-Font",
        templates: [
            { name: "Standard Top Left", bg: "TNG_bg.jpg", color: "#5286ff", size: 65, x: 0.08, y: 0.12, wrap: 40 },
            { name: "High Corner Left", bg: "TNG_enemy.png", color: "#5286ff", size: 65, x: 0.05, y: 0.08, wrap: 40 },
            { name: "Asteroid Variant", bg: "TNG_asteroid.png", color: "#5286ff", size: 65, x: 0.12, y: 0.12, wrap: 40 }
        ]
    },
    "DS9": {
        font: "DS9-Font",
        templates: [
            { name: "Standard Top Left", bg: "DS9_bg.jpg", top: "#e0e0e0", bottom: "#7da6ff", size: 42, x: 0.1, y: 0.12, wrap: 34 },
            { name: "High Right", bg: "DS9_adversary.png", top: "#e0e0e0", bottom: "#7da6ff", size: 42, x: 0.1, y: 0.12, wrap: 34 },
            { name: "Shakaar Variant", bg: "DS9_shakaar.png", top: "#e0e0e0", bottom: "#7da6ff", size: 42, x: 0.12, y: 0.10, wrap: 34 }
        ]
    },
    "VOY": {
        font: "VOY-Font",
        templates: [
            { name: "Standard Top Left", bg: "VOY_bg.jpg", top: "#FF4F00", bottom: "#FFCC99", size: 44, x: 0.08, y: 0.12, wrap: 35 },
            { name: "Saucer Overlap", bg: "VOY_latent.png", top: "#FF4F00", bottom: "#FFCC99", size: 44, x: 0.12, y: 0.08, wrap: 35 },
            { name: "Ex Post Facto", bg: "VOY_facto.png", top: "#FF4F00", bottom: "#FFCC99", size: 40, x: 0.08, y: 0.12, wrap: 35 }
        ]
    }
};

function openEditor(fullName, code) {
    currentSeries = code;
    document.getElementById('picker-screen').style.display = 'none';
    document.getElementById('editor-screen').style.display = 'block';
    document.getElementById('series-display-name').innerText = fullName;

    const select = document.getElementById('template-select');
    select.innerHTML = ""; 
    seriesData[code].templates.forEach((temp, index) => {
        let opt = document.createElement('option');
        opt.value = index;
        opt.innerHTML = temp.name;
        select.appendChild(opt);
    });
}

function goBack() {
    document.getElementById('picker-screen').style.display = 'block';
    document.getElementById('editor-screen').style.display = 'none';
}

function generateCard() {
    const textInput = document.getElementById('user-title').value;
    let title = (currentSeries === "TAS") ? textInput : `"${textInput}"`.toUpperCase();
    
    const tempIndex = document.getElementById('template-select').value;
    const s = seriesData[currentSeries].templates[tempIndex];
    const fontName = seriesData[currentSeries].font;

    const img = new Image();
    img.src = `images/${s.bg}`; 

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Auto-shrink font if title is long (as per your Python logic)
        let fontSize = s.size;
        if (currentSeries !== "TAS" && title.length > 25) fontSize = Math.floor(s.size * 0.70);
        
        ctx.font = `${fontSize}px ${fontName}`;
        ctx.textBaseline = "top";

        if (currentSeries === "TOS") {
            drawTOS(title, s, fontSize, fontName);
        } else if (s.top) {
            drawGradient(title, s, fontSize, fontName);
        } else {
            drawStandard(title, s, fontSize, fontName);
        }
    };
}

function drawTOS(text, s, size, font) {
    let words = text.split(" ");
    let curX = canvas.width * s.x;
    let curY = canvas.height * s.y;

    words.forEach(word => {
        ctx.fillStyle = "black";
        ctx.fillText(word, curX + 5, curY + 5);
        ctx.fillStyle = s.color;
        ctx.fillText(word, curX, curY);
        curX += s.indent;
        curY += size + s.spacing;
    });
}

function drawGradient(text, s, size, font) {
    const startX = canvas.width * s.x;
    const startY = canvas.height * s.y;
    
    let grad = ctx.createLinearGradient(0, startY, 0, startY + size);
    grad.addColorStop(0, s.top);
    grad.addColorStop(1, s.bottom);
    
    ctx.fillStyle = grad;
    ctx.fillText(text, startX, startY);
}

function drawStandard(text, s, size, font) {
    ctx.fillStyle = s.color;
    ctx.fillText(text, canvas.width * s.x, canvas.height * s.y);
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = `trek-title.png`;
    link.href = canvas.toDataURL();
    link.click();
}
