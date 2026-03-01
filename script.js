const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');
let currentSeries = "";

const seriesData = {
    "TOS": {
        templates: [
            { name: "Standard Yellow", bg: "TOS_bg.png", font: "TOS-Font", color: "yellow", size: 100, x: 0.08, y: 0.15, indent: 120, spacing: 30 },
            { name: "Mirror Planet", bg: "TOS_mirror.png", font: "TOS-Font", color: "yellow", size: 100, x: 0.08, y: 0.15, indent: 100, spacing: 20 },
            { name: "Hull Variant", bg: "TOS_hull.png", font: "TOS-Font", color: "#7da6ff", size: 95, x: 0.25, y: 0.68, indent: 75, spacing: 20 }
        ]
    },
    "TAS": {
        templates: [
            { name: "Standard Planet", bg: "TAS_bg.png", font: "TAS-Font", color: "#dcb442", size: 175, x: 0.1, y: 0.1, creditSize: 45 }
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
    console.log("Opening editor for:", code); // Diagnostic
    currentSeries = code;
    
    // Switch Screens
    document.getElementById('picker-screen').style.display = 'none';
    document.getElementById('editor-screen').style.display = 'block';
    document.getElementById('series-display-name').innerText = fullName;
    
    // Toggle Writer input for TAS
    const writerGroup = document.getElementById('writer-group');
    if (writerGroup) writerGroup.style.display = (code === "TAS") ? "block" : "none";

    // Populate Templates
    const select = document.getElementById('template-select');
    if (select) {
        select.innerHTML = ""; 
        seriesData[code].templates.forEach((temp, index) => {
            let opt = document.createElement('option');
            opt.value = index;
            opt.innerHTML = temp.name;
            select.appendChild(opt);
        });
    }

    // Set Defaults
    const titleBox = document.getElementById('user-title');
    if (titleBox) {
        if (code === "TOS") titleBox.value = "THE CITY ON\nTHE EDGE OF FOREVER";
        else if (code === "TAS") titleBox.value = "THE VOID\nOF THE\nGALACTIC\nRIM";
        else if (code === "TNG") titleBox.value = "The Measure of a Man";
        else titleBox.value = "EPISODE TITLE";
    }

    generateCard();
}

function goBack() {
    document.getElementById('picker-screen').style.display = 'block';
    document.getElementById('editor-screen').style.display = 'none';
}

async function generateCard() {
    if (!currentSeries) return;

    const textInput = document.getElementById('user-title').value;
    const writerInput = document.getElementById('user-writer').value || "JAMES SCHMERER";
    const tempIndex = document.getElementById('template-select').value || 0;
    const s = seriesData[currentSeries].templates[tempIndex];
    
    let title = "";
    if (currentSeries === "TOS" || currentSeries === "DS9" || currentSeries === "VOY") {
        title = `"${textInput.toUpperCase()}"`;
    } else if (currentSeries === "TNG") {
        title = `"${textInput}"`; 
    } else {
        title = textInput.toUpperCase();
    }

    await document.fonts.load(`${s.size}px "${s.font}"`);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `images/${s.bg}`; 

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        ctx.font = `${s.size}px "${s.font}"`;
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

    img.onerror = () => {
        console.error("Failed to load image: images/" + s.bg);
    };
}

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
    lines.forEach(line => {
        ctx.fillText(line, curX, curY);
        curY += size - 10; 
    });
    if (writer) {
        ctx.font = `${s.creditSize}px "${s.font}"`;
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
