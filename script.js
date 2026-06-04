const canvas = document.getElementById('titleCanvas');
const ctx = canvas.getContext('2d');
let currentSeries = "";

const BASE_HEIGHT = 1080;

const textureCache = {};
let debounceTimer = null;
let isTyping = false;

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
            { name: "Station View 3", bg: "DS9_shakaar.png", font: "DS9-Font", top: "#e0e0e0", bottom: "#7da6ff", size: 82, x: 0.12, y: 0.10 }
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
    "DIS": {
        aspectRatio: "16:9",
        templates: [            
            { name: "Discovery Titles", bg: "DIS_titles.png", font: "DIS-Font", top: "#0f0b0e", bottom: "#0f0b0e", size: 65, x: 0.08, y: 0.7 },
            { name: "Past Is Prologue", bg: "DIS_pastpro.png", font: "DIS-Font", top: "#0f0b0e", bottom: "#0f0b0e", size: 65, x: 0.08, y: 0.08 },
            { name: "Will You Take My Hand", bg: "DIS_takehand.png", font: "DIS-Font", top: "#f9f9f9", bottom: "#7d7d7d", size: 65, x: 0.06, y: 0.08 }
        ]
    },    
	"ST": {
        aspectRatio: "2.39:1",
        templates: [
            { name: "Calypso", bg: "ST_calypso_bg.png", texture: "ST_calypso_txt.png", font: "ST-Font", size: 380, style: "masked" },
            { name: "Ephraim and Dot", bg: "ST_ephraim.png", font: "ST-Font", top: "#bd1616", bottom: "#7d0003", size: 380, style: "shadow-stroke" },
            { name: "The Escape Artist", bg: "ST_escape_bg.png", font: "ST-Font", top: "#970000", bottom: "#7d0003", size: 360, style: "echo" },
            { name: "Runaway", bg: "ST_ephraim.png", texture: "ST_runaway_texture.png", font: "ST-Font", top: "#e03a3a", size: 360, style: "masked" },            
			{ name: "The Girl Who Made the Stars", bg: "ST_stars_bg.png", texture: "ST_girlstars_texture2.png", font: "ST-Font", top: "#ffffff", bottom: "#ffffff", size: 360, style: "masked-cosmic", hideGradients: true }
        ]
    },	
    "PRO": {
        aspectRatio: "2.39:1",
        templates: [
            { name: "Nebula", bg: "PRO_titles.png", font: "PRO-Font", top: "#ffffff", bottom: "#ffffff", size: 70, showCredit: true, creditSize: 50, centerText: true },
			{ name: "Protostar", bg: "PRO_protostar.png", font: "PRO-Font", top: "#ffffff", bottom: "#ffffff", size: 82, x: 0.08, y: 0.12 } ,
			{ name: "Protostar 2", bg: "PRO_protostar2.png", font: "PRO-Font", top: "#ffffff", bottom: "#ffffff", size: 82, x: 0.08, y: 0.12 } ,
			{ name: "Voyager-A/Protostar", bg: "PRO_provoya.png", font: "PRO-Font", top: "#ffffff", bottom: "#ffffff", size: 82, x: 0.08, y: 0.12 } ,
			{ name: "Voyager-A Solo", bg: "PRO_voyager_a.png", font: "PRO-Font", top: "#ffffff", bottom: "#ffffff", size: 82, x: 0.08, y: 0.12 }
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

function handleTextInput() {
    isTyping = true;
    generateCard();

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        isTyping = false;
        generateCard();
    }, 250);
}

