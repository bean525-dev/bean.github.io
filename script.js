const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');
let currentSeries = "";

const BASE_HEIGHT = 1080;

const seriesData = {
    "TOS": {
        aspectRatio: "4:3",
        templates: [
            { name: "Planet Orbit", bg: "TOS_bg.jpg", font: "TOS-Font", color: "#ffff00", size: 120, x: 0.08, y: 0.15, indent: 120, spacing: 30 },
            { name: "Mirror Planet Orbit", bg: "TOS_mirror_orig.png", font: "TOS-Font", color: "#ffff00", size: 120, x: 0.08, y: 0.15, indent: 100, spacing: 20 },
			{ name: "Mirror Planet Orbit (Remastered)", bg: "TOS_mirror.png", font: "TOS-Font", color: "#ffff00", size: 120, x: 0.08, y: 0.15, indent: 100, spacing: 20 },
            { name: "Spock's Brain", bg: "TOS_spocksbrain.png", font: "TOS-Font", color: "#7da6ff", size: 160, x: 0.30, y: 0.68, indent: 75, spacing: 20 },
			{ name: "Spock's Brain (Remastered)", bg: "TOS_hull.png", font: "TOS-Font", color: "#7da6ff", size: 100, x: 0.25, y: 0.68, indent: 75, spacing: 20 },
            { name: "The Ultimate Computer", bg: "TOS_ultcomp_orig.png", font: "TOS-Font", color: "#dcb442", size: 160, x: 0.5, y: 0.22, spacing: 25, showCredit: true, creditSize: 130, writerSpacing: 70, centerText: true },
            { name: "The Tholian Web", bg: "TOS_tholian.png", font: "TOS-Font", color: "#7da6ff", size: 100, x: 0.20, y: 0.68, indent: 75, spacing: 20 }
        ]
    },
    "TAS": {
        aspectRatio: "4:3",
        templates: [
            { name: "Planet", bg: "TAS_bg.png", font: "TAS-Font", color: "#dcb442", size: 210, x: 0.12, y: 0.12, creditSize: 60, showCredit: true }
        ]
    },
    "TNG": {
        aspectRatio: "4:3",
        templates: [
            { name: "Standard", bg: "TNG_bg.jpg", font: "TNG-Font", color: "#5286ff", size: 86, x: 0.08, y: 0.12 }, 
            { name: "Alternate", bg: "TNG_enemy.png", font: "TNG-Font", color: "#5286ff", size: 86, x: 0.05, y: 0.08 },
            { name: "Asteroid", bg: "TNG_asteroid.png", font: "TNG-Font", color: "#5286ff", size: 86, x: 0.12, y: 0.12 }
        ]
    },
    "DS9": {
        aspectRatio: "4:3",
        templates: [            
            { name: "Station", bg: "DS9_bg.jpg", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 86, x: 0.1, y: 0.12 },
            { name: "Defiant", bg: "DS9_favor.png", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 86, x: 0.1, y: 0.12 },			
            { name: "Station View 2", bg: "DS9_adversary.png", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 86, x: 0.1, y: 0.12 },
			{ name: "Runabout", bg: "DS9_runabout.png", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 86, x: 0.1, y: 0.12 },
            { name: "Station View 3", bg: "DS9_shakaar.png", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 86, x: 0.12, y: 0.10 }
        ]
    },
    "VOY": {
        aspectRatio: "4:3",
        templates: [            
            { name: "Zoomed Out", bg: "VOY_bg.jpg", font: "VOY-Font", top: "#ff4f00", bottom: "#ffcc99", size: 90, x: 0.08, y: 0.12 },
            { name: "Underside", bg: "VOY_latent.png", font: "VOY-Font", top: "#ff4f00", bottom: "#ffcc99", size: 90, x: 0.12, y: 0.08 },
            { name: "Overview", bg: "VOY_facto.png", font: "Galaxy-Font", top: "#ff4f00", bottom: "#ffcc99", size: 82, x: 0.08, y: 0.12 }
        ]
    },
    "ENT": {
        aspectRatio: "16:9",
        templates: [            
            { name: "Overhead", bg: "ENT_andorian.png", font: "ENT-Font", top: "#f9f9f9", bottom: "#7d7d7d", size: 60, x: 0.08, y: 0.12 },
            { name: "Side View", bg: "ENT_proving.png", font: "ENT-Font", top: "#f9f9f9", bottom: "#7d7d7d", size: 60, x: 0.08, y: 0.08 },
            { name: "Battle Damage", bg: "ENT_stormfront.png", font: "ENT-Font", top: "#f9f9f9", bottom: "#7d7d7d", size: 50, x: 0.06, y: 0.08 }
        ]
    },
    "LD": {
        aspectRatio: "16:9",
        templates: [            
            { name: "With Shuttle", bg: "LD_2nd.png", font: "TNG-Font", top: "#5286ff", bottom: "#5286ff", size: 82, x: 0.08, y: 0.12 },
            { name: "Full View", bg: "LD_flee.png", font: "TNG-Font", top: "#5286ff", bottom: "#5286ff", size: 82, x: 0.08, y: 0.08 },
            { name: "Planet", bg: "LD_dilated.png", font: "TNG-Font", top: "#5286ff", bottom: "#5286ff", size: 75, x: 0.10, y: 0.16 }
        ]
    }
};

