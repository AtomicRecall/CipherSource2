// Search logic and helpers extracted from RAMENISEVENMORESTUPID.js
// Exposes ClickSearch on window so other scripts can call it or the URL-driven flow can invoke it.

function getFaceitHeaders() {
  return {
    'accept': 'application/json',
    'Authorization': `Bearer 503892e2-2d7b-4373-ab3e-69f53a6acdd3`
  };
}

function countryCodeToFlag(code) {
    const codePoints = [...code.toUpperCase()].map(char => char.charCodeAt(0) + 127397);
    return String.fromCodePoint(...codePoints);
}

function fadeInViaTransition(el, duration = 500) {
  el.style.opacity = 0;
  el.style.transition = `opacity ${duration}ms ease`;
  void el.offsetWidth;
  try { document.getElementById("searchText").disabled = false; } catch (e) {}
  el.style.opacity = 1;
}

// Team ID pattern and helper to extract a Faceit team ID from a URL or raw input
const teamIdPattern = /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/;
function extractFaceitTeamId(input) {
    if (!input || typeof input !== 'string') return null;
    const trimmed = input.trim();
    // If the entire input is already the ID, return it
    if (teamIdPattern.test(trimmed)) return trimmed;
    // Otherwise try to find a UUID-like token inside the string (e.g. inside a URL)
    const found = trimmed.match(/[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}/);
    return found ? found[0] : null;
}

// Keep ClickSearch as an async function attached to window for global access
window.ClickSearch = async function ClickSearch(input){

    console.log("WHAT???? !!!!",input);

    if (document.querySelector(".search-icon").classList.contains('search-open')){
        document.querySelector(".search-icon").classList.remove("search-open")
    }
    document.querySelector(".search-icon").classList.add("moveSearch");
    document.querySelector("#actualText .search-text").style.transform = "translate(-35px, 8px)";
    document.querySelector(".container .text").style.width = "1750px";
    document.querySelector(".container .text").style.transform = "translateY(-328px)";
    document.getElementById("actualText").style.transform = "translateX(-550px)";
    document.getElementById("actualText").style.position = "relative";
    try { document.getElementById("searchText").disabled = true; } catch(e){}

    let teamsFound;
    // allow passing either a full Faceit URL or the raw team id
    const extractedId = extractFaceitTeamId(input);
    if (!extractedId) {
        
        await fetch(`https://open.faceit.com/data/v4/search/teams?nickname=${encodeURIComponent(input)}&game=cs2`,{
            headers: getFaceitHeaders()
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data =>{
            if(data.items.length < 1){
                alert("Was not able to retrieve teams from your input!");
                try { document.getElementById("searchText").disabled = false; } catch(e){}
                try { document.getElementById("searchText").value = ""; } catch(e){}
                return;
            }
            teamsFound = data.items;
        })
        .catch(error =>{
            console.error('Error fetching data:', error);
        });
    } else {
        // Use the extracted id directly
        document.getElementById("searchText").value = extractedId;
        teamsFound = [{ team_id: extractedId }];
    }

    for(const team of teamsFound){

        fetch(`https://open.faceit.com/data/v4/teams/${team.team_id}`,{
            headers: getFaceitHeaders()
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data =>{
            if (data.members.length < 5){
                return;
            }
            let encompassingDivider = document.createElement("div");
            encompassingDivider.classList.add("fart");
            encompassingDivider.style.backgroundColor = "#0000005e";
                let name = document.createElement("div");
                name.id = "name";
                name.innerHTML = data.name+"<a>("+data.nickname+")</a>";
                name.style.color = "white";
                encompassingDivider.appendChild(name);

                let pic = document.createElement("img");
                pic.src = data.avatar;
                if(data.avatar === undefined || data.avatar == "undefined"){
                    pic.src = "../images/DEFAULT.jpg";
                }
                pic.style.width = "150px";
                pic.style.height = "150px";
                pic.style.borderRadius = "20px";
                pic.style.margin = "10px";
                encompassingDivider.appendChild(pic);

                let buttonsAndShit = document.createElement("div");
                buttonsAndShit.style.width = "250px";
                buttonsAndShit.style.transform = "translate(173px, -80px)";
                buttonsAndShit.style.overflowX = "auto";
                buttonsAndShit.style.height = "75px";
                buttonsAndShit.style.alignItems = "end";
                buttonsAndShit.style.overflowY = "hidden";
                buttonsAndShit.style.display = "flex";
                
                    let faceitButton = document.createElement("img");
                    faceitButton.src = "../images/FACEIT.png";
                    faceitButton.id = "faceit";
                    faceitButton.style.width = "35px";
                    faceitButton.style.height = "30px";
                    faceitButton.style.position = "absolute";
                    faceitButton.style.transform = "translate(440px,165px)";
                    faceitButton.onclick = () =>{
                        window.open(data.faceit_url.replace("{lang}","en"), "_blank");
                    }
                    

                    let playerPicturesAndShit = document.createElement("div");
                    playerPicturesAndShit.style.position = "absolute";
                    playerPicturesAndShit.style.width = "300px";
                    playerPicturesAndShit.style.display = "flex";
                    let playerCount = 0;

                        for(const player of data.members){
                            playerCount++;

                            let playerdivider = document.createElement("div");
                                let picandhat = document.createElement("div");
                                picandhat.id = "picandhat";
                                    let picture = document.createElement("img");
                                    picture.src = player.avatar;
                                    picture.style.borderRadius = "10px";
                                    picture.style.marginRight = "5px";
                                    picture.id = "player";
                                    if(player.avatar == undefined || player.avatar === "undefined"){
                                        picture.src = "../images/DEFAULT.jpg";
                                    }
                                    
                                    if(player.user_id == data.leader){
                                        let captianHat = document.createElement("img");
                                        captianHat.src = "../images/CAPTAIN.png";
                                        captianHat.style.height = "25px";
                                        captianHat.style.width = "25px";
                                        captianHat.style.position = "absolute";
                                        captianHat.style.transform = "translate(2px, -15px)";
                                        picandhat.classList.add("hasCaptain");
                                        picandhat.appendChild(captianHat)
                                    }
                                    picandhat.appendChild(picture);
                                let playername = document.createElement("div");
                                playername.id = "playername";
                                playername.style.color = "white";
                                playername.fontSize = "1.5rem";
                                playername.textContent = countryCodeToFlag(player.country)+" "+player.nickname;
                                playerdivider.appendChild(playername);
                                playerdivider.appendChild(picandhat);
                            playerPicturesAndShit.appendChild(playerdivider);

                                picture.addEventListener('mouseenter', () => {
                                    playername.style.opacity = "1";
                                    if(picandhat.classList.contains("hasCaptain")){
                                        playername.style.transform = "translateY(-20px)";
                                    }
                                });
                                picture.addEventListener('click',() => {
                                window.open(player.faceit_url.replace("{lang}","en"), "_blank");
                                })
                                picture.addEventListener('mouseleave', () => {
                                playername.style.opacity = "0";
                                });
                        }

                        let goToBanReaderButton = document.createElement("button");
                        goToBanReaderButton.textContent = "Start reading Picks and Bans";
                        goToBanReaderButton.position = "absolute";
                        goToBanReaderButton.classList.add("GoToBanreader");

                        let addtodatabasebutton = document.createElement("button");
                        addtodatabasebutton.textContent = "+";
                        addtodatabasebutton.position = "absolute";
                        addtodatabasebutton.classList.add("addtodatabase");
                    buttonsAndShit.prepend(playerPicturesAndShit);
                encompassingDivider.appendChild(buttonsAndShit);
                buttonsAndShit.after(faceitButton);
                encompassingDivider.appendChild(addtodatabasebutton);
                encompassingDivider.appendChild(goToBanReaderButton);
                
            document.querySelector(".result").appendChild(encompassingDivider);
            fadeInViaTransition(encompassingDivider, 1000);

            goToBanReaderButton.addEventListener('mouseenter', () => {
                const randomDeg = (Math.random() * 6 - 3).toFixed(2); // Random between -2deg and 2deg
                goToBanReaderButton.style.transform = `translate(425px,52px) scale(1.05) rotate(${randomDeg}deg)`;
            });
            goToBanReaderButton.addEventListener('mouseleave', () => {
                goToBanReaderButton.style.transform = 'translate(425px,52px) scale(1) rotate(0deg)';
            });
            goToBanReaderButton.addEventListener('click', () => {
                console.log(team);
                window.location.href = `${window.location.origin}/${team.team_id}`;
            })


        fetch(`https://open.faceit.com/data/v4/teams/${team.team_id}/stats/cs2`,{
            headers: getFaceitHeaders()
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Carousel wrapper
                let carouselWrapper = document.createElement("div");
                carouselWrapper.classList.add("carousel-wrapper");

                let carouselTrack = document.createElement("div");
                carouselTrack.classList.add("carousel-track");
                carouselWrapper.appendChild(carouselTrack);

                // Navigation buttons
                let prevButton = document.createElement("button");
                prevButton.classList.add("carousel-btn", "prev");
                prevButton.textContent = "⟨";

                let nextButton = document.createElement("button");
                nextButton.classList.add("carousel-btn", "next");
                nextButton.textContent = "⟩";

                carouselWrapper.appendChild(prevButton);
                carouselWrapper.appendChild(nextButton);
                pic.after(carouselWrapper)

                for (const map of data.segments) {
                    
                    let divider = document.createElement("div");
                    divider.classList.add("map-divider");

                    let picture = document.createElement("img");
                    picture.src = map.img_regular;
                    picture.style.width = "300px";
                    picture.style.height = "150px";
                    picture.style.transform = "translate(-100px, -18px)";
                    picture.style.position = "absolute";
                    picture.style.zIndex = "-10";
                    picture.style.borderRadius = "5px";

                    let label = document.createElement("div");
                    label.textContent = map.label;
                    label.style.transform = "translate(50px,-18px)";
                    label.style.filter = "drop-shadow(1px 1px 1px black)";
                    label.style.fontSize = "1.7rem";
                    label.style.textDecoration = "underline";

                    let stats = map.stats;
                    let wins = stats.Wins;
                    let loss = stats.Matches - wins;
                    let rate = stats['Win Rate %'];

                    let statsBox = document.createElement("div");
                    statsBox.classList.add("map-stats");
                    statsBox.style.filter = "drop-shadow(1px 1px 1px black)";
                    statsBox.style.fontSize = "1.4rem";
                    statsBox.innerHTML = `
                        <div>Wins: <b>${wins}</b></div>
                        <div>Losses: <b>${loss}</b></div>
                        <div>Win Rate: <b>${rate}%</b></div>
                    `;
                    statsBox.style.transform = "translate(50px,-30px)";
                    divider.appendChild(picture);
                    divider.appendChild(label);
                    divider.appendChild(statsBox);

                    carouselTrack.appendChild(divider);
                }

                // Carousel Logic
                let currentIndex = 0;
                const slides = carouselTrack.querySelectorAll(".map-divider");
                const totalSlides = slides.length;
                
                // mark the first slide as visible
                if (slides[0]) slides[0].classList.add("active");
                function updateCarousel() {
                    carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
                    slides.forEach((s, i) => {
                        if (i === currentIndex) {
                        s.classList.add("active");
                        } else {
                        s.classList.remove("active");
                        }
                    });
                }

                prevButton.addEventListener("click", () => {
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                    updateCarousel();
                    stopAutoSlide();
                    startAutoSlide();
                });

                nextButton.addEventListener("click", () => {
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateCarousel();
                    stopAutoSlide();
                    startAutoSlide();
                });

                let autoSlideInterval = null;
                const slideDelay = 4000; // 4 seconds per slide

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

                // Initialize
                updateCarousel();
                startAutoSlide();
            })
            })
            .catch(error =>{
                // Handle any errors that occurred during the fetch operation
                console.error('Error fetching data:', error);
            });
        }
}
