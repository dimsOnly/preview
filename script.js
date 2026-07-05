/**
 * NETFLIX UI CLONE - COMPLETE JAVASCRIPT
 * Profile selection, dynamic catalog rows, billboard play triggers,
 * header scroll effects, fullscreen player, and thank-you flow.
 */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const loader          = document.getElementById("loader");
    const loadingBar      = document.getElementById("loadingBar");

    const profileStage    = document.getElementById("profileStage");
    const profileCards    = document.querySelectorAll(".profile-card");

    const browseStage     = document.getElementById("browseStage");
    const netflixHeader   = document.querySelector(".netflix-header");
    const watchBtn        = document.getElementById("watchBtn");
    const infoBtn         = document.getElementById("infoBtn");

    const videoModal      = document.getElementById("videoModal");
    const closeVideoBtn   = document.getElementById("closeVideo");
    const videoFrame      = document.getElementById("videoFrame");

    const thanksModal     = document.getElementById("thanksModal");
    const closeThanksBtn  = document.getElementById("closeThanks");

    const bgMusic         = document.getElementById("bgMusic");
    const particlesEl     = document.getElementById("particles");

    const trendingRow     = document.getElementById("trendingRow");
    const acclaimedRow    = document.getElementById("acclaimedRow");

    const VIDEO_URL = "https://drive.google.com/file/d/1efkKvWUjDg0VT2aq6CbYEcNDgC5LSh0E/preview";

    const infoModal         = document.getElementById("infoModal");
    const closeInfoBtn      = document.getElementById("closeInfoBtn");
    const closeInfoBackdrop = document.getElementById("closeInfoBackdrop");
    const infoPlayBtn       = document.getElementById("infoPlayBtn");
    const moreLikeGrid      = document.getElementById("moreLikeGrid");

    // ==========================================
    // LOADER PROGRESS
    // ==========================================
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 18) + 8;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                loader.classList.add("loader-hide");
            }, 400);
        }
        loadingBar.style.width = `${progress}%`;
    }, 80);

    // ==========================================
    // AMBIENT PARTICLES
    // ==========================================
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 50; i++) {
        const p = document.createElement("div");
        p.classList.add("particle");
        const size = (Math.random() * 2 + 1).toFixed(1);
        p.style.cssText = `
            width:${size}px;
            height:${size}px;
            left:${(Math.random() * 100).toFixed(2)}%;
            bottom:-${(Math.random() * 10).toFixed(2)}%;
            animation-duration:${(Math.random() * 18 + 12).toFixed(1)}s;
            animation-delay:${(Math.random() * 20).toFixed(1)}s;
            opacity:${(Math.random() * 0.3 + 0.1).toFixed(2)};
        `;
        frag.appendChild(p);
    }
    particlesEl.appendChild(frag);

    // ==========================================
    // AUDIO
    // ==========================================
    const triggerAudio = () => {
        if (bgMusic && bgMusic.paused) {
            bgMusic.play().catch(() => {});
        }
    };

    // ==========================================
    // THANK YOU LIFECYCLE  (declared first — used by closePlayer)
    // ==========================================
    const openThanks = () => {
        thanksModal.classList.remove("stage-hidden");
        thanksModal.style.opacity = "0";
        void thanksModal.offsetWidth;
        thanksModal.style.transition = "opacity 0.4s ease";
        thanksModal.style.opacity = "1";
    };

    const closeThanksFlow = () => {
        thanksModal.style.opacity = "0";
        setTimeout(() => {
            thanksModal.classList.add("stage-hidden");
            // Re-open player when "Tonton Lagi" is clicked
        }, 400);
    };

    // ==========================================
    // VIDEO PLAYER LIFECYCLE  (declared before it's referenced by card clicks)
    // ==========================================
    const openPlayer = () => {
        triggerAudio();
        videoModal.classList.remove("stage-hidden");
        videoModal.style.opacity = "0";
        void videoModal.offsetWidth;
        videoModal.style.transition = "opacity 0.4s ease";
        videoModal.style.opacity = "1";
        videoFrame.src = VIDEO_URL;
    };

    const closePlayer = () => {
        videoModal.style.opacity = "0";
        videoFrame.src = "";
        setTimeout(() => {
            videoModal.classList.add("stage-hidden");
            openThanks();
        }, 400);
    };

    // ==========================================
    // INFO MODAL LIFECYCLE
    // ==========================================
    const moreLikeTitles = [
        { title: "Surat Untukmu",   desc: "Sebuah surat yang ditulis dengan tulus untuk seseorang yang istimewa.",   match: "97%" },
        { title: "Kenangan Biru",   desc: "Perjalanan menyentuh hati yang mengingatkan kita akan hal-hal sederhana.", match: "95%" },
        { title: "Jejak Waktu",     desc: "Kisah dua jiwa yang terhubung melampaui batas waktu dan ruang.",           match: "93%" },
        { title: "Rumah di Hati",   desc: "Tempat di mana rasa hangat selalu hadir, tak peduli seberapa jauh.",      match: "91%" },
        { title: "Diam-Diam Cinta", desc: "Perasaan yang tumbuh perlahan, namun terasa dalam dan nyata.",             match: "89%" },
        { title: "Harmoni",         desc: "Ketika dua cerita bertemu dan menciptakan sesuatu yang indah.",            match: "88%" },
    ];
    const mlcColors = [
        "linear-gradient(135deg, #1a1a2e, #2d132c)",
        "linear-gradient(135deg, #0d0d1a, #1e0a0a)",
        "linear-gradient(135deg, #0f3443, #1a1a2e)",
        "linear-gradient(135deg, #1b1b2f, #2c3e50)",
        "linear-gradient(135deg, #2d132c, #1e272e)",
        "linear-gradient(135deg, #0a0a1a, #0f3443)",
    ];

    const populateMoreLike = () => {
        if (!moreLikeGrid || moreLikeGrid.children.length > 0) return;
        const frag2 = document.createDocumentFragment();
        moreLikeTitles.forEach((item, i) => {
            const card = document.createElement("div");
            card.classList.add("more-like-card");

            const thumb = document.createElement("div");
            thumb.classList.add("more-like-thumb");
            thumb.style.background = mlcColors[i % mlcColors.length];
            thumb.textContent = item.title;

            const info = document.createElement("div");
            info.classList.add("more-like-info");
            info.innerHTML = `
                <div class="mlc-match">${item.match} Match</div>
                <div class="mlc-title">${item.title}</div>
                <div class="mlc-desc">${item.desc}</div>
            `;

            card.appendChild(thumb);
            card.appendChild(info);
            card.addEventListener("click", () => { closeInfo(); setTimeout(openPlayer, 300); });
            frag2.appendChild(card);
        });
        moreLikeGrid.appendChild(frag2);
    };

    const openInfo = () => {
        populateMoreLike();
        infoModal.classList.remove("stage-hidden");
    };

    const closeInfo = () => {
        infoModal.classList.add("stage-hidden");
    };

    if (closeInfoBtn)       closeInfoBtn.addEventListener("click", closeInfo);
    if (closeInfoBackdrop)  closeInfoBackdrop.addEventListener("click", closeInfo);
    if (infoPlayBtn)        infoPlayBtn.addEventListener("click", () => { closeInfo(); setTimeout(openPlayer, 300); });

    // Replay button inside thanks card
    if (closeThanksBtn) {
        closeThanksBtn.addEventListener("click", () => {
            closeThanksFlow();
            setTimeout(openPlayer, 450);   // wait for fade-out, then reopen player
        });
    }

    thanksModal.addEventListener("click", (e) => {
        if (e.target === thanksModal) closeThanksFlow();
    });

    // Billboard buttons
    if (watchBtn) watchBtn.addEventListener("click", openPlayer);
    if (infoBtn)  infoBtn.addEventListener("click", openInfo);   // ← now opens info, not player

    // Close player buttons
    if (closeVideoBtn) closeVideoBtn.addEventListener("click", closePlayer);
    videoModal.addEventListener("click", (e) => {
        if (e.target === videoModal) closePlayer();
    });

    // ==========================================
    // ESC KEY
    // ==========================================
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (!videoModal.classList.contains("stage-hidden")) {
                closePlayer();
            } else if (!thanksModal.classList.contains("stage-hidden")) {
                closeThanksFlow();
            } else if (!infoModal.classList.contains("stage-hidden")) {
                closeInfo();
            }
        }
    });

    // ==========================================
    // MOVIE CARD DATA
    // ==========================================
    const trendingTitles = [
        "Stranger Things", "Wednesday", "Squid Game", "The Witcher",
        "Money Heist", "Dark", "Narcos", "Ozark",
        "You", "The Crown", "Bridgerton", "Lupin"
    ];
    const acclaimedTitles = [
        "The Irishman", "Roma", "Marriage Story", "Mank",
        "The Power of the Dog", "Don't Look Up", "Glass Onion",
        "All Quiet", "Guillermo del Toro", "The Trial", "Pinocchio", "Tick Tick Boom"
    ];
    const cardColors = [
        "linear-gradient(135deg, #1a1a2e, #16213e)",
        "linear-gradient(135deg, #2d132c, #1a1a2e)",
        "linear-gradient(135deg, #0f3443, #34495e)",
        "linear-gradient(135deg, #1b1b2f, #162447)",
        "linear-gradient(135deg, #2c3e50, #1a1a2e)",
        "linear-gradient(135deg, #1e272e, #0a3d62)",
        "linear-gradient(135deg, #2f3640, #1e272e)",
        "linear-gradient(135deg, #1a1a2e, #34495e)",
        "linear-gradient(135deg, #0a3d62, #1a1a2e)",
        "linear-gradient(135deg, #2c2c54, #1a1a2e)",
        "linear-gradient(135deg, #1e272e, #485460)",
        "linear-gradient(135deg, #2d132c, #0f3443)"
    ];

    // ==========================================
    // POPULATE ROWS  (after openPlayer is declared — safe to reference)
    // ==========================================
    const populateRow = (container, titles, showNumbers = false) => {
        if (!container) return;
        const rowFrag = document.createDocumentFragment();
        titles.forEach((title, i) => {
            const card = document.createElement("div");
            card.classList.add("movie-card");
            card.style.background = cardColors[i % cardColors.length];

            const inner = document.createElement("div");
            inner.classList.add("movie-card-inner");
            inner.textContent = title;
            card.appendChild(inner);

            if (showNumbers) {
                const num = document.createElement("span");
                num.classList.add("top-number");
                num.textContent = i + 1;
                card.appendChild(num);
            }

            // openPlayer is already declared above — no hoisting issues
            card.addEventListener("click", openPlayer);
            rowFrag.appendChild(card);
        });
        container.appendChild(rowFrag);
    };

    populateRow(trendingRow,   trendingTitles,  true);
    populateRow(acclaimedRow,  acclaimedTitles, false);

    // ==========================================
    // PROFILE SELECTION → BROWSE
    // ==========================================
    profileCards.forEach(card => {
        card.addEventListener("click", () => {
            // Fade out profile screen
            profileStage.style.transition = "opacity 0.5s ease";
            profileStage.style.opacity = "0";

            setTimeout(() => {
                profileStage.classList.add("stage-hidden");

                // Show browse
                browseStage.classList.remove("stage-hidden");
                browseStage.style.opacity = "0";
                void browseStage.offsetWidth;   // force reflow
                browseStage.style.transition = "opacity 0.6s ease";
                browseStage.style.opacity = "1";
            }, 500);
        });
    });

    // ==========================================
    // HEADER SCROLL EFFECT
    // ==========================================
    browseStage.addEventListener("scroll", () => {
        if (browseStage.scrollTop > 50) {
            netflixHeader.classList.add("scrolled");
        } else {
            netflixHeader.classList.remove("scrolled");
        }
    });

});