function setupListeners() {
    const inputs = [
        'user-title', 'user-writer', 'template-select', 'user-font-size', 'user-writer-size',
        'user-color-1', 'user-color-2', 'user-voy-font', 'user-tos-font',
        'user-word-wrap', 'user-retro-filter'
    ];
    
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.removeEventListener('input', generateCard);
            el.addEventListener('input', generateCard);
            el.removeEventListener('change', generateCard);
            el.addEventListener('change', generateCard);
        }
    });

    const reset1 = document.getElementById('reset-color-1');
    if (reset1) {
        reset1.onclick = () => {
            const c1 = document.getElementById('user-color-1');
            if (c1) c1.dataset.override = "false";
            syncColorPickers();
            generateCard();
        };
    }

    const reset2 = document.getElementById('reset-color-2');
    if (reset2) {
        reset2.onclick = () => {
            const c2 = document.getElementById('user-color-2');
            if (c2) c2.dataset.override = "false";
            syncColorPickers();
            generateCard();
        };
    }
    
    const color1 = document.getElementById('user-color-1');
    if (color1) {
        color1.oninput = () => {
            color1.dataset.override = "true";
            generateCard();
        };
    }

    const color2 = document.getElementById('user-color-2');
    if (color2) {
        color2.oninput = () => {
            color2.dataset.override = "true";
            generateCard();
        };
    }
}

function syncColorPickers() {
    if (!currentSeries) return;
    const tempIndex = document.getElementById('template-select').value || 0;
    const s = seriesData[currentSeries].templates[tempIndex];
    
    const color1Input = document.getElementById('user-color-1');
    const color2Input = document.getElementById('user-color-2');

    if (color1Input && color1Input.dataset.override !== "true") {
        color1Input.value = s.top ? s.top : (s.color ? s.color : "#ffffff");
    }
    if (color2Input && color2Input.dataset.override !== "true") {
        color2Input.value = s.bottom ? s.bottom : "#ffffff";
    }
}

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

    const tempIndex = select.value || 0;
    const initialTemplate = seriesData[code].templates[tempIndex];
    
    const writerGroup = document.getElementById('writer-group');
    if (writerGroup) writerGroup.style.display = (initialTemplate.showCredit) ? "block" : "none";

    const writerSizeGroup = document.getElementById('writer-size-group');
    if (writerSizeGroup) writerSizeGroup.style.display = (initialTemplate.showCredit) ? "block" : "none";

    const voyFontGroup = document.getElementById('voyager-font-group');
    if (voyFontGroup) voyFontGroup.style.display = (code === "VOY") ? "block" : "none";
    const voyFontSelect = document.getElementById('user-voy-font');
    if (voyFontSelect) voyFontSelect.value = "default";

    const tosFontGroup = document.getElementById('tos-font-group');
    if (tosFontGroup) tosFontGroup.style.display = (code === "TOS") ? "block" : "none";
    const tosFontSelect = document.getElementById('user-tos-font');
    if (tosFontSelect) tosFontSelect.value = "default";

    const sizeInput = document.getElementById('user-font-size');
    if (sizeInput) sizeInput.value = "";

    const writerSizeInput = document.getElementById('user-writer-size');
    if (writerSizeInput) writerSizeInput.value = "";

    const color1Input = document.getElementById('user-color-1');
    const color2Input = document.getElementById('user-color-2');
    if (color1Input) color1Input.dataset.override = "false";
    if (color2Input) color2Input.dataset.override = "false";

    select.onchange = () => {
        const currentTempIndex = document.getElementById('template-select').value || 0;
        const currentTemplate = seriesData[currentSeries].templates[currentTempIndex];
        if (writerGroup) writerGroup.style.display = (currentTemplate.showCredit) ? "block" : "none";
        if (writerSizeGroup) writerSizeGroup.style.display = (currentTemplate.showCredit) ? "block" : "none";
        syncColorPickers();
        generateCard();
    };

    const titleBox = document.getElementById('user-title');
    if (code === "TOS") titleBox.value = "THE CITY ON\nTHE EDGE OF FOREVER";
    else if (code === "TAS") titleBox.value = "THE VOID\nOF THE\nGALACTIC\nRIM";
    else if (code === "TNG") titleBox.value = "The Measure of a Man";
    else if (code === "DS9") titleBox.value = "In the Pale Moonlight";
    else if (code === "VOY") titleBox.value = "Threshold";
    else if (code === "ENT") titleBox.value = "The Andorian Incident";
    else if (code === "LD") titleBox.value = "Second Contact";
    else titleBox.value = "EPISODE TITLE";

    syncColorPickers();
    setupListeners(); 
    generateCard();

    if (!history.state || history.state.page !== 'editor') {
        history.pushState({ page: 'editor' }, 'Editor', '#editor');
    }
}

