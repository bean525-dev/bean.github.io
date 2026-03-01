const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');
let currentSeries = "";

const seriesData = {
    "TOS": {
        templates: [
            { name: "Standard Yellow", bg: "TOS_bg.jpg", font: "TOS-Font", color: "yellow", size: 100, x: 0.08, y: 0.15, indent: 120, spacing: 30, wrap: 20 },
            { name: "Mirror Planet", bg: "TOS_mirror.png", font: "TOS-Font", color: "yellow", size: 100, x: 0.08, y: 0.15, indent: 100, spacing: 20, wrap: 25 },
            { name: "Hull Variant", bg: "TOS_hull.png", font: "TOS-Font", color: "#7da6ff", size: 95, x: 0.25, y: 0.68, indent: 75, spacing: 20, wrap: 22 }
        ]
    },
    "TAS": {
        templates: [
            { name: "Standard Planet", bg: "TAS_bg.png", font: "TAS-Font", color: "#dcb442", size: 175, x: 0.12, y: 0.42, wrap: 10 }
        ]
    },
    "TNG": {
        templates: [
            { name: "Standard Top Left", bg: "TNG_bg.jpg", font: "TNG-Font", color: "#5286ff", size: 65, x: 0.08, y: 0.12, wrap: 40 },
            { name: "High Corner", bg: "TNG_enemy.png", font: "TNG-Font", color: "#5286ff", size: 65, x: 0.05, y: 0.08, wrap: 40 },
            { name: "Asteroid", bg: "TNG_asteroid.png", font: "TNG-Font", color: "#5286ff", size: 65, x: 0.12, y: 0.12, wrap: 40 }
        ]
    },
    "DS9": {
        templates: [
            { name: "Standard", bg: "DS9_bg.jpg", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 42, x: 0.1, y: 0.12, wrap: 34 },
            { name: "Adversary", bg: "DS9_adversary.png", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 42, x: 0.1, y: 0.12, wrap: 34 },
            { name: "Shakaar", bg: "DS9_shakaar.png", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 42, x: 0.12, y: 0.10, wrap: 34 }
        ]
    },
    "VOY": {
        templates: [
            { name: "Standard (Handel)", bg: "VOY_bg.jpg", font: "VOY-Font", top: "#FF4F00", bottom: "#FFCC99", size: 44, x: 0.08, y: 0.12, wrap: 35 },
            { name: "Ex Post Facto (Galaxy)", bg: "VOY_facto.png", font: "Galaxy-Font", top: "#FF4F00", bottom: "#FFCC99", size: 40, x: 0.08, y: 0.12, wrap: 35 }
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
    const tempIndex = document.getElementById('template-select').value;
    const s = seriesData[currentSeries].templates[tempIndex];
    
    // Quoting Logic
    let title = (currentSeries === "TAS") ? textInput : `"${textInput}"`.toUpperCase();

    const img = new Image();
    img.src = `images/${s.bg}`; 

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        let fontSize = s.size;
        if (currentSeries !== "TAS" && title.length > 25) fontSize = Math.floor(s.size * 0.70);
        
        // Apply the template's specific font
        ctx.font = `${fontSize}px "${s.font}"`;
        ctx.textBaseline = "top";

        if (currentSeries === "TOS") {
            drawTOS(title, s, fontSize);
        } else if (s.top) {
            drawGradient(title, s, fontSize);
        } else {
            drawStandard(title, s, fontSize);
        }
    };
}

function drawTOS(text, s, size) {
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

function drawGradient(text, s, size) {
    const startX = canvas.width * s.x;
    const startY = canvas.height * s.y;
    let grad = ctx.createLinearGradient(0, startY, 0, startY + size);
    grad.addColorStop(0, s.top);
    grad.addColorStop(1, s.bottom);
    ctx.fillStyle = grad;
    ctx.fillText(text, startX, startY);
}

function drawStandard(text, s, size) {
    ctx.fillStyle = s.color;
    ctx.fillText(text, canvas.width * s.x, canvas.height * s.y);
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = `trek-title.png`;
    link.href = canvas.toDataURL();
    link.click();
}
