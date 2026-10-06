/* =========================================
   GAMEZONE MAIN JAVASCRIPT
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn =
    document.getElementById("menuBtn");

const navLinks =
    document.getElementById("navLinks");


menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("open");

    if (navLinks.classList.contains("open")) {

        menuBtn.textContent = "✕";

        menuBtn.setAttribute(
            "aria-label",
            "Close menu"
        );

    } else {

        menuBtn.textContent = "☰";

        menuBtn.setAttribute(
            "aria-label",
            "Open menu"
        );

    }

});


/* =========================================
   CLOSE MOBILE MENU
========================================= */

const links =
    navLinks.querySelectorAll("a");


links.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");

        menuBtn.textContent = "☰";

        menuBtn.setAttribute(
            "aria-label",
            "Open menu"
        );

    });

});


/* =========================================
   ACTIVE NAVIGATION
========================================= */

const sections =
    document.querySelectorAll("section[id]");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (
            window.scrollY >= sectionTop
        ) {

            current =
                section.getAttribute("id");

        }

    });


    links.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + current
        ) {

            link.classList.add("active");

        }

    });

});


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(
        ".game-card, .featured-card, .leader-row, .news-card, .stats-card"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(25px)";

    element.style.transition =
        "opacity 0.6s ease, transform 0.6s ease";

    revealObserver.observe(element);

});


/* =========================================
   BUTTON CLICK EFFECT
========================================= */

const buttons =
    document.querySelectorAll(
        ".primary-btn, .secondary-btn, .small-btn"
    );


buttons.forEach(button => {

    button.addEventListener("click", () => {

        button.style.transform =
            "scale(0.96)";

        setTimeout(() => {

            button.style.transform = "";

        }, 120);

    });

});


/* =========================================
   PAGE LOADED
========================================= */

window.addEventListener("load", () => {

    document.body.classList.add(
        "page-loaded"
    );

});