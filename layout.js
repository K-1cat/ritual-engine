// =========================
// LOCAL STORAGE UTIL
// =========================
const Storage = {
    prefix: "ritual_engine_",

    set(key, value) {
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
    },

    get(key) {
        const value = localStorage.getItem(this.prefix + key);
        return value ? JSON.parse(value) : null;
    },

    remove(key) {
        localStorage.removeItem(this.prefix + key);
    },

    clearAll() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }
};

// =========================
// STATE MANAGEMENT (ARG CORE)
// =========================
const State = {
    init() {
        if (!Storage.get("visited")) {
            Storage.set("visited", []);
        }
        if (!Storage.get("flags")) {
            Storage.set("flags", {});
        }
    },

    visit(page) {
        let visited = Storage.get("visited") || [];
        if (!visited.includes(page)) {
            visited.push(page);
            Storage.set("visited", visited);
        }
    },

    setFlag(flag, value = true) {
        let flags = Storage.get("flags") || {};
        flags[flag] = value;
        Storage.set("flags", flags);
    },

    getFlag(flag) {
        const flags = Storage.get("flags") || {};
        return flags[flag];
    }
};

// =========================
// LAYOUT INJECTION
// =========================
function createLayout() {
    document.body.innerHTML = `
        <div id="app">
            <header class="topbar">
                <div class="logo">RITUAL ENGINE</div>
                <nav>
                    <a href="/index.html">Home</a>
                    <a href="/engine/engine.html">Engine</a>
                    <a href="/logs/log-01.html">Logs</a>
                    <a href="/archive/redvil.html">Archive</a>
                </nav>
            </header>

            <main class="main-content" id="main-content"></main>

            <footer class="footer">
                <span>v0.3.7</span>
                <span id="status-text">Status: Stable</span>
            </footer>
        </div>
    `;
}

// =========================
// STYLE INJECTION
// =========================
function injectStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
        body {
            margin: 0;
            font-family: monospace;
            background: #f4f4f4; /* lighter */
            color: #222;
        }

        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 20px;
            background: #ffffff;
            border-bottom: 1px solid #ddd;
        }

        .topbar .logo {
            font-weight: bold;
            letter-spacing: 2px;
        }

        .topbar nav a {
            margin-left: 15px;
            color: #555;
            text-decoration: none;
        }

        .topbar nav a:hover {
            color: #000;
        }

        .main-content {
            padding: 20px;
            min-height: calc(100vh - 100px);
        }

        .footer {
            padding: 10px 20px;
            background: #ffffff;
            border-top: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #555;
        }

        /* GLITCH EFFECT HOOK */
        .glitch {
            animation: glitch 0.3s infinite;
        }

        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
    `;
    document.head.appendChild(style);
}

// =========================
// SECRET BEHAVIOR SYSTEM
// =========================
function checkAnomalies() {
    const visited = Storage.get("visited") || [];

    // Example: trigger weird behavior after enough pages
    if (visited.length >= 3) {
        document.getElementById("status-text").innerText = "Status: UNSTABLE";
    }

    if (visited.length >= 5) {
        document.body.classList.add("glitch");
    }
}

// =========================
// INIT
// =========================
function initLayout(pageName, contentHTML) {
    State.init();
    State.visit(pageName);

    createLayout();
    injectStyles();

    document.getElementById("main-content").innerHTML = contentHTML;

    checkAnomalies();
}
