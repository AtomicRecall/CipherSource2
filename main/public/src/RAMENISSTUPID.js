window.onload = () => {
  let $search = document.querySelector('.search');
  let $root = document.querySelector('.root');



    [$search, document.getElementById("fart")].forEach(el => {

        el.addEventListener('hover', (event) =>{

        })
        el.addEventListener('click', (event) => {

        console.log(event.target.classList);

        if(document.querySelector(".search-icon").classList.contains("Searchmove")){
                document.querySelector(".search-icon").classList.remove("Searchmove");
        }

            if(event.target.classList.contains("search-icon") || event.target.tagName.toLowerCase() === 'circle' || event.target.classList.contains("search-line") ){
                
                document.querySelector(".container .result").innerHTML = "";    
                ClickSearch(event);
                document.querySelector(".search-icon").style.filter = "drop-shadow(1px 1px 2px #FF6900)";
                

                return;
            }
            else{
                
                if (document.querySelector(".search-icon").classList.contains("moveSearch")){
                    document.querySelector(".search-icon").classList.remove("moveSearch");
                    document.querySelector(".search-icon").classList.add("Searchmove");
                    document.querySelector(".container .text").style.width = "700px";
                    document.querySelector(".container .text").style.transform = "translateY(0px)";
                    document.querySelector("#actualText .search-text").style.transform = "translate(0, 8px)";
                    document.getElementById("actualText").style.transform = "translateX(0px)";
                    document.querySelector(".search-icon").style.filter = "drop-shadow(0px 0px 0px #FF6900)";
                    document.querySelector(".result").innerHTML = "";
                }
            }

        

        document.querySelector(".container .text").style.backgroundColor = "#0000005e";

        let classes = $root.classList;
        if (classes.contains('search-open') && classes.contains('search-close')) {
        classes.remove('search-close');
        document.querySelector(".search-icon circle").style.stroke = "#FFFFFF";
        document.querySelector(".search-icon line").style.stroke = "#FFFFFF";
        document.querySelectorAll("#thing").forEach(el => { el.style.background ="#FFFFFF";});
        
        } else if (classes.contains('search-open')) {
        classes.add('search-close');
        document.querySelector(".search-icon circle").style.stroke = "#000000";
        document.querySelector(".search-icon line").style.stroke = "#000000";
        document.querySelectorAll("#thing").forEach(el => {  el.style.background ="#000000";});

        } else {
        classes.add('search-open');
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
};

function fadeInViaTransition(el, duration = 500) {
  el.style.opacity = 0;
  el.style.transition = `opacity ${duration}ms ease`;
  // Force a reflow so the browser commits opacity:0 as a starting point
  void el.offsetWidth; // or el.getBoundingClientRect();
  el.style.opacity = 1;
}

async function ClickSearch(event){

    //console.log(document.getElementById("searchText").value);

    if (document.querySelector(".search-icon").classList.contains('search-open')){
        document.querySelector(".search-icon").classList.remove("search-open")
    }
    document.querySelector(".search-icon").classList.add("moveSearch");
    document.querySelector("#actualText .search-text").style.transform = "translate(-35px, 8px)";
    document.querySelector(".container .text").style.width = "1750px";
    document.querySelector(".container .text").style.transform = "translateY(-328px)";
    document.getElementById("actualText").style.transform = "translateX(-550px)";
    document.getElementById("actualText").style.position = "relative";



    document.getElementById("searchText").disabled = true;

    await fetch(`https://open.faceit.com/data/v4/search/teams?nickname=${document.getElementById("searchText").value}&game=cs2`,{
        headers:{
            'accept': 'application/json',
            'Authorization': 'Bearer 503892e2-2d7b-4373-ab3e-69f53a6acdd3'
        }})
    .then(response => {
        // Check if the request was successful (status code 200-299)
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the response body as JSON
        return response.json();
    })
    .then(data =>{
        // Handle the fetched data
       // console.log(data);
        
        for(const team of data.items){

            fetch(`https://open.faceit.com/data/v4/teams/${team.team_id}`,{
            headers:{
                'accept': 'application/json',
                'Authorization': 'Bearer 503892e2-2d7b-4373-ab3e-69f53a6acdd3'
            }})
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data =>{
             //   console.log("HOLY SHIT:")
              //  console.log(data);

                document.getElementById("searchText").disabled = false;
                document.querySelector(".search-icon").style.filter = "drop-shadow(0px 0px 0px #FF6900)";
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
                    //TODO: 
                    //FIX THIS SHIT LATER WHEN YOU ACTUALLY START PORT FORWARDING YOUR SERVER LOL
                    //window.location.href = `${window.location.origin}/?${team.team_id}`;
                    
                    window.location.href = `${window.location.origin}?${team.team_id}`;
                })



            fetch(`https://open.faceit.com/data/v4/teams/${team.team_id}/stats/cs2`,{
            headers:{
                'accept': 'application/json',
                'Authorization': 'Bearer 503892e2-2d7b-4373-ab3e-69f53a6acdd3'
            }})
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            // After fetching stats data
            .then(data => {
                //console.log("HOLY FART");
                //console.log(data);

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
                //encompassingDivider.appendChild(carouselWrapper);

                // Build slides
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
    })
    .catch(error =>{
        // Handle any errors that occurred during the fetch operation
        console.error('Error fetching data:', error);
    });
    
}
document.getElementById("searchText").addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            ClickSearch(event)
        }
    });
function countryCodeToFlag(code) {
    const codePoints = [...code.toUpperCase()].map(char => char.charCodeAt(0) + 127397);
    return String.fromCodePoint(...codePoints);
}