const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');
let currentSeries = "";

const seriesData = {
    "TOS": {
        templates: [
            { name: "Standard Yellow", bg: "TOS_bg.jpg", font: "TOS-Font", color: "yellow", size: 100, x: 0.08, y: 0.15, indent: 120, spacing: 30 },
            { name: "Mirror Planet", bg: "TOS_mirror.png", font: "TOS-Font", color: "yellow", size: 100, x: 0.08, y: 0.15, indent: 100, spacing: 20 },
            { name: "Hull Variant", bg: "TOS_hull.png", font: "TOS-Font", color: "#7da6ff", size: 95, x: 0.25, y: 0.68, indent: 75, spacing: 20 }
        ]
    },
    "TAS": {
        templates: [
            { name: "Standard Planet", bg: "TAS_bg.png", font: "TAS-Font", color: "#dcb442", size: 135, x: 0.1, y: 0.1, creditSize: 45 }
        ]
    },
    "TNG": {
        templates: [
            { name: "Standard (Crillee)", bg: "TNG_bg.jpg", font: "TNG-Font", color: "#5286ff", size: 65, x: 0.08, y: 0.12 },
            { name: "Enemy (Crillee)", bg: "TNG_enemy.png", font: "TNG-Font", color: "#5286ff", size: 65, x: 0.05, y: 0.08 },
            { name: "Asteroid (Crillee)", bg: "TNG_asteroid.png", font: "TNG-Font", color: "#5286ff", size: 65, x: 0.12, y: 0.12 }
        ]
    },
    "DS9": {
        templates: [
            { name: "Standard", bg: "DS9_bg.jpg", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 42, x: 0.1, y: 0.12 },
            { name: "Adversary", bg: "DS9_adversary.png", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 42, x: 0.1, y: 0.12 },
            { name: "Shakaar", bg: "DS9_shakaar.png", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 42, x: 0.12, y: 0.10 }
        ]
    },
    "VOY": {
        templates: [
            { name: "Standard (Handel)", bg: "VOY_bg.jpg", font: "VOY-Font", top: "#FF4F00", bottom: "#FFCC99", size: 44, x: 0.08, y: 0.12 },
            { name: "Saucer (Handel)", bg: "VOY_latent.png", font: "VOY-Font", top: "#FF4F00", bottom: "#FFCC99", size: 44, x: 0.12, y: 0.08 },
            { name: "Ex Post Facto (Galaxy)", bg: "VOY_facto.png", font: "Galaxy-Font", top: "#FF4F00", bottom: "#FFCC99", size: 40, x: 0.08, y: 0.12 }
        ]
    }
};

function openEditor(fullName, code) {
    currentSeries = code;
    document.getElementById('picker-screen').style.display = 'none';
    document.getElementById('editor-screen').style.display = 'block';
    document.getElementById('series-display-name').innerText = fullName;
    
    document.getElementById('writer-group').style.display = (code === "TAS") ? "block" : "none";

    const select = document.getElementById('template-select');
    select.innerHTML = ""; 
    seriesData[code].templates.forEach((temp, index) => {
        let opt = document.createElement('option');
        opt.value = index;
        opt.innerHTML = temp.name;
        select.appendChild(opt);
    });

    // Set default text based on series to show an example immediately
    const titleBox = document.getElementById('user-title');
    if (code === "TOS") titleBox.value = "THE CITY ON\nTHE EDGE OF FOREVER";
    else if (code === "TAS") titleBox.value = "THE VOID\nOF THE\nGALACTIC\nRIM";
    else titleBox.value = "THE CORE OF THE MATTER";

    generateCard();
}

function goBack() {
    document.getElementById('picker-screen').style.display = 'block';
    document.getElementById('editor-screen').style.display = 'none';
}

async function generateCard() {
    const textInput = document.getElementById('user-title').value;
    const writerInput = document.getElementById('user-writer').value || "";
    const tempIndex = document.getElementById('template-select').value || 0;
    const s = seriesData[currentSeries].templates[tempIndex];
    
    let title = (currentSeries === "TAS") ? textInput : `"${textInput}"`.toUpperCase();

    // Ensure the font is loaded before drawing
    await document.fonts.load(`${s.size}px "${s.font}"`);

    const img = new Image();
    img.src = `images/${s.bg}`; 

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        let fontSize = s.size;
        
        ctx.font = `${fontSize}px "${s.font}"`;
        ctx.textBaseline = "top";

        if (currentSeries === "TOS") {
            drawTOS(title, s, fontSize);
        } else if (currentSeries === "TAS") {
            drawTAS(title, writerInput, s, fontSize);
        } else if (s.top) {
            drawGradient(title, s, fontSize);
        } else {
            drawStandard(title, s, fontSize);
        }
    };
}

function drawTOS(text, s, size) {
    const lines = text.split('\n');
    let curX = canvas.width * s.x;
    let curY = canvas.height * s.y;
    ctx.textAlign = "left";
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
    ctx.textAlign = "left"; // Changed from center to match your second image
    ctx.fillStyle = s.color;

    let curY = canvas.height * s.y;
    let curX = canvas.width * s.x;

    lines.forEach(line => {
        ctx.fillText(line.toUpperCase(), curX, curY);
        curY += size - 10; 
    });

    if (writer) {
        ctx.font = `${s.creditSize}px "${s.font}"`;
        // Credits stay centered at the bottom
        ctx.textAlign = "center";
        ctx.fillText(`WRITTEN BY ${writer.toUpperCase()}`, canvas.width * 0.5, canvas.height * 0.88);
    }
}

function drawGradient(text, s, size) {
    const lines = text.split('\n');
    let curY = canvas.height * s.y;
    ctx.textAlign = "left";
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
    ctx.textAlign = "left";
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
