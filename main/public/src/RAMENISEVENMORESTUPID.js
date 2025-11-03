


document.getElementById("searchText").addEventListener('keydown', (event) => {
  // Case 1: Shift + Backspace → go to /home
  if (event.shiftKey && event.key === 'Backspace') {
    window.location.href = `/home`;
    return;
  }

  // Case 2: Enter → go to /search/<value>
  if (event.key === 'Enter') {
    const input = document.getElementById('searchText');
    const val = input ? input.value.trim() : '';
    if (val !== '') {
      window.location.href = `/search/${encodeURIComponent(val)}`;
    } else {
      showNoInputOverlay();
      
    }
  }
});

// Delegate search execution to the implementation provided by searchLogic.js.
// We use a different local name to avoid any shadowing or equality issues with window.ClickSearch.
async function runClickSearch(input) {
    if (typeof window !== 'undefined' && typeof window.ClickSearch === 'function') {
        return await window.ClickSearch(input);
    }
    throw new Error('ClickSearch not available. Ensure searchLogic.js is loaded and sets window.ClickSearch.');
}

// When this script loads on the /search page, detect a team id or query in the URL
// and automatically run ClickSearch with it.
function runSearchFromURL() {
    try {
        // hide any existing overlay when re-checking URL (navigation/back)
        hideNoInputOverlay();
        const url = new URL(window.location.href);
        // Prefer path segment: /search/<teamid>
        const pathname = url.pathname || "/";
        let candidate = null;

        // If the pathname begins with /search/ and has something after it, redirect to the
        // query-style URL /search?<slug>. We perform a server-side redirect in next.config.js,
        // but this client-side replace is a fallback so path-style requests are normalized.
        if (pathname.toLowerCase().startsWith('/search/')) {
            const parts = pathname.split('/').filter(Boolean); // removes empty
            if (parts.length >= 2) {
                // parts[0] = 'search', parts[1..] = slug segments
                const slug = parts.slice(1).join('/');
                // Use replace so browser history doesn't keep the path-style URL
                const newUrl = `${url.origin}/search?input=${encodeURIComponent(slug)}`;
                window.location.replace(newUrl);
                return; // stop further processing on this page load; new navigation will re-run handler
            }
        }

        // If no path candidate, check hash first, then query params: q or team or teamid
        if (!candidate) {
            // support /search#teamid
            if (url.hash && url.hash.length > 1) {
                candidate = decodeURIComponent(url.hash.slice(1));
            }

            const params = url.searchParams;
            if (!candidate) {
                if (params.has('q')) candidate = params.get('q');
                else if (params.has('team')) candidate = params.get('team');
                else if (params.has('teamid')) candidate = params.get('teamid');
                else if ([...params].length === 1) {
                    // if there's a single unnamed pair (e.g. /search?12345) use its value if present, otherwise use the key
                    const first = [...params][0];
                    if (first) {
                        // first is [key, value]
                        candidate = first[1] && first[1].trim() !== '' ? first[1] : first[0];
                    }
                } else if ([...params].length > 1) {
                    // If multiple params but none of the named ones we expect, try to pick a numeric/alphanumeric-looking value
                    for (const [k, v] of params) {
                        const maybe = v && v.trim() !== '' ? v : k;
                        if (/^[0-9A-Za-z_-]{3,}$/.test(maybe)) { candidate = maybe; break; }
                    }
                }
            }
        }

    if (candidate && candidate.trim() !== '') {
            // populate the input so user sees the query
            const inputEl = document.getElementById('searchText');
            if (inputEl) {
                try { inputEl.value = candidate; } catch (e) { /* ignore */ }
            }

            // Make sure the search UI is opened so the .container .text divider is visible
            try { openSearchUI(); } catch (e) { /* ignore if not available */ }
            // Delay slightly if DOM isn't fully ready / search UI needs to animate
            setTimeout(() => {
                runClickSearch(candidate);
            }, 150);
        } else {
            
            // No input provided: open the search UI so the user can type (same state as clicking search on Home)
            openSearchUI();
            
            // then show an overlay box on top of the search bar explaining there's no input
            console.log('[runSearchFromURL] pathname=', pathname);
            
            showTypesOfInputs();
            showOverlay();
        }
    } catch (e) {
        console.error('Error while parsing search URL:', e);
    }
}

// Run on DOMContentLoaded so the page elements are ready.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runSearchFromURL);
} else {
    runSearchFromURL();
}

// Re-run URL handling when the history changes (back/forward navigation)
window.addEventListener('popstate', runSearchFromURL);

// Helper: attach click handlers to any close elements inside the search area
function attachSearchCloseHandlers(root = document) {
    try {
        // look for elements with class 'search-close' or 'close' that are within the search container
        const candidates = root.querySelectorAll('.search-close, .close');
        candidates.forEach(el => {
            // avoid attaching multiple listeners
            if (el.__gotoHomeAttached) return;
            // ensure the element is inside an element that looks like the search UI
            let ancestor = el;
            let insideSearch = false;
            while (ancestor) {
                if (ancestor.classList && (ancestor.classList.contains('root') || ancestor.classList.contains('container') || ancestor.id === 'actualText')) { insideSearch = true; break; }
                ancestor = ancestor.parentElement;
            }
            if (!insideSearch) return;
            el.addEventListener('click', (ev) => {
                try {
                    ev.preventDefault();
                    // navigate to /home
                    window.location.replace(`${window.location.origin}/home`);
                } catch (e) {
                    console.error('Error navigating to /home', e);
                }
            });
            el.__gotoHomeAttached = true;
        });
    } catch (e) {
        console.error('attachSearchCloseHandlers error', e);
    }
}

// attach to existing DOM now
attachSearchCloseHandlers(document);

// watch for future inserts inside body so dynamically created close buttons also get wired
const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) attachSearchCloseHandlers(node);
            });
        }
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Attach a debug click handler to the search icon on the search page itself
try {
    const _searchIcon = document.getElementById('SearchIcon');
    const _searchInput = document.getElementById('searchText');
    console.log('[search-page] SearchIcon present:', !!_searchIcon, 'searchText present:', !!_searchInput);
    hideSecondaryOverlay();
    if (_searchIcon) {
        _searchIcon.addEventListener('click', (ev) => {
            console.log('[search-page] SearchIcon click', ev);
            const val = _searchInput ? _searchInput.value.trim() : '';
            console.log('[search-page] input value:', val);
                if (val && val !== '') {
                // ensure UI is open and then run the search flow
                try { openSearchUI(); } catch (e) {}
                setTimeout(() => {
                    try {
                        const searchUrl = `${window.location.origin}/search?input=${encodeURIComponent(val)}`;
                        window.location.replace(searchUrl);
                    } catch (err) {
                        // fallback to original behavior if navigation fails
                        try { runClickSearch(val); } catch (e) { console.error('runClickSearch failed', e); }
                    }
                }, 50);
            } else {
                console.log('[search-page] no input provided; showing no-input overlay');
                showNoInputOverlay();
            }
        });
    }
} catch (e) {
    console.error('Error attaching search icon handler on search page', e);
}