function goBack() {
    if (history.state && history.state.page === 'editor') {
        history.back();
    } else {
        document.getElementById('picker-screen').style.display = 'block';
        document.getElementById('editor-screen').style.display = 'none';
    }
}

window.addEventListener('popstate', function(event) {
    if (!event.state || event.state.page !== 'editor') {
        document.getElementById('picker-screen').style.display = 'block';
        document.getElementById('editor-screen').style.display = 'none';
    }
});

async function generateCard() {
    if (!currentSeries) return;

    const textInput = document.getElementById('user-title').value;
    const writerElem = document.getElementById('user-writer');
    const writerInput = (writerElem) ? writerElem.value : "";
    const tempIndex = document.getElementById('template-select').value || 0;
    const s = seriesData[currentSeries].templates[tempIndex];
    
    const writerGroup = document.getElementById('writer-group');
    if (writerGroup) {
        writerGroup.style.display = (s.showCredit) ? "block" : "none";
    }

    const writerSizeGroup = document.getElementById('writer-size-group');
    if (writerSizeGroup) {
        writerSizeGroup.style.display = (s.showCredit) ? "block" : "none";
    }

    const color1Input = document.getElementById('user-color-1');
    const color2Input = document.getElementById('user-color-2');

    const isColor1Override = color1Input && color1Input.dataset.override === "true";
    const isColor2Override = color2Input && color2Input.dataset.override === "true";

    const color2Group = document.getElementById('color-2-group');
    if (color2Group) {
        color2Group.style.display = (s.top || isColor1Override) ? "block" : "none";
    }

    const userSize = document.getElementById('user-font-size').value;
    const activeSize = (userSize && userSize > 0) ? parseInt(userSize) : s.size;

    const userWriterSize = document.getElementById('user-writer-size').value;
    const activeWriterSize = (userWriterSize && userWriterSize > 0) ? parseInt(userWriterSize) : (s.creditSize || 40);

    let activeColor1 = s.color || s.top;
    let activeColor2 = s.bottom || null;

    if (isColor1Override) activeColor1 = color1Input.value;
    if (isColor2Override) activeColor2 = color2Input.value;
    if (isColor1Override && !isColor2Override && !s.bottom) activeColor2 = null;

    let activeFont = s.font;
    if (currentSeries === "VOY") {
        const userVoyFont = document.getElementById('user-voy-font').value;
        if (userVoyFont !== "default") {
            activeFont = userVoyFont;
        }
    } else if (currentSeries === "TOS") {
        const userTosFont = document.getElementById('user-tos-font').value;
        if (userTosFont && userTosFont !== "default") {
            activeFont = userTosFont;
        }
    }

    let title = (currentSeries === "TNG" || currentSeries === "ENT" || currentSeries === "LD") ? textInput : textInput.toUpperCase();

    try {
        await document.fonts.load(`${activeSize}px "${activeFont}"`);
        if (s.showCredit) {
            await document.fonts.load(`${activeWriterSize}px "${activeFont}"`);
        }
    } catch (e) {}

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `images/${s.bg}`; 

    img.onload = () => {
        const ratio = seriesData[currentSeries].aspectRatio || "4:3";
        const currentWidth = (ratio === "16:9") ? 1920 : 1440;
        const currentHeight = BASE_HEIGHT;

        canvas.width = currentWidth;
        canvas.height = currentHeight;
        
        ctx.drawImage(img, 0, 0, currentWidth, currentHeight);
        
        ctx.font = `${activeSize}px "${activeFont}", Arial, sans-serif`;
        ctx.textBaseline = "top";
        ctx.textAlign = "left";

        const styleObject = {
            size: activeSize,
            font: activeFont,
            color: activeColor1,
            top: activeColor1,
            bottom: activeColor2,
            x: s.x,
            y: s.y,
            spacing: s.spacing,
            creditSize: activeWriterSize,
            centerText: s.centerText || false,
            writerSpacing: s.writerSpacing || 40
        };

        const filterCheck = document.getElementById('user-retro-filter');
        if (filterCheck && filterCheck.checked) {
            ctx.filter = 'blur(2.2px) contrast(1.05)';
        } else {
            ctx.filter = 'none';
        }

        if (currentSeries === "TOS") {
            const maxW = currentWidth * 0.92;
            drawTOS(title, writerInput, styleObject, activeSize, maxW);
        } else if (currentSeries === "TAS") {
            const maxW = currentWidth * 0.88;
            drawTAS(title, writerInput, styleObject, activeSize, maxW);
        } else {
            const maxW = currentWidth * 0.92;
            drawStandard(title, styleObject, activeSize, maxW);
        }
        
        ctx.filter = 'none';

        const mobileOverlay = document.getElementById('mobileDownloadOverlay');
        if (mobileOverlay) {
            canvas.toBlob((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                mobileOverlay.src = blobUrl;

                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    mobileOverlay.style.pointerEvents = "auto";
                } else {
                    mobileOverlay.style.pointerEvents = "none";
                }
            }, 'image/png');
        }
    };
}