function setupListeners() {
    const textInputs = ['user-title', 'user-writer'];
    const standardInputs = [
        'template-select', 'user-font-size', 'user-writer-size',
        'user-color-1', 'user-color-2', 'user-voy-font', 'user-tos-font',
        'user-word-wrap', 'user-retro-filter'
    ];
    
    textInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.removeEventListener('input', handleTextInput);
            el.addEventListener('input', handleTextInput);
            el.removeEventListener('change', generateCard);
            el.addEventListener('change', generateCard);
        }
    });

    standardInputs.forEach(id => {
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
    if (!s) return;
    
    const color1Input = document.getElementById('user-color-1');
    const color2Input = document.getElementById('user-color-2');

    if (color1Input && color1Input.dataset.override !== "true") {
        color1Input.value = s.top ? s.top : (s.color ? s.color : "#ffffff");
    }
    if (color2Input && color2Input.dataset.override !== "true") {
        color2Input.value = s.bottom ? s.bottom : "#ffffff";
    }
}

function updateControlVisibility(currentTemplate, code) {
    const color1Input = document.getElementById('user-color-1');
    const color2Input = document.getElementById('user-color-2');
    
    let color1Group = document.getElementById('color-1-group') || color1Input?.parentElement;
    let color2Group = document.getElementById('color-2-group') || color2Input?.parentElement;
    
    if (color1Group && color1Group.classList.contains('control-group') === false && color1Group.parentElement?.classList.contains('control-group')) {
        color1Group = color1Group.parentElement;
    }
    if (color2Group && color2Group.classList.contains('control-group') === false && color2Group.parentElement?.classList.contains('control-group')) {
        color2Group = color2Group.parentElement;
    }

    const labels = Array.from(document.querySelectorAll('label'));
    const color1Label = labels.find(el => {
        const text = el.innerText.toLowerCase();
        return text.includes('color (top)') || text.includes('gradient top') || text.includes('color 1') || text.includes('text color');
    });
    const color2Label = labels.find(el => {
        const text = el.innerText.toLowerCase();
        return text.includes('color (bottom)') || text.includes('gradient bottom') || text.includes('color 2');
    });

    const finalGroup1 = color1Label?.closest('.control-group') || color1Label?.parentElement || color1Group;
    const finalGroup2 = color2Label?.closest('.control-group') || color2Label?.parentElement || color2Group;

    if (currentTemplate.hideGradients) {
        if (finalGroup1) finalGroup1.style.display = 'none';
        if (finalGroup2) finalGroup2.style.display = 'none';
        
        if (color1Input) color1Input.value = "#ffffff";
        if (color2Input) color2Input.value = "";
    } else {
        if (finalGroup1) finalGroup1.style.display = 'block';
        if (finalGroup2) {
            const isColor1Override = color1Input?.dataset.override === "true";
            finalGroup2.style.display = (currentTemplate.top || isColor1Override) ? "block" : "none";
        }
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
        updateControlVisibility(currentTemplate, currentSeries);
        syncColorPickers();
        generateCard();
    };

    const titleBox = document.getElementById('user-title');
    const writerBox = document.getElementById('user-writer');
    
    if (code === "TOS") titleBox.value = "THE CITY ON\nTHE EDGE OF FOREVER";
    else if (code === "TAS") titleBox.value = "THE VOID\nOF THE\nGALACTIC\nRIM";
    else if (code === "TNG") titleBox.value = "The Measure of a Man";
    else if (code === "DS9") titleBox.value = "In the Pale Moonlight";
    else if (code === "VOY") titleBox.value = "Threshold";
    else if (code === "ENT") titleBox.value = "The Andorian Incident";
	else if (code === "DIS") titleBox.value = "What's Past Is Prologue";
    else if (code === "ST") titleBox.value = "Calypso";
    else if (code === "PRO") {
        titleBox.value = "Preludes";
        if (writerBox) writerBox.value = "Julie Benson\nShawna Benson\nKevin & Dan Hageman\nNikhil S. Jayaram";
    }
    else if (code === "LD") titleBox.value = "Second Contact";
    else titleBox.value = "EPISODE TITLE";

    if (code !== "PRO" && writerBox) writerBox.value = "";

    updateControlVisibility(initialTemplate, code);
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
        document.getElementById('editor-screen').style.none = 'none';
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
    if (!s) return;
    
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

    updateControlVisibility(s, currentSeries);

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
        const ratioParts = ratio.split(':');
        const ratioWidth = parseFloat(ratioParts[0]);
        const ratioHeight = parseFloat(ratioParts[1]);
        
        const currentHeight = BASE_HEIGHT;
        const currentWidth = Math.round(currentHeight * (ratioWidth / ratioHeight));

        canvas.width = currentWidth;
        canvas.height = currentHeight;
        
        ctx.drawImage(img, 0, 0, currentWidth, currentHeight);
        
        ctx.font = `${activeSize}px "${activeFont}", Arial, sans-serif`;
        ctx.textBaseline = "top";
        ctx.textAlign = "left"

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
            writerSpacing: s.writerSpacing || 40,
            style: s.style,
            texture: s.texture
        };

        const filterCheck = document.getElementById('user-retro-filter');
        if (filterCheck && filterCheck.checked) {
            ctx.filter = 'blur(2.2px) contrast(1.05)';
        } else {
            ctx.filter = 'none';
        }

        const maxW = currentWidth * 0.92;

        if (currentSeries === "TOS") {
            drawTOS(title, writerInput, styleObject, activeSize, maxW);
        } else if (currentSeries === "TAS") {
            drawTAS(title, writerInput, styleObject, activeSize, maxW);
		} else if (currentSeries === "DIS") {
            drawDiscovery(title, styleObject, activeSize, maxW, s.lineHeightFactor || 0.65);	
        } else if (currentSeries === "ST") {
            drawShortTreks(title, styleObject, activeSize, maxW);
        } else if (currentSeries === "PRO" && s.centerText) {
            drawProdigy(title, writerInput, styleObject, activeSize, maxW);
        } else {
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

function drawDiscovery(text, s, size, maxW, lineHeightFactor) {
    const curX = canvas.width * s.x;
    const rawLines = processLayoutLines(text, curX, maxW);
    const lines = formatQuotesForLines(rawLines);
    
    let curY = canvas.height * s.y;   
    const stepY = size * lineHeightFactor;    
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
        curY += stepY;
    });
}