// Reusable rendering for a fetched team object and its stats
function processTeamData(teamData, teamId) {
    try {
        if (!teamData) return;
        if (teamData.members && teamData.members.length < 5) return;

        let encompassingDivider = document.createElement('div');
        encompassingDivider.classList.add('fart');
        encompassingDivider.style.backgroundColor = '#0000005e';

        let name = document.createElement('div');
        name.id = 'name';
        name.innerHTML = teamData.name + "<a>(" + (teamData.nickname || '') + ")</a>";
        name.style.color = 'white';
        encompassingDivider.appendChild(name);

        let pic = document.createElement('img');
        pic.src = teamData.avatar;
        if (teamData.avatar === undefined || teamData.avatar == 'undefined') {
            pic.src = '../images/DEFAULT.jpg';
        }
        pic.style.width = '150px';
                        if (candidate && candidate.trim() !== '') {
                            console.log('[runSearchFromURL] candidate=', candidate);
        pic.style.height = '150px';
        pic.style.borderRadius = '20px';
        pic.style.margin = '10px';
        encompassingDivider.appendChild(pic);

        let buttonsAndShit = document.createElement('div');
        buttonsAndShit.style.width = '250px';
        buttonsAndShit.style.transform = 'translate(173px, -80px)';
        buttonsAndShit.style.overflowX = 'auto';
        buttonsAndShit.style.height = '75px';
        buttonsAndShit.style.alignItems = 'end';
        buttonsAndShit.style.overflowY = 'hidden';
        buttonsAndShit.style.display = 'flex';

        let faceitButton = document.createElement('img');
        faceitButton.src = '../images/FACEIT.png';
        faceitButton.id = 'faceit';
        faceitButton.style.width = '35px';
        faceitButton.style.height = '30px';
        faceitButton.style.position = 'absolute';
        faceitButton.style.transform = 'translate(440px,165px)';
        faceitButton.onclick = () => {
            window.open(teamData.faceit_url.replace('{lang}', 'en'), '_blank');
        };

        let playerPicturesAndShit = document.createElement('div');
        playerPicturesAndShit.style.position = 'absolute';
        playerPicturesAndShit.style.width = '300px';
        playerPicturesAndShit.style.display = 'flex';

        for (const player of teamData.members || []) {
            let playerdivider = document.createElement('div');
            let picandhat = document.createElement('div');
            picandhat.id = 'picandhat';
            let picture = document.createElement('img');
            picture.src = player.avatar;
            picture.style.borderRadius = '10px';
            picture.style.marginRight = '5px';
            picture.id = 'player';
            if (player.avatar == undefined || player.avatar === 'undefined') {
                picture.src = '../images/DEFAULT.jpg';
            }
            if (player.user_id == teamData.leader) {
                let captianHat = document.createElement('img');
                captianHat.src = '../images/CAPTAIN.png';
                captianHat.style.height = '25px';
                captianHat.style.width = '25px';
                captianHat.style.position = 'absolute';
                captianHat.style.transform = 'translate(2px, -15px)';
                picandhat.classList.add('hasCaptain');
                picandhat.appendChild(captianHat);
            }
            picandhat.appendChild(picture);
            let playername = document.createElement('div');
            playername.id = 'playername';
            playername.style.color = 'white';
            playername.fontSize = '1.5rem';
            playername.textContent = countryCodeToFlag(player.country) + ' ' + player.nickname;
            playerdivider.appendChild(playername);
            playerdivider.appendChild(picandhat);
            playerPicturesAndShit.appendChild(playerdivider);

            picture.addEventListener('mouseenter', () => {
                playername.style.opacity = '1';
                if (picandhat.classList.contains('hasCaptain')) {
                    playername.style.transform = 'translateY(-20px)';
                }
            });
            picture.addEventListener('click', () => {
                window.open(player.faceit_url.replace('{lang}', 'en'), '_blank');
            });
            picture.addEventListener('mouseleave', () => {
                playername.style.opacity = '0';
            });
        }

        let goToBanReaderButton = document.createElement('button');
        goToBanReaderButton.textContent = 'Start reading Picks and Bans';
        goToBanReaderButton.position = 'absolute';
        goToBanReaderButton.classList.add('GoToBanreader');

        let addtodatabasebutton = document.createElement('button');
        addtodatabasebutton.textContent = '+';
        addtodatabasebutton.position = 'absolute';
        addtodatabasebutton.classList.add('addtodatabase');
        buttonsAndShit.prepend(playerPicturesAndShit);
        encompassingDivider.appendChild(buttonsAndShit);
        buttonsAndShit.after(faceitButton);
        encompassingDivider.appendChild(addtodatabasebutton);
        encompassingDivider.appendChild(goToBanReaderButton);

        document.querySelector('.result').appendChild(encompassingDivider);
        fadeInViaTransition(encompassingDivider, 1000);

        goToBanReaderButton.addEventListener('mouseenter', () => {
            const randomDeg = (Math.random() * 6 - 3).toFixed(2);
            goToBanReaderButton.style.transform = `translate(425px,52px) scale(1.05) rotate(${randomDeg}deg)`;
        });
        goToBanReaderButton.addEventListener('mouseleave', () => {
            goToBanReaderButton.style.transform = 'translate(425px,52px) scale(1) rotate(0deg)';
        });
        goToBanReaderButton.addEventListener('click', () => {
            window.location.href = `${window.location.origin}/${teamId}`;
        });

        fetch(`https://open.faceit.com/data/v4/teams/${teamId}/stats/cs2`, {
            headers: getFaceitHeaders()
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(statsData => {
                // Carousel wrapper
                let carouselWrapper = document.createElement('div');
                carouselWrapper.classList.add('carousel-wrapper');

                let carouselTrack = document.createElement('div');
                carouselTrack.classList.add('carousel-track');
                carouselWrapper.appendChild(carouselTrack);

                // Navigation buttons
                let prevButton = document.createElement('button');
                prevButton.classList.add('carousel-btn', 'prev');
                prevButton.textContent = '⟨';

                let nextButton = document.createElement('button');
                nextButton.classList.add('carousel-btn', 'next');
                nextButton.textContent = '⟩';

                carouselWrapper.appendChild(prevButton);
                carouselWrapper.appendChild(nextButton);
                pic.after(carouselWrapper);

                for (const map of statsData.segments) {
                    let divider = document.createElement('div');
                    divider.classList.add('map-divider');

                    let picture = document.createElement('img');
                    picture.src = map.img_regular;
                    picture.style.width = '300px';
                    picture.style.height = '150px';
                    picture.style.transform = 'translate(-100px, -18px)';
                    picture.style.position = 'absolute';
                    picture.style.zIndex = '-10';
                    picture.style.borderRadius = '5px';

                    let label = document.createElement('div');
                    label.textContent = map.label;
                    label.style.transform = 'translate(50px,-18px)';
                    label.style.filter = 'drop-shadow(1px 1px 1px black)';
                    label.style.fontSize = '1.7rem';
                    label.style.textDecoration = 'underline';

                    let stats = map.stats;
                    let wins = stats.Wins;
                    let loss = stats.Matches - wins;
                    let rate = stats['Win Rate %'];

                    let statsBox = document.createElement('div');
                    statsBox.classList.add('map-stats');
                    statsBox.style.filter = 'drop-shadow(1px 1px 1px black)';
                    statsBox.style.fontSize = '1.4rem';
                    statsBox.innerHTML = `
                        <div>Wins: <b>${wins}</b></div>
                        <div>Losses: <b>${loss}</b></div>
                        <div>Win Rate: <b>${rate}%</b></div>
                    `;
                    statsBox.style.transform = 'translate(50px,-30px)';
                    divider.appendChild(picture);
                    divider.appendChild(label);
                    divider.appendChild(statsBox);

                    carouselTrack.appendChild(divider);
                }

                // Carousel Logic
                let currentIndex = 0;
                const slides = carouselTrack.querySelectorAll('.map-divider');
                const totalSlides = slides.length;

                if (slides[0]) slides[0].classList.add('active');
                function updateCarousel() {
                    carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
                    slides.forEach((s, i) => {
                        if (i === currentIndex) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });
                }

                prevButton.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                    updateCarousel();
                    stopAutoSlide();
                    startAutoSlide();
                });

                nextButton.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateCarousel();
                    stopAutoSlide();
                    startAutoSlide();
                });

                let autoSlideInterval = null;
                const slideDelay = 4000;

                function startAutoSlide() {
                    autoSlideInterval = setInterval(() => {
                        currentIndex = (currentIndex + 1) % totalSlides;
                        updateCarousel();
                    }, slideDelay);
                }

                function stopAutoSlide() {
                    clearInterval(autoSlideInterval);
                    autoSlideInterval = null;
                }

                updateCarousel();
                startAutoSlide();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        } // end if(candidate)
    } catch (e) {
        console.error('processTeamData error', e);
    }
}