function processLayoutLines(text, startX, maxWidth) {
    const wrapCheck = document.getElementById('user-word-wrap');
    const shouldWrap = wrapCheck ? wrapCheck.checked : true;
    
    let paragraphs = text.split('\n');
    if (!shouldWrap) return paragraphs;
    
    let finalLines = [];
    paragraphs.forEach(para => {
        if (para.trim() === "") {
            finalLines.push("");
            return;
        }
        let words = para.split(' ');
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            let testLine = currentLine + " " + words[i];
            let metrics = ctx.measureText(testLine);
            if (startX + metrics.width > maxWidth) {
                finalLines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        finalLines.push(currentLine);
    });
    return finalLines;
}

function formatQuotesForLines(linesArray) {
    let firstTextLineIndex = -1;
    let lastTextLineIndex = -1;
    
    linesArray.forEach((line, index) => {
        if (line.trim() !== "") {
            if (firstTextLineIndex === -1) firstTextLineIndex = index;
            lastTextLineIndex = index;
        }
    });

    if (firstTextLineIndex === -1) return linesArray;

    return linesArray.map((line, index) => {
        let processedLine = line;
        if (index === firstTextLineIndex) {
            const leadingSpaces = line.match(/^\s*/)[0];
            const content = line.trimStart();
            processedLine = `${leadingSpaces}"${content}`;
        }
        if (index === lastTextLineIndex) {
            processedLine = `${processedLine}"`;
        }
        return processedLine;
    });
}

function applyShadowSettings(offset) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
    ctx.shadowBlur = offset * 1.5;
    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;
}

function clearShadowSettings() {
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = "rgba(0,0,0,0)";
}

