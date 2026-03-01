const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');
let currentSeries = "";

// LOCK Resolution to 4:3 Standard
const TARGET_WIDTH = 1440;
const TARGET_HEIGHT = 1080;

const seriesData = {
    "TOS": {
        templates: [
            { name: "Planet Orbit", bg: "TOS_bg.jpg", font: "TOS-Font", color: "yellow", size: 100, x: 0.08, y: 0.15, indent: 120, spacing: 30 },
            { name: "Mirror Planet Orbit", bg: "TOS_mirror.png", font: "TOS-Font", color: "yellow", size: 100, x: 0.08, y: 0.15, indent: 100, spacing: 20 },
            { name: "On The Hull", bg: "TOS_hull.png", font: "TOS-Font", color: "#7da6ff", size: 95, x: 0.25, y: 0.68, indent: 75, spacing: 20 }
        ]
    },
    "TAS": {
        templates: [
            { name: "Planet", bg: "TAS_bg.png", font: "TAS-Font", color: "#dcb442", size: 175, x: 0.1, y: 0.1, creditSize: 45 }
        ]
    },
    "TNG": {
        templates: [
            { name: "Standard", bg: "TNG_bg.jpg", font: "TNG-Font", color: "#5286ff", size: 130, x: 0.08, y: 0.12 }, 
            { name: "Alternate", bg: "TNG_enemy.png", font: "TNG-Font", color: "#5286ff", size: 130, x: 0.05, y: 0.08 },
            { name: "Asteroid", bg: "TNG_asteroid.png", font: "TNG-Font", color: "#5286ff", size: 130, x: 0.12, y: 0.12 }
        ]
    },
    "DS9": {
        templates: [
            // Scaled from 42 up to 86
            { name: "Station", bg: "DS9_bg.jpg", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 86, x: 0.1, y: 0.12 }, 
            { name: "Station View 2", bg: "DS9_adversary.png", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 86, x: 0.1, y: 0.12 },
            { name: "Station View 3", bg: "DS9_shakaar.png", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 86, x: 0.12, y: 0.10 }
        ]
    },
    "VOY": {
        templates: [
            // Scaled from 44 up to 90
            { name: "Zoomed Out", bg: "VOY_bg.jpg", font: "VOY-Font", top: "#FF4F00", bottom: "#FFCC99", size: 90, x: 0.08, y: 0.12 },
            { name: "Underside", bg: "VOY_latent.png", font: "VOY-Font", top: "#FF4F00", bottom: "#FFCC99", size: 90, x: 0.12, y: 0.08 },
            { name: "Overview", bg: "VOY_facto.png", font: "Galaxy-Font", top: "#FF4F00", bottom: "#FFCC99", size: 82, x: 0.08, y: 0.12 }
        ]
    }
};

function setupListeners() {
    const inputs = ['user-title', 'user-writer', 'template-select'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.removeEventListener('input', generateCard);
            el.addEventListener('input', generateCard);
        }
    });
}

function openEditor(fullName, code) {
    currentSeries = code;
    document.getElementById('picker-screen').style.display = 'none';
    document.getElementById('editor-screen').style.display = 'block';
    document.getElementById('series-display-name').innerText = fullName;
    
    const writerGroup = document.getElementById('writer-group');
    if (writerGroup) writerGroup.style.display = (code === "TAS") ? "block" : "none";

    const select = document.getElementById('template-select');
    select.innerHTML = ""; 
    seriesData[code].templates.forEach((temp, index) => {
        let opt = document.createElement('option');
        opt.value = index;
        opt.innerHTML = temp.name;
        select.appendChild(opt);
    });

    const titleBox = document.getElementById('user-title');
    if (code === "TOS") titleBox.value = "THE CITY ON\nTHE EDGE OF FOREVER";
    else if (code === "TAS") titleBox.value = "THE VOID\nOF THE\nGALACTIC\nRIM";
    else if (code === "TNG") titleBox.value = "The Measure of a Man";
    else if (code === "DS9") titleBox.value = "In the Pale Moonlight";
    else if (code === "VOY") titleBox.value = "Threshold";
    else titleBox.value = "EPISODE TITLE";

    setupListeners(); 
    generateCard();
}

function goBack() {
    document.getElementById('picker-screen').style.display = 'block';
    document.getElementById('editor-screen').style.display = 'none';
}

async function generateCard() {
    if (!currentSeries) return;

    const textInput = document.getElementById('user-title').value;
    const writerElem = document.getElementById('user-writer');
    const writerInput = (writerElem) ? writerElem.value : "";
    const tempIndex = document.getElementById('template-select').value || 0;
    const s = seriesData[currentSeries].templates[tempIndex];
    
    // THE QUOTE LOGIC
    let title = "";
    if (currentSeries === "TAS") {
        // No quotes, all caps for TAS
        title = textInput.toUpperCase();
    } else if (currentSeries === "TNG") {
        // Mixed case with quotes for TNG
        title = `"${textInput}"`;
    } else {
        // All caps with quotes for TOS, DS9, VOY
        title = `"${textInput.toUpperCase()}"`;
    }

    try {
        await document.fonts.load(`${s.size}px "${s.font}"`);
    } catch (e) {}

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `images/${s.bg}`; 

    img.onload = () => {
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;
        
        ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        
        ctx.font = `${s.size}px "${s.font}", Arial, sans-serif`;
        ctx.textBaseline = "top";
        ctx.textAlign = "left";

        if (currentSeries === "TOS") {
            drawTOS(title, s, s.size);
        } else if (currentSeries === "TAS") {
            drawTAS(title, writerInput, s, s.size);
        } else if (s.top) {
            drawGradient(title, s, s.size);
        } else {
            drawStandard(title, s, s.size);
        }
    };
}

// ... (Rest of draw functions remain exactly the same as previous working versions)
function drawTOS(text, s, size) {
    const lines = text.split('\n');
    let curX = canvas.width * s.x;
    let curY = canvas.height * s.y;
    lines.forEach(line => {
        ctx.fillStyle = "black";
        ctx.fillText(line, curX + 5, curY + 5);
        ctx.fillStyle = s.color;
        ctx.fillText(line, curX, curY);
        curX += s.indent;
        curY += size + s.spacing;
    });
}

function drawTAS(text, writer, s, size) {
    const lines = text.split('\n');
    ctx.fillStyle = s.color;
    let curY = canvas.height * s.y;
    let curX = canvas.width * s.x;
    const lineHeight = size * 0.8; 
    lines.forEach(line => {
        ctx.fillText(line, curX, curY);
        curY += lineHeight; 
    });
    if (writer && writer.trim() !== "") {
        ctx.font = `${s.creditSize}px "${s.font}", Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(`WRITTEN BY ${writer.toUpperCase()}`, canvas.width * 0.5, canvas.height * 0.88);
    }
}

function drawGradient(text, s, size) {
    const lines = text.split('\n');
    let curY = canvas.height * s.y;
    lines.forEach(line => {
        let grad = ctx.createLinearGradient(0, curY, 0, curY + size);
        grad.addColorStop(0, s.top);
        grad.addColorStop(1, s.bottom);
        ctx.fillStyle = grad;
        ctx.fillText(line, canvas.width * s.x, curY);
        curY += size + 10;
    });
}

function drawStandard(text, s, size) {
    const lines = text.split('\n');
    let curY = canvas.height * s.y;
    ctx.fillStyle = s.color;
    lines.forEach(line => {
        ctx.fillText(line, canvas.width * s.x, curY);
        curY += size + 10;
    });
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = `trek-title.png`;
    link.href = canvas.toDataURL();
    link.click();
}
