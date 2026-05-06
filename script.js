const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const winnerBox = document.getElementById("winner");
const choiceButtons = document.getElementById("choiceButtons");
const keepBtn = document.getElementById("keepBtn");
const removeBtn = document.getElementById("removeBtn");
const toggleSettings = document.getElementById("toggleSettings");
const settingsPanel = document.getElementById("settingsPanel");
const loadBtn = document.getElementById("loadBtn");
const clearBtn = document.getElementById("clearBtn");
const bulkNames = document.getElementById("bulkNames");
const durationInput = document.getElementById("duration");
const secText = document.getElementById("secText");

let names = ["Ali", "Sara", "Ahmed", "Zara", "Aisha"];
let rotation = 0;
let spinning = false;
let spinDuration = 10;
let currentWinner = null;

function getColor(i, total) {
    return `hsl(${(360 / total) * i}, 80%, 62%)`;
}

function drawWheel() {
    ctx.clearRect(0, 0, 500, 500);
    if (!names.length) return;

    const slice = (Math.PI * 2) / names.length;

    names.forEach((n, i) => {
        const s = i * slice + rotation;
        const e = s + slice;

        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 220, s, e);
        ctx.fillStyle = getColor(i, names.length);
        ctx.fill();

        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(s + slice / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#111";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText(n, 180, 8);
        ctx.restore();
    });
}

function spin() {
    if (spinning || !names.length) return;

    spinning = true;
    currentWinner = null;
    choiceButtons.style.display = "none";

    winnerBox.classList.remove("celebrate");
    winnerBox.innerHTML = "!...އެނބުރެނީ";

    let start = performance.now();
    let total = spinDuration * 1000;
    let totalRotation = Math.PI * 20 + Math.random() * 8;

    function frame(now) {
        let p = Math.min((now - start) / total, 1);
        let ease = 1 - Math.pow(1 - p, 3); // Cubic ease-out

        rotation = totalRotation * ease;
        drawWheel();

        if (p < 1) {
            requestAnimationFrame(frame);
        } else {
            spinning = false;
            pickWinner();
        }
    }
    requestAnimationFrame(frame);
}

function pickWinner() {
    const slice = (Math.PI * 2) / names.length;
    // Pointer is at the top (1.5 * PI)
    const pointerAngle = (Math.PI * 1.5 - rotation) % (Math.PI * 2);
    const index = Math.floor(((pointerAngle + Math.PI * 2) % (Math.PI * 2)) / slice);

    currentWinner = names[index];

    winnerBox.innerHTML = "🎉 " + currentWinner + " 🎉";
    winnerBox.classList.add("celebrate");

    choiceButtons.style.display = "flex";
    celebrate();
}

function celebrate() {
    const disco = document.createElement("div");
    disco.className = "disco-light";
    document.body.appendChild(disco);
    setTimeout(() => disco.remove(), 3000);

    for (let i = 0; i < 120; i++) {
        let c = document.createElement("div");
        c.className = "confetti-piece";
        c.style.left = Math.random() * 100 + "vw";
        c.style.background = `hsl(${Math.random() * 360}, 95%, 60%)`;
        c.style.animationDuration = (2 + Math.random() * 3) + "s";
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 4000);
    }

    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            let f = document.createElement("div");
            f.className = "firework";
            f.style.left = Math.random() * 80 + "vw";
            f.style.top = Math.random() * 60 + "vh";
            f.style.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
            document.body.appendChild(f);
            setTimeout(() => f.remove(), 1000);
        }, i * 250);
    }
}

keepBtn.onclick = () => {
    choiceButtons.style.display = "none";
};

removeBtn.onclick = () => {
    names = names.filter(n => n !== currentWinner);
    choiceButtons.style.display = "none";
    drawWheel();
};

toggleSettings.onclick = () => {
    settingsPanel.classList.toggle("show");
};

loadBtn.onclick = () => {
    let txt = bulkNames.value.trim();
    if (!txt) return;
    // Split by new line or comma
    names = [...new Set(txt.split(/\n|,/).map(x => x.trim()).filter(Boolean))];
    drawWheel();
};

clearBtn.onclick = () => {
    names = [];
    drawWheel();
};

durationInput.oninput = e => {
    spinDuration = e.target.value;
    secText.textContent = spinDuration;
};

canvas.onclick = spin;

// Initialize
drawWheel();