function drawShortTreks(text, s, size, maxW) {
    const curX = canvas.width / 2;
    const rawLines = processLayoutLines(text, canvas.width * 0.05, maxW);
    const lines = rawLines;
    
    const lineHeight = size * 1.1;
    const totalTextHeight = lines.length * lineHeight;
    let curY = (canvas.height - totalTextHeight) / 2 + 40;

    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    if (s.style === "shadow-stroke") {
        ctx.font = `${size}px "${s.font}", Arial, sans-serif`;
        lines.forEach(line => {
            ctx.fillStyle = "#ffffff";
            ctx.fillText(line, curX + 3, curY + 3);
            if (s.bottom) {
                let grad = ctx.createLinearGradient(curX, curY, curX, curY + size);
                grad.addColorStop(0, s.top);
                grad.addColorStop(1, s.bottom);
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = s.color || s.top;
            }
            ctx.fillText(line, curX, curY);
            curY += lineHeight;
        });
    } else if (s.style === "echo") {
        ctx.font = `${size}px "${s.font}", Arial, sans-serif`;
        lines.forEach(line => {
            ctx.save();
            ctx.globalAlpha = 0.35;
            ctx.filter = "blur(4px)";
            ctx.fillStyle = s.top || "#d63031"; 
            ctx.fillText(line, curX - 25, curY - 35);
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = 0.25;
            ctx.filter = "blur(8px)";
            ctx.fillStyle = s.bottom || "#0984e3"; 
            ctx.fillText(line, curX + 20, curY + 45);
            ctx.restore();

            ctx.filter = "none";
            ctx.fillStyle = s.top || s.color;
            ctx.fillText(line, curX, curY);
            curY += lineHeight;
        });
    } else if (s.style === "masked" || s.style === "masked-glow") {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = canvas.width;
        offCanvas.height = canvas.height;
        const octx = offCanvas.getContext('2d');

        octx.font = `${size}px "${s.font}", Arial, sans-serif`;
        octx.textAlign = "center";
        octx.textBaseline = "top";
        octx.fillStyle = "#ffffff";

        let textY = curY;
        lines.forEach(line => {
            octx.fillText(line, curX, textY);
            textY += lineHeight;
        });

        if (s.texture) {
            const texImg = new Image();
            texImg.crossOrigin = "anonymous";
            texImg.src = `images/${s.texture}`;
            texImg.onload = () => {
                octx.save();
                octx.globalCompositeOperation = "source-in";
                octx.drawImage(texImg, 0, 0, canvas.width, canvas.height);
                octx.restore();

                if (s.style === "masked-glow") {
                    ctx.save();
                    ctx.filter = "blur(12px)";
                    ctx.globalAlpha = 0.6;
                    ctx.drawImage(offCanvas, 0, 0);
                    ctx.restore();
                }
                ctx.drawImage(offCanvas, 0, 0);

                if (s.top) {
                    ctx.save();
                    ctx.font = `${size}px "${s.font}", Arial, sans-serif`;
                    ctx.textBaseline = "top";
                    ctx.textAlign = "center";
                    
                    let strokeY = curY;
                    lines.forEach(line => {
                        ctx.save();                        
                        
                        if (s.bottom) {
                            ctx.shadowBlur = 6;
                            ctx.shadowColor = s.bottom;
                        }
                        
                        ctx.strokeStyle = s.top;
                        ctx.lineWidth = 1;
                        ctx.globalAlpha = 0.4;
                        ctx.strokeText(line, curX, strokeY);
                        ctx.restore(); 

                        ctx.save();
                        ctx.strokeStyle = s.top;
                        ctx.lineWidth = 1;
                        ctx.globalAlpha = 0.15;
                        
                        ctx.strokeText(line, curX - 15, strokeY);
                        ctx.strokeText(line, curX + 15, strokeY);
                        ctx.strokeText(line, curX, strokeY - 8);
                        ctx.strokeText(line, curX, strokeY + 8);
                        
                        let hash = 0;
                        for (let i = 0; i < line.length; i++) {
                            hash = line.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        const getSeededValue = (seedMod, min, max) => {
                            const val = Math.abs(Math.sin(hash + seedMod));
                            return min + val * (max - min);
                        };

                        ctx.font = `${size * 0.06}px sans-serif`;
                        ctx.fillStyle = s.top;
                        ctx.globalAlpha = 0.5;
                        
                        const totalMetrics = ctx.measureText(line);
                        const leftEdge = curX - (totalMetrics.width / 2);
                        const rightEdge = curX + (totalMetrics.width / 2);
                        
                        ctx.fillText(getSeededValue(1, 10, 99).toFixed(1), leftEdge - 20, strokeY + (size * 0.2));
                        ctx.fillText("FIG.0" + Math.floor(getSeededValue(2, 1, 9)), rightEdge + 5, strokeY + (size * 0.1));
                        ctx.fillText(Math.floor(getSeededValue(3, 100, 999)).toString(), rightEdge - 40, strokeY + (size * 0.75));

                        ctx.restore();
                        strokeY += lineHeight;
                    });
                    ctx.restore();
                }
            };
            if (texImg.complete) texImg.onload();
        }
    } else if (s.style === "masked-cosmic") {
        if (isTyping) {
            ctx.font = `${size}px "${s.font}", Arial, sans-serif`;
            ctx.fillStyle = "#ffffff";
            let fallbackY = curY;
            lines.forEach(line => {
                ctx.fillText(line, curX, fallbackY);
                fallbackY += lineHeight;
            });
            return;
        }

        const offCanvas = document.createElement('canvas');
        offCanvas.width = canvas.width;
        offCanvas.height = canvas.height;
        const octx = offCanvas.getContext('2d');

        octx.font = `${size}px "${s.font}", Arial, sans-serif`;
        octx.textAlign = "center";
        octx.textBaseline = "top";
        octx.fillStyle = "#ffffff";

        let textY = curY;
        lines.forEach(line => {
            octx.fillText(line, curX, textY);
            textY += lineHeight;
        });

        if (s.texture) {
            const runScanner = (loadedImg) => {
                octx.save();
                octx.globalCompositeOperation = "source-in";
                octx.filter = "brightness(1.8) contrast(1.5)";
                
                const pattern = octx.createPattern(loadedImg, 'repeat');
                octx.fillStyle = pattern;
                octx.fillRect(0, 0, canvas.width, canvas.height);
                
                octx.filter = "none";
                octx.restore();

                const edgeCanvas = document.createElement('canvas');
                edgeCanvas.width = canvas.width;
                edgeCanvas.height = canvas.height;
                const ectx = edgeCanvas.getContext('2d');

                ectx.font = `${size}px "${s.font}", Arial, sans-serif`;
                ectx.textAlign = "center";
                ectx.textBaseline = "top";
                ectx.strokeStyle = "#ffffff";
                ectx.lineWidth = 4;

                let edgeY = curY;
                lines.forEach(line => {
                    ectx.strokeText(line, curX, edgeY);
                    edgeY += lineHeight;
                });

                const edgeImgData = ectx.getImageData(0, 0, canvas.width, canvas.height);
                const edgePixels = edgeImgData.data;

                const textImgData = octx.getImageData(0, 0, canvas.width, canvas.height);
                const textPixels = textImgData.data;
                
                const normalEdgePoints = [];
                const wordEndEdgePoints = [];

                let currentWordY = curY;
                lines.forEach(line => {
                    const words = line.split(' ');
                    let accumulatedText = "";

                    ctx.font = `${size}px "${s.font}", Arial, sans-serif`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";

                    words.forEach((word, index) => {
                        if (!word) return;
                        
                        const priorMetrics = ctx.measureText(accumulatedText);
                        const wordMetrics = ctx.measureText(word);
                        const totalLineMetrics = ctx.measureText(line);
                        
                        const lineLeftEdge = curX - (totalLineMetrics.width / 2);
                        const wordLeft = lineLeftEdge + priorMetrics.width;
                        const wordRight = wordLeft + wordMetrics.width;

                        const scanPaddingX = 40; 
                        const startX = Math.floor(wordRight - scanPaddingX);
                        const endX = Math.ceil(wordRight + scanPaddingX);
                        
                        const startY = Math.floor(currentWordY - (size * 0.50));
                        const endY = Math.ceil(currentWordY + size + (size * 0.50));

                        for (let y = startY; y < endY; y += 2) {
                            if (y >= canvas.height || y < 0) continue;
                            
                            for (let x = endX; x >= startX; x -= 2) {
                                if (x >= canvas.width || x < 0) continue;

                                const alphaIndex = ((y * canvas.width) + x) * 4 + 3;
                                const nextAlphaIndex = ((y * canvas.width) + (x + 2)) * 4 + 3;

                                if (edgePixels[alphaIndex] > 100 && edgePixels[nextAlphaIndex] < 150) {
                                    wordEndEdgePoints.push({ x, y });
                                    break; 
                                }
                            }
                        }

                        accumulatedText += word + " ";
                    });
                    currentWordY += lineHeight;
                });

                for (let y = 0; y < canvas.height; y += 2) {
                    for (let x = 0; x < canvas.width - 2; x += 2) {
                        const alphaIndex = ((y * canvas.width) + x) * 4 + 3;
                        const nextAlphaIndex = ((y * canvas.width) + (x + 2)) * 4 + 3;

                        if (edgePixels[alphaIndex] > 100 && edgePixels[nextAlphaIndex] < 150) {
                            const isWordEnd = wordEndEdgePoints.some(p => Math.abs(p.x - x) <= 2 && p.y === y);
                            if (!isWordEnd) {
                                normalEdgePoints.push({ x, y });
                            }
                        }
                    }
                }

                ctx.drawImage(offCanvas, 0, 0);

                ctx.save();
                ctx.globalCompositeOperation = "screen";

                const spawnTrail = (pointsArray, particleRatio, maxLength) => {
                    const spawnCount = pointsArray.length * particleRatio;
                    for (let i = 0; i < spawnCount; i++) {
                        const basePoint = pointsArray[Math.floor(Math.random() * pointsArray.length)];
                        const progress = Math.random();

                        const driftX = progress * maxLength * (0.4 + Math.random() * 0.6);
                        const driftY = ((Math.random() - 0.5) * 16 * progress) - (progress * 4);

                        const finalX = basePoint.x + driftX;
                        const finalY = basePoint.y + driftY;

                        const alpha = (1.0 - progress) * (0.15 + Math.random() * 0.5);
                        
                        const lookupX = Math.min(canvas.width - 1, Math.max(0, Math.floor(basePoint.x)));
                        const lookupY = Math.min(canvas.height - 1, Math.max(0, Math.floor(basePoint.y)));
                        const pixelPos = ((lookupY * canvas.width) + lookupX) * 4;
                        
                        let r = textPixels[pixelPos];
                        let g = textPixels[pixelPos + 1];
                        let b = textPixels[pixelPos + 2];
                        let textAlpha = textPixels[pixelPos + 3];

                        if (textAlpha < 30) {
                            r = 255; g = 255; b = 255;
                        }

                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

                        const particleSize = Math.random() * 1.8 + 0.4;

                        ctx.beginPath();
                        ctx.arc(finalX, finalY, particleSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                };

                if (normalEdgePoints.length > 0) {
                    spawnTrail(normalEdgePoints, 0.6, 35);
                }

                if (wordEndEdgePoints.length > 0) {
                    spawnTrail(wordEndEdgePoints, 4.5, 75);
                }

                ctx.restore();
            };

            if (textureCache[s.texture]) {
                runScanner(textureCache[s.texture]);
            } else {
                const texImg = new Image();
                texImg.crossOrigin = "anonymous";
                texImg.src = `images/${s.texture}`;
                texImg.onload = () => {
                    textureCache[s.texture] = texImg;
                    runScanner(texImg);
                };
            }
        }
    }
}

function drawProdigy(text, writer, s, size, maxW) {
    const curX = canvas.width / 2;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `${size}px "${s.font}", Arial, sans-serif`;

    const colorTop = document.getElementById("user-color-1").value || s.top || "#ffffff";
    const colorBottom = document.getElementById("user-color-2").value || s.bottom || "#ffffff";

    const titleLines = formatQuotesForLines(processLayoutLines(text, canvas.width * 0.05, maxW));
    const titleLineHeight = size * 1.3;
    
    let writers = [];
    if (writer && writer.trim() !== "") {
        writers = writer.split(/[\n,]+/).map(w => w.trim()).filter(w => w !== "");
    }

    const creditFontSize = s.creditSize;
    const creditLineHeight = creditFontSize * 1.25;
    const labelFontSize = Math.round(creditFontSize * 0.68);

    let totalBlockHeight = titleLines.length * titleLineHeight;
    if (writers.length > 0) {
        totalBlockHeight += 35 + labelFontSize + 12 + (writers.length * creditLineHeight);
    }

    let curY = (canvas.height - totalBlockHeight) / 2;
    if (curY < 60) curY = 60; 

    titleLines.forEach(line => {
        let titleGradient = ctx.createLinearGradient(0, curY, 0, curY + size);
        titleGradient.addColorStop(0, colorTop);
        titleGradient.addColorStop(1, colorBottom);

        ctx.fillStyle = titleGradient;
        ctx.fillText(line, curX, curY);
        curY += titleLineHeight;
    });

    if (writers.length > 0) {
        curY += 35; 
        ctx.font = `${labelFontSize}px "${s.font}", Arial, sans-serif`;
        
        let labelGradient = ctx.createLinearGradient(0, curY, 0, curY + labelFontSize);
        labelGradient.addColorStop(0, colorTop);
        labelGradient.addColorStop(1, colorBottom);
        
        ctx.fillStyle = labelGradient;
        ctx.fillText("WRITTEN BY", curX, curY);
        curY += labelFontSize + 12;

        ctx.font = `${creditFontSize}px "${s.font}", Arial, sans-serif`;
        
        writers.forEach(name => {
            let writerGradient = ctx.createLinearGradient(0, curY, 0, curY + creditFontSize);
            writerGradient.addColorStop(0, colorTop);
            writerGradient.addColorStop(1, colorBottom);

            ctx.fillStyle = writerGradient;
            ctx.fillText(name.toUpperCase(), curX, curY);
            curY += creditLineHeight;
        });
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