function drawTOS(text, writer, s, size, maxW) {
    const curX = s.centerText ? (canvas.width / 2) : (canvas.width * s.x);
    const rawLines = processLayoutLines(text, s.centerText ? (canvas.width * 0.08) : (canvas.width * s.x), maxW);
    const lines = formatQuotesForLines(rawLines);
    
    let curY = canvas.height * s.y;
    const spacing = s.spacing || 20;
    
    ctx.textAlign = s.centerText ? "center" : "left";
    
    lines.forEach(line => {
        if (s.bottom) {
            let grad = ctx.createLinearGradient(curX, curY, curX, curY + size);
            grad.addColorStop(0, s.top);
            grad.addColorStop(1, s.bottom);
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = s.color;
        }
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        applyShadowSettings(6);
        ctx.fillText(line, curX + 4, curY + 4);
        clearShadowSettings();
        
        if (s.bottom) {
            let grad = ctx.createLinearGradient(curX, curY, curX, curY + size);
            grad.addColorStop(0, s.top);
            grad.addColorStop(1, s.bottom);
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = s.color;
        }
        ctx.fillText(line, curX, curY);
        curY += size + spacing;
    });

    if (writer && writer.trim() !== "" && s.creditSize) {
        curY += s.writerSpacing;
        
        const labelSize = Math.round(s.creditSize * 0.65);
        ctx.font = `${labelSize}px "${s.font}", Arial, sans-serif`;
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        applyShadowSettings(6);
        ctx.fillText("WRITTEN BY", curX + 4, curY + 4);
        clearShadowSettings();
        
        ctx.fillStyle = s.bottom ? s.top : s.color;
        ctx.fillText("WRITTEN BY", curX, curY);
        
        curY += labelSize + 10; 
        
        ctx.font = `${s.creditSize}px "${s.font}", Arial, sans-serif`;
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        applyShadowSettings(6);
        ctx.fillText(writer.toUpperCase(), curX + 4, curY + 4);
        clearShadowSettings();
        
        if (s.bottom) {
            let grad = ctx.createLinearGradient(curX, curY, curX, curY + s.creditSize);
            grad.addColorStop(0, s.top);
            grad.addColorStop(1, s.bottom);
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = s.color;
        }
        ctx.fillText(writer.toUpperCase(), curX, curY);
    }
}

function drawTAS(text, writer, s, size, maxW) {
    const curX = canvas.width * s.x;
    const lines = processLayoutLines(text, curX, maxW);
    
    let curY = canvas.height * s.y;
    const lineHeight = size * 0.8; 
    
    clearShadowSettings();
    
    lines.forEach(line => {
        if (s.bottom) {
            let grad = ctx.createLinearGradient(curX, curY, curX, curY + size);
            grad.addColorStop(0, s.top);
            grad.addColorStop(1, s.bottom);
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = s.color;
        }
        
        ctx.fillText(line, curX, curY);
        curY += lineHeight; 
    });
    
    if (writer && writer.trim() !== "") {
        ctx.font = `${s.creditSize}px "${s.font}", Arial, sans-serif`;
        ctx.textAlign = "center";
        
        const creditX = canvas.width * 0.5;
        const creditY = canvas.height * 0.88;
        if (s.bottom) {
            let grad = ctx.createLinearGradient(creditX, creditY, creditX, creditY + s.creditSize);
            grad.addColorStop(0, s.top);
            grad.addColorStop(1, s.bottom);
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = s.color;
        }
        
        ctx.fillText(`WRITTEN BY ${writer.toUpperCase()}`, creditX, creditY);
    }
}

function drawStandard(text, s, size, maxW) {
    const curX = canvas.width * s.x;
    const rawLines = processLayoutLines(text, curX, maxW);
    const lines = formatQuotesForLines(rawLines);
    
    let curY = canvas.height * s.y;
    let shadowY = canvas.height * s.y;
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    applyShadowSettings(6);
    
    lines.forEach(line => {
        ctx.fillText(line, curX + 4, shadowY + 4);
        shadowY += size + 10;
    });
    clearShadowSettings();
    
    lines.forEach(line => {
        if (s.bottom) {
            let grad = ctx.createLinearGradient(curX, curY, curX, curY + size);
            grad.addColorStop(0, s.top);
            grad.addColorStop(1, s.bottom);
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = s.color;
        }
        ctx.fillText(line, curX, curY);
        curY += size + 10;
    });
}

async function downloadImage() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && navigator.canShare) {
        try {
            const dataUrl = canvas.toDataURL('image/png');
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], 'star-trek-title-card.png', { type: 'image/png' });
            
            if (navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Star Trek Title Card',
                    text: 'Check out my custom episode title card!'
                });
                return;
            }
        } catch (error) {
            console.log('Native share failed or dismissed: ', error);
        }
    }

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `trek-title.png`;
    link.href = dataUrl;
    link.click();
}