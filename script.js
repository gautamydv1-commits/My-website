(() => {
    "use strict";

    const menuButton = document.getElementById("menuBtn");
    const navigation = document.getElementById("navLinks");

    function setMenuOpen(open) {
        if (!menuButton || !navigation) return;

        navigation.classList.toggle("open", open);
        menuButton.textContent = open ? "✕" : "☰";
        menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        menuButton.setAttribute("aria-expanded", String(open));
    }

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setMenuOpen(false));
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        });

        document.addEventListener("click", (event) => {
            if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
                setMenuOpen(false);
            }
        });
    }

    const navigationLinks = navigation ? [...navigation.querySelectorAll("a")] : [];
    const sections = [...document.querySelectorAll("section[id]")];
    let scrollFrame = 0;

    function updateActiveLink() {
        scrollFrame = 0;
        let activeId = "home";

        for (const section of sections) {
            if (window.scrollY >= section.offsetTop - 160) activeId = section.id;
        }

        navigationLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${activeId}`;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    }

    window.addEventListener("scroll", () => {
        if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateActiveLink);
    }, { passive: true });
    updateActiveLink();

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const revealElements = document.querySelectorAll(
        ".game-card, .featured-card, .leader-row, .news-card, .stats-card"
    );

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        revealElements.forEach((element) => {
            element.style.opacity = "0";
            element.style.transform = "translateY(25px)";
            element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            revealObserver.observe(element);
        });
    }

    function readLeaderboard() {
        try {
            const stored = JSON.parse(localStorage.getItem("gamezone-leaderboard-v1") || "{}");
            return stored && typeof stored === "object" ? stored : {};
        } catch (_) {
            return {};
        }
    }

    function renderLeaderboard(game, targetId, icon) {
        const target = document.getElementById(targetId);
        if (!target) return;
        const entries = Array.isArray(readLeaderboard()[game]) ? readLeaderboard()[game].slice(0, 5) : [];

        if (!entries.length) {
            const empty = document.createElement("p");
            empty.className = "leaderboard-empty";
            empty.textContent = "No scores yet — be the first to set a record!";
            target.replaceChildren(empty);
            return;
        }

        const rows = entries.map((entry, index) => {
            const row = document.createElement("div");
            row.className = `leader-row${index === 0 ? " first" : ""}`;
            const rank = document.createElement("span");
            rank.className = "rank";
            rank.textContent = String(index + 1).padStart(2, "0");
            const player = document.createElement("div");
            player.className = "player";
            const avatar = document.createElement("div");
            avatar.className = "avatar";
            avatar.textContent = icon;
            const identity = document.createElement("div");
            const name = document.createElement("strong");
            name.textContent = String(entry.name || "Player").slice(0, 16);
            const detail = document.createElement("small");
            detail.textContent = String(entry.detail || "ARCADE RUN").slice(0, 36);
            identity.append(name, detail);
            player.append(avatar, identity);
            const score = document.createElement("strong");
            score.className = "xp";
            score.textContent = `${Number(entry.score || 0).toLocaleString()} ${entry.unit || "pts"}`;
            row.append(rank, player, score);
            return row;
        });
        target.replaceChildren(...rows);
    }

    const playerNameInput = document.getElementById("playerName");
    const playerNameForm = document.getElementById("playerNameForm");
    const nameSaved = document.getElementById("nameSaved");
    if (playerNameInput) {
        try { playerNameInput.value = localStorage.getItem("gamezone-player-name") || "Player"; } catch (_) { playerNameInput.value = "Player"; }
    }
    if (playerNameForm && playerNameInput) {
        playerNameForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = playerNameInput.value.trim().slice(0, 16) || "Player";
            playerNameInput.value = name;
            try { localStorage.setItem("gamezone-player-name", name); } catch (_) {}
            if (nameSaved) nameSaved.textContent = `Saved as ${name}`;
        });
    }

    function refreshLeaderboards() {
        renderLeaderboard("arena", "arenaLeaderboard", "⚔️");
        renderLeaderboard("racing", "racingLeaderboard", "🏎️");
        renderLeaderboard("warriors", "warriorsLeaderboard", "🛡️");
    }

    refreshLeaderboards();
    window.addEventListener("pageshow", refreshLeaderboards);
    window.addEventListener("storage", (event) => {
        if (event.key === "gamezone-leaderboard-v1") refreshLeaderboards();
    });

    document.querySelectorAll(".primary-btn, .secondary-btn, .small-btn").forEach((button) => {
        button.addEventListener("click", () => {
            button.style.transform = "scale(0.96)";
            window.setTimeout(() => { button.style.transform = ""; }, 120);
        });
    });

    window.addEventListener("load", () => document.body.classList.add("page-loaded"), { once: true });
})();
