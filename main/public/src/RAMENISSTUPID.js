const useSteamEl = document.getElementById("useSteam");
if (useSteamEl) {
  useSteamEl.addEventListener('click', (event) => {
    const steamCheckbox = document.getElementById("steam");
    if (!steamCheckbox) return;
    // If the click came from the checkbox itself or its label, let the browser handle it
    const clickedInputOrLabel = event.target === steamCheckbox || event.target.closest('label[for="steam"]') || steamCheckbox.contains(event.target);
    if (clickedInputOrLabel) return;
    // Simulate a user click so the browser dispatches the proper change event and accessibility events
    steamCheckbox.click();
  });
}
/*
async function faceitButtonClick() {
    try {
      const response = await FACEIT.loginWithFaceit();
      console.log("FACEIT login response:", response);
    } catch (err) {
      console.error("FACEIT login failed:", err);
    }
  };
  
  */
const faceitLoginEl = document.getElementById("faceitLogin");
if (faceitLoginEl) {
  faceitLoginEl.onclick = null; /*faceitButtonClick; */
}
const steamlLoginEl = document.getElementById("steam");
if(steamlLoginEl){
  steamlLoginEl.addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    console.log("Steam checkbox changed:", isChecked);
    const faceitNameEl = document.getElementById('faceitname');
          document.getElementById("faceitLogin").onmouseout = function() {
        document.getElementById("faceitLogin").style.transition = "filter 0.5s ease";
        document.getElementById("faceitLogin").style.filter = "drop-shadow(1px 1px 2px rgba(11, 129, 180, 0))";
      };
    if (isChecked) {
      if (faceitNameEl) {
        faceitNameEl.innerHTML = '<image id="steamlogoo" src="images/steamlogo.png" style="height: 30px; position: relative; top: 5px;"></image> Steam';
        // set CSS variable to steam color
        faceitNameEl.style.setProperty('--pulse-color', 'rgba(11, 130, 180, 1)');
        console.log('Applied steam pulse color to #faceitname');
      }
      document.getElementById("sso-desc").innerText = "When you log in using steam, we will use your steam id to find your faceit profile. If you are actively playing in ESEA League, you will be able to access the picks and bans of your upcoming matches in ESEA League AUTOMATICALLY.";
      document.getElementById("faceitLogin").src = "images/loginwithsteam.png";
      document.getElementById("faceitLogin").onmouseover = function() {
        document.getElementById("faceitLogin").style.transition = "filter 0.5s ease";
        document.getElementById("faceitLogin").style.filter = "drop-shadow(1px 1px 2px rgba(11, 130, 180, 1))";
      };
      document.getElementById("faceitLogin").onclick = function() {
        console.log("LOGIN WITH STEAM LOL");
      };
    } 
    else {
      if (faceitNameEl) {
        faceitNameEl.innerHTML = '<image id="faceitlogoo" src="images/FACEIT.png" style="height: 30px"></image> FACEIT';
        // reset to default colour
        faceitNameEl.style.setProperty('--pulse-color', '#FF6900');
        console.log('Reverted pulse color on #faceitname');
      }
      document.getElementById("sso-desc").innerText = "When you log in, we will use your faceit profile name to find if you are actively playing in ESEA League, if you are, you will be able to access the picks and bans of your upcoming matches in ESEA League AUTOMATICALLY.";
      document.getElementById("faceitLogin").src = "images/LOGINWITHFACEIT.png";
      document.getElementById("faceitLogin").onmouseover = function() {
        document.getElementById("faceitLogin").style.transition = "filter 0.5s ease";
        document.getElementById("faceitLogin").style.filter = "drop-shadow(1px 1px 2px #FF6900)";
      };
      document.getElementById("faceitLogin").onclick = null;//faceitButtonClick;
    } 
});
}
window.onload = () => {
  // --- SSO overlay helpers: shows/hides the sign-in card when the .menu/.hamb is clicked ---
  function showSSOOverlay() {
    try {
      const overlay = document.getElementById('sso-overlay');
      if (!overlay) return;
      if (overlay.classList.contains('sso-overlay-active')) return;
      overlay.style.display = 'flex';
      overlay.classList.add('sso-overlay-active');
      overlay.setAttribute('aria-hidden', 'false');
      document.getElementById('menuButton').style.transition = 'opacity 300ms ease';
      document.getElementById('menuButton').style.opacity = 0;
      
      const checkbox = document.getElementById('remember-me');
      if (checkbox && localStorage.getItem('rememberMe') === 'true') checkbox.checked = true;
      const faceit = document.getElementById('faceit-sso');
      if (faceit) faceit.focus();
    } catch (e) { console.error('showSSOOverlay error', e); }
  }
  function hideSSOOverlay() {
    try {
      const overlay = document.getElementById('sso-overlay');
      if (!overlay) return;
      overlay.style.display = 'none';
      overlay.classList.remove('sso-overlay-active');
      overlay.setAttribute('aria-hidden', 'true');
      document.getElementById('menuButton').style.opacity = 1;
    } catch (e) { console.error('hideSSOOverlay error', e); }
  }

  // Toggle when menu / hamb is clicked
  const $menuBtn = document.querySelector('.menu');
  if ($menuBtn) {
    $menuBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const overlay = document.getElementById('sso-overlay');
      if (!overlay) return;
      if (overlay.style.display === 'flex') hideSSOOverlay(); else showSSOOverlay();
    });
  }

  // Close when clicking outside the card
  const ssoOverlayEl = document.getElementById('sso-overlay');
  if (ssoOverlayEl) {
    ssoOverlayEl.addEventListener('click', (e) => { if (e.target === ssoOverlayEl) hideSSOOverlay(); });
  }

  // Close button
  const ssoClose = document.querySelector('.sso-close');
  if (ssoClose) ssoClose.addEventListener('click', hideSSOOverlay);

  // FACEIT SSO button (placeholder)
  const faceitBtn = document.getElementById('faceit-sso');
  if (faceitBtn) {
    faceitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Replace this with a real OAuth redirect when backend is ready

      const remember = document.getElementById('remember-me');
      if (remember && remember.checked) localStorage.setItem('rememberMe', 'true');
      else localStorage.removeItem('rememberMe');
    });
  }

  const rememberCheckbox = document.getElementById('remember-me');
  if (rememberCheckbox) {
    rememberCheckbox.addEventListener('change', (e) => {
      const checked = e.target.checked;
      if (checked) localStorage.setItem('rememberMe', 'true'); else localStorage.removeItem('rememberMe');
    });
  }

  // Close overlay on Escape
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') hideSSOOverlay(); });

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
  
  if (_searchIconImmediate) {
   
    _searchIconImmediate.addEventListener('click', (ev) => {
      
      const val = _searchInputImmediate ? _searchInputImmediate.value.trim() : '';
     
      if (val !== '') {
        
        window.location.href = `/search/${encodeURIComponent(val)}`;
      } else {
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
    
document.addEventListener('keydown', (event) => {
  const target = event.target;
  const tag = target && target.tagName;

  // Ignore if user is typing in an input/textarea or contenteditable
  if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;

  // Ignore combos with modifier keys (except Shift for our special case)
  if (event.ctrlKey || event.altKey || event.metaKey) return;

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