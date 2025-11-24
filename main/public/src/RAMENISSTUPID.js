function showTypesOfInputs(){
    try {
        // Avoid duplicate overlays
        // use a distinct class for this types overlay so it doesn't collide with other overlays
        if (document.querySelector('.no-input-overlay-types')) return;

    const overlay = document.createElement('div');
        overlay.classList.add('no-input-overlay-types');
        overlay.style.position = 'absolute';
        overlay.style.left = '50%';
        overlay.style.top = '205px';
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
    text.innerHTML = 'Here are the types of inputs you can use:<br>- FACEIT Team ID <br>- Team Nickname<br>- FACEIT Team URL<br>- FACEIT Match ID<br>- Direct Match URL';        
        text.style.textAlign = 'left';
        overlay.appendChild(text);


        // Append overlay to the main container so it moves with the app UI
        const parentContainer = document.querySelector('.container') || document.querySelector('.root') || document.body;
        try {
          const parentStyle = window.getComputedStyle(parentContainer);
          if (parentStyle.position === 'static') {
            parentContainer.style.position = 'relative';
          }
        } catch (e) { /* ignore if computed style unavailable */ }
        parentContainer.appendChild(overlay);
        
    } catch (e) {
        console.error('showTypesOfInputs error', e);
    }
}
function showOverlay() {
    try {
      // Avoid duplicate overlays: use the shared "links" overlay class so the home page and search page match
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
    // start invisible and fade in
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 300ms ease';

        const text = document.createElement('div');
        text.innerHTML = 'Skip this page next time by using these links:<br>- cipher.onl/search/YOUR_INPUT_HERE <br>- cipher.onl/search?YOUR_INPUT_HERE <br>- cipher.onl/search?input=YOUR_INPUT_HERE <br>Or, skip directly to the team page by using this link:<br>- cipher.onl/TEAM_ID_HERE ----MAKE SURE TO ONLY USE TEAMID FOR THIS LINK';
        text.style.textAlign = 'left';
        overlay.appendChild(text);



  // Append the links overlay into the main container so it remains inside
  // the main UI and moves when the container shifts/zooms.
  const parentContainer = document.querySelector('.container') || document.querySelector('.root') || document.body;
  try {
    const parentStyle = window.getComputedStyle(parentContainer);
    if (parentStyle.position === 'static') parentContainer.style.position = 'relative';
  } catch (e) {}
  parentContainer.appendChild(overlay);
  // trigger fade-in on next frame
  requestAnimationFrame(() => { overlay.style.opacity = '1'; });

    // Dismiss overlay on input or typing — use the shared hide function that removes both secondary overlay variants
    const input = document.getElementById('searchText');
    if (input) {
      const dismiss = () => { try { hideSecondaryOverlay(); } catch (e) { hideNoInputOverlay(); } input.removeEventListener('input', dismiss); };
      input.addEventListener('input', dismiss);
      input.focus();
    }
  } catch (e) {
    console.error('showOverlay error', e);
  }
}
window.onload = () => {
  let $search = document.querySelector('.search');
  let $root = document.querySelector('.root');



    [$search, document.getElementById("fart")].forEach(el => {
        
        el.addEventListener('click', (event) => {
          showTypesOfInputs();
        showOverlay();
        console.log(event.target.classList);

    const _searchIcon = document.getElementById("SearchIcon");
    const _searchInput = document.getElementById("searchText");
    if (_searchIcon) {
      _searchIcon.onclick = function() {
        const val = _searchInput ? _searchInput.value.trim() : '';
        if (val !== '') {
          // Navigate to the search route with the input as path
          window.location.href = `/search/${encodeURIComponent(val)}`;
        } else {
          alert("You wrote nothing in the input!");
          document.getElementById("searchText").disabled = false;
        }
      };
    }
        
            if((event.target.tagName.toLowerCase() === 'circle' || event.target.classList.contains("search-line") && event.target.classList.contains("search-icon"))){
                
                document.querySelector(".container .result").innerHTML = "";    
                
                return;
            }
            else{
                
                if (document.querySelector(".search-icon").classList.contains("moveSearch")){
                    document.querySelector(".search-icon").classList.remove("moveSearch");
                    document.querySelector(".container .text").style.width = "700px";
                    document.querySelector(".container .text").style.transform = "translateY(0px)";
                    document.querySelector("#actualText .search-text").style.transform = "translate(0, 8px)";
                    document.getElementById("actualText").style.transform = "translateX(0px)";
                    
                    document.querySelector(".result").innerHTML = "";
                    
                }
            }

        

        document.querySelector(".container .text").style.backgroundColor = "#0000005e";

        let classes = $root.classList;
        if (classes.contains('search-open') && classes.contains('search-close')) {
        classes.remove('search-close');
        
        const searchIcon = document.querySelector('.search-icon');
        const actualText = document.getElementById('actualText');

        // Only move if it’s not already inside #actualText
        if (searchIcon && actualText && !actualText.contains(searchIcon)) {
            actualText.appendChild(searchIcon);
            searchIcon.style.top = "3px";
            
            // Optional: style for positioning at the end
            searchIcon.style.marginLeft = "auto";
        }
        document.querySelector(".search-icon circle").style.stroke = "#FFFFFF";
        document.querySelector(".search-icon line").style.stroke = "#FFFFFF";
        document.querySelectorAll("#thing").forEach(el => { el.style.background ="#FFFFFF";});
        
        } else if (classes.contains('search-open')) {
        classes.add('search-close');
        window.location.href = "/home";
        const searchIcon = document.querySelector('.search-icon');
        const searchDivider = document.querySelector('.search');

        if (searchIcon && searchDivider) {
            searchDivider.appendChild(searchIcon);
        }

        document.querySelector(".search-icon circle").style.stroke = "#000000";
        document.querySelector(".search-icon line").style.stroke = "#000000";
        document.querySelectorAll("#thing").forEach(el => {  el.style.background ="#000000";});
        document.getElementById("searchText").disabled = false;
        document.getElementById("searchText").value = "";
        } else {
        classes.add('search-open');
        const searchIcon = document.querySelector('.search-icon');
        const actualText = document.getElementById('actualText');

        // Only move if it’s not already inside #actualText
        if (searchIcon && actualText && !actualText.contains(searchIcon)) {
            actualText.appendChild(searchIcon);
            searchIcon.style.top = "3px";
            
            // Optional: style for positioning at the end
            searchIcon.style.marginLeft = "auto";
        }
        document.querySelector(".search-icon circle").style.stroke = "#FFFFFF";
        document.querySelector(".search-icon line").style.stroke = "#FFFFFF";
        document.querySelectorAll("#thing").forEach(el => { el.style.background ="#FFFFFF";});

        
    
        
        }
  });
    });
  const headers = [
    "After nine years in development,",
    "Hopefully It would've been worth the wait.",
    "Thanks, and have fun.",
    "Your go-to platform for CS2 pick and ban insights. ",
    "This is currently a very early in production Alpha",
    "So any feedback is appreciated :)"
  ];

  const headerEl = document.querySelector(".intro h2");
  let index = 0;

  function changeHeader(extra, headers2) {

    
    // fade out
    headerEl.classList.remove("show");
    headerEl.classList.add("fade");

    if(extra){
        extra.classList.remove("show");
        extra.classList.add("fade");
    }

    setTimeout(() => {
      // change text after fade
      headerEl.textContent = headers[index];
      headerEl.classList.remove("fade");
      headerEl.classList.add("show");


      if(extra){
        extra.textContent = headers2[index];
        extra.classList.remove("fade");
        extra.classList.add("show");
      }
      // next index
      index = (index + 1) % headers.length;
    }, 600); // match transition time
  }

  // start cycle
  headerEl.textContent = headers[index];
  headerEl.classList.add("show");
  index++;

  setInterval(changeHeader, 4000);
  // Ensure the search icon in the input always works even if the user hasn't clicked elsewhere
  const _searchIconImmediate = document.getElementById("SearchIcon");
  const _searchInputImmediate = document.getElementById("searchText");
  console.log('[startup] searchIcon element:', !!_searchIconImmediate, 'searchInput element:', !!_searchInputImmediate);
  if (_searchIconImmediate) {
    console.log('[startup] attaching click handler to #SearchIcon');
    _searchIconImmediate.addEventListener('click', (ev) => {
      console.log('[SearchIcon] click event fired', ev);
      const val = _searchInputImmediate ? _searchInputImmediate.value.trim() : '';
      console.log('[SearchIcon] current input value:', val);
      if (val !== '') {
        console.log('[SearchIcon] navigating to /search/' + val);
        window.location.href = `/search/${encodeURIComponent(val)}`;
      } else {
        console.log('[SearchIcon] no input, alerting user');
        alert('You wrote nothing in the input!');
        document.getElementById("searchText").disabled = false;
      }
    });
  } else {
    console.log('[startup] #SearchIcon not found on load');
  }
};

function fadeInViaTransition(el, duration = 500) {
  el.style.opacity = 0;
  el.style.transition = `opacity ${duration}ms ease`;
  // Force a reflow so the browser commits opacity:0 as a starting point
  void el.offsetWidth; // or el.getBoundingClientRect();
  document.getElementById("searchText").disabled = false;

  el.style.opacity = 1;

}


document.getElementById("searchText").addEventListener('keydown', (event) => {
  // Case 1: Shift + Backspace → go to /home
  if (event.shiftKey && event.key === 'Backspace') {
    window.location.reload();
    return;
  }

  // Case 2: Enter → go to /search/<value>
  if (event.key === 'Enter') {
    const input = document.getElementById('searchText');
    const val = input ? input.value.trim() : '';
    if (val !== '') {
      window.location.href = `/search/${encodeURIComponent(val)}`;
    } else {
      alert('You wrote nothing in the input!');
      document.getElementById("searchText").disabled = false;
    }
  }
});
    
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
function countryCodeToFlag(code) {
    const codePoints = [...code.toUpperCase()].map(char => char.charCodeAt(0) + 127397);
    return String.fromCodePoint(...codePoints);
}