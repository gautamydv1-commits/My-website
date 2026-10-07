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

    function readBest(key) {
        try {
            const value = Number(localStorage.getItem(key));
            return Number.isFinite(value) && value > 0 ? value : null;
        } catch (_) {
            return null;
        }
    }

    const arenaRecord = document.getElementById("arenaRecord");
    const racingRecord = document.getElementById("racingRecord");
    const bestArena = readBest("neon-arena-best");
    const bestRace = readBest("speed-rush-best-seconds");

    if (arenaRecord && bestArena !== null) {
        arenaRecord.textContent = `${Math.floor(bestArena).toLocaleString()} pts`;
    }

    if (racingRecord && bestRace !== null) {
        racingRecord.textContent = `${bestRace.toFixed(2)} s`;
    }

    document.querySelectorAll(".primary-btn, .secondary-btn, .small-btn").forEach((button) => {
        button.addEventListener("click", () => {
            button.style.transform = "scale(0.96)";
            window.setTimeout(() => { button.style.transform = ""; }, 120);
        });
    });

    window.addEventListener("load", () => document.body.classList.add("page-loaded"), { once: true });
})();