// Shows a message when no search input is present on /search
function openSearchUI() {
    try {
        
        const root = document.querySelector('.root');
        if (root) {
            root.classList.add('search-open');
            root.classList.remove('search-close');
        }

        const searchIcon = document.querySelector('.search-icon');
        const actualText = document.getElementById('actualText');
        if (searchIcon && actualText && !actualText.contains(searchIcon)) {
            actualText.appendChild(searchIcon);
            searchIcon.style.top = '3px';
            searchIcon.style.marginLeft = 'auto';
        }

        try { document.querySelector('.search-icon circle').style.stroke = '#FFFFFF'; } catch (e) {}
        try { document.querySelector('.search-icon line').style.stroke = '#FFFFFF'; } catch (e) {}
        document.querySelectorAll('#thing').forEach(el => { el.style.background = '#FFFFFF'; });

        // Clear any transforms that may have been left from ClickSearch so the input stays in view
        const textContainer = document.querySelector('.container .text');
        if (textContainer) {
            textContainer.style.backgroundColor = '#0000005e';
            // remove inline width/transform if present to let CSS handle layout
            textContainer.style.width = '';
            textContainer.style.transform = '';
        }

        if (actualText) {
            actualText.style.transform = '';
            actualText.style.position = '';
        }

        const searchText = document.getElementById('searchText');
        if (searchText) {
            searchText.disabled = false;
            // focus after a short delay to ensure UI has settled
            setTimeout(() => { try { searchText.focus(); } catch (e) {} }, 50);
        }
    } catch (e) {
        console.error('openSearchUI error', e);
    }
}
function showOverlay() {
    try {
        // Avoid duplicate overlays
        // Avoid duplicate overlays
        // use a distinct class for this links overlay so it doesn't collide with other overlays
        if (document.querySelector('.no-input-overlay-links')) return;

    const overlay = document.createElement('div');
        overlay.classList.add('no-input-overlay-links');
        overlay.style.position = 'absolute';
        overlay.style.left = '50%';
        overlay.style.top = '50px';
        overlay.style.transform = 'translateX(-50%)';
        overlay.style.background = 'rgba(0, 0, 0, 0.58)';
        overlay.style.color = 'white';
        overlay.style.padding = '18px 22px';
        overlay.style.borderRadius = '10px';
        overlay.style.zIndex = '9999';
        overlay.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
        overlay.style.maxWidth = '700px';
        overlay.style.width = '90%';
    overlay.style.textAlign = 'left';

    const text = document.createElement('div');
    text.innerHTML = 'Skip this page next time by using these links:<br>- cipher.onl/search/YOUR_INPUT_HERE <br>- cipher.onl/search?YOUR_INPUT_HERE <br>- cipher.onl/search?input=YOUR_INPUT_HERE <br>Or, skip directly to the team page by using this link:<br>- cipher.onl/TEAM_ID_HERE ----MAKE SURE TO ONLY USE TEAMID FOR THIS LINK';        
        text.style.textAlign = 'left';
        overlay.appendChild(text);


        document.body.appendChild(overlay);
        
    } catch (e) {
        console.error('showOverlay error', e);
    }
}
document.addEventListener('keydown', (event) => {
  const target = event.target;
  const tag = target && target.tagName;

  // Ignore if user is typing in an input/textarea or contenteditable
  if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;

  // Ignore combos with modifier keys (except Shift for our special case)
  if (event.ctrlKey || event.altKey || event.metaKey) return;

  // Shift + Backspace → go to /home
  if (event.shiftKey && event.key === 'Backspace') {
    event.preventDefault();
    window.location.href = '/home';
    return;
  }

  // Space — go to /search
  if (event.code === 'Space' || event.key === ' ') {
    event.preventDefault(); // avoids page scroll
    window.location.href = '/search';
    return;
  }
});

// Show an overlay box on top of the search input when there's no URL-provided input.
function showNoInputOverlay() {
    try {
        // Avoid duplicate overlays
        if (document.querySelector('.no-input-overlay')) return;

        const overlay = document.createElement('div');
        overlay.classList.add('no-input-overlay');
        // initial styles; start invisible and transition to visible
        overlay.style.position = 'absolute';
        overlay.style.left = '50%';
        overlay.style.top = '510px';
        overlay.style.transform = 'translateX(-50%)';
        overlay.style.background = 'rgba(77, 0, 0, 0.57)';
        overlay.style.color = 'white';
        overlay.style.padding = '18px 22px';
        overlay.style.borderRadius = '10px';
        overlay.style.zIndex = '9999';
        overlay.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
        overlay.style.maxWidth = '700px';
        overlay.style.width = '90%';
        overlay.style.textAlign = 'center';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 300ms ease';

        const text = document.createElement('div');
        text.textContent = `You provided no input! Please paste a team's ID or Nickname in the search box provided.`;
        overlay.appendChild(text);


        document.body.appendChild(overlay);

    // trigger fade-in
    // allow the browser a tick to apply initial styles
    requestAnimationFrame(() => { overlay.style.opacity = '1'; });

        // Dismiss overlay on input or typing
        const input = document.getElementById('searchText');
        if (input) {
            const dismiss = () => { hideNoInputOverlay(); input.removeEventListener('input', dismiss); };
            input.addEventListener('input', dismiss);
            input.focus();
        }
    } catch (e) {
        console.error('showNoInputOverlay error', e);
    }
}
function showTypesOfInputs(){
    try {
        // Avoid duplicate overlays
        // use a distinct class for this types overlay so it doesn't collide with other overlays
        if (document.querySelector('.no-input-overlay-types')) return;

    const overlay = document.createElement('div');
        overlay.classList.add('no-input-overlay-types');
        overlay.style.position = 'absolute';
        overlay.style.left = '50%';
        overlay.style.top = '220px';
        overlay.style.transform = 'translateX(-50%)';
        overlay.style.background = 'rgba(0, 0, 0, 0.58)';
        overlay.style.color = 'white';
        overlay.style.padding = '18px 22px';
        overlay.style.borderRadius = '10px';
        overlay.style.zIndex = '9999';
        overlay.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
        overlay.style.maxWidth = '700px';
        overlay.style.width = '90%';
        overlay.style.textAlign = 'left';

    const text = document.createElement('div');
    text.innerHTML = 'Here are the types of inputs you can use:<br>- FACEIT Team ID <br>- Team Nickname<br>- FACEIT Team URL<br>';        
        text.style.textAlign = 'left';
        overlay.appendChild(text);


        document.body.appendChild(overlay);
        
    } catch (e) {
        console.error('showTypesOfInputs error', e);
    }
}
function showNoOutputOverlay() {
    try {
        // Avoid duplicate overlays
        if (document.querySelector('.no-input-overlay')) return;

        const overlay = document.createElement('div');
        overlay.classList.add('no-input-overlay');
        // initial styles; start invisible and transition to visible
        overlay.style.position = 'absolute';
        overlay.style.left = '50%';
        overlay.style.top = '510px';
        overlay.style.transform = 'translateX(-50%)';
        overlay.style.background = 'rgba(77, 0, 0, 0.57)';
        overlay.style.color = 'white';
        overlay.style.padding = '18px 22px';
        overlay.style.borderRadius = '10px';
        overlay.style.zIndex = '9999';
        overlay.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
        overlay.style.maxWidth = '700px';
        overlay.style.width = '90%';
        overlay.style.textAlign = 'center';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 300ms ease';

        const text = document.createElement('div');
        text.textContent = `I couldn't find the FACEIT team correlating to your input. Please check what you wrote and make sure it is correct.`;
        overlay.appendChild(text);


        document.body.appendChild(overlay);

    // trigger fade-in
    // allow the browser a tick to apply initial styles
    requestAnimationFrame(() => { overlay.style.opacity = '1'; });

        // Dismiss overlay on input or typing
        const input = document.getElementById('searchText');
        if (input) {
            const dismiss = () => { hideNoInputOverlay(); input.removeEventListener('input', dismiss); };
            input.addEventListener('input', dismiss);
            input.focus();
        }
    } catch (e) {
        console.error('showNoInputOverlay error', e);
    }
}
function hideNoInputOverlay() {
    try {
        const el = document.querySelector('.no-input-overlay');
        if (!el) return;

        // start fade-out; if no transition is present, remove immediately
        el.style.opacity = '0';
        const duration = 300; // must match transition duration in ms
        // Ensure cleanup after transition
        setTimeout(() => {
            try { el.remove(); } catch (e) { /* ignore */ }
        }, duration + 20);
    } catch (e) {
        console.error('hideNoInputOverlay error', e);
    }
}

// Hide the secondary overlay created by showOverlay()
function hideSecondaryOverlay() {
    try {
        console.log("WHAT??????!!");
        // remove any of the secondary overlay variants (links/types)
        const links = document.querySelectorAll('.no-input-overlay-links');
        const types = document.querySelectorAll('.no-input-overlay-types');
        links.forEach(el => el.remove());
        types.forEach(el => el.remove());
    } catch (e) {
        console.error('hideSecondaryOverlay error', e);
    }
}