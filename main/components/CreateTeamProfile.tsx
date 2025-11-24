"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Image } from "@heroui/react";
import React from "react";
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { Card } from "@heroui/react";
import FetchLatestUsername from "@/components/FetchLatestUsername";
import CreateStatsPage from "./CreateStatsPage";
import ObtainVetoInfo from "./FetchVetoInformation";
import StatsSkeleton from "./StatsSkeleton";
import RosterSkeleton from "./RosterSkeleton";
import CreateMatchNavbar from "@/components/CreateMatchNavbar";
import MatchNavbarSkeleton from "@/components/matchNavbarSkeleton";
import Flag from "@/components/Flag";
import CreateSkeleton from "@/components/ProfileCard";
import fetchTeamProfile from "@/components/FetchProfile";
interface PlayerStats {
  player_name: string;
  player_id: string;
  avatar_img:string;
  latest_player_name:string;
  count: number;
}
let thisSeason = 55;
const SEASON_LOGO_STANDARD = 30;
const SEASON_LOGO_SMALL = 23;


  const OpenPlayerName =
    (name: any) => (event: React.MouseEvent<HTMLParagraphElement>) => {
      event.preventDefault();
      event.stopPropagation();
      window.open("https://www.faceit.com/en/players/" + name);
      // Your custom logic here
    };

  function addRosterForSeason(memberz:any, season:any){
    const container = document.getElementById("PoopEater");
    if (!container) return;

    // Remove skeleton if it exists
    const skeletonCard = document.getElementById(`roster-skeleton-${season}`);
    if (skeletonCard) {
      console.log(`Removing skeleton for season ${season}`);
      skeletonCard.remove();
    }

    // Create the roster card element
    const rosterCard = document.createElement('div');
    rosterCard.className = 'flex gap-3 items-center border rounded-lg bg-cumground mt-1 -ml-1 flex-shrink-0 min-w-max mr-2';
    rosterCard.id = `roster-${season}`; // Add ID for easy removal
    
    // Add season logo
    const seasonLogo = document.createElement('img');
    seasonLogo.src = `images/S${season}logo.png`;
    seasonLogo.alt = `Season ${season}Logo`;
    seasonLogo.height = 40;
    seasonLogo.width = 40;
    seasonLogo.className = 'ml-2 mb-11';
    
    // Add colon
    const colon = document.createElement('p');
    colon.className = 'text-white text-xl mb-11 -ml-2';
    colon.textContent = ':';
    
    rosterCard.appendChild(seasonLogo);
    rosterCard.appendChild(colon);
    let MostMatchesPlayed = 0;
    for(const eachPlayer of memberz){
      if(eachPlayer.count > MostMatchesPlayed){
        MostMatchesPlayed = eachPlayer.count;
      }
    }
    
    // Sort players: main players (big avatars) first, then subs (small avatars)
    const sortedMembers = memberz.sort((a: any, b: any) => {
      const aIsSub = a.count <= MostMatchesPlayed/2;
      const bIsSub = b.count <= MostMatchesPlayed/2;
      
      // Main players come first (false sorts before true)
      if (aIsSub !== bIsSub) {
        return aIsSub ? 1 : -1;
      }
      
      // If both are same type, sort by match count (descending)
      return b.count - a.count;
    });
    
    // Add each member
    let hasAddedSubsLabel = false;
    sortedMembers.forEach((member1: any, index: number) => {
      const isSub = member1.count <= MostMatchesPlayed/2;
      
      // Add "SUBS:" label before the first sub
      if (isSub && !hasAddedSubsLabel) {
        const subsLabel = document.createElement('p');
        subsLabel.className = 'text-white text-md mr-2';
        subsLabel.textContent = 'SUBS:';
        rosterCard.appendChild(subsLabel);
        hasAddedSubsLabel = true;
      }
      const memberDiv = document.createElement('div');
      memberDiv.className = 'flex flex-col items-center mt-2 mr-4 mb-3';
      
      const nameP = document.createElement('p');
      nameP.className = 'text text-zinc-200 text-white [text-shadow:0px_1px_2px_black]';
      nameP.textContent = member1?.user_name || member1?.player_name;
      
      const avatarDiv = document.createElement('div');
      if(member1.count <= MostMatchesPlayed/2){
        avatarDiv.className = 'w-10 h-10 rounded-full cursor-pointer hover:shadow-[0_0_10px_1px_white] transition duration-200';
      }
      else{
        avatarDiv.className = 'w-12 h-12 rounded-full cursor-pointer hover:shadow-[0_0_10px_1px_white] transition duration-200';

      }
      avatarDiv.onclick = () => window.open("https://www.faceit.com/en/players/" + (member1?.latest_player_name));

      console.log("AVATAR ID?? "+member1?.avatar_img);

      const avatarImg = document.createElement('img');
            if(member1.count <= MostMatchesPlayed/2){
              avatarImg.className = 'w-10 h-10 rounded-full hover:shadow-[0_0_8px_white]';

      }
      else{
              avatarImg.className = 'w-12 h-12 rounded-full hover:shadow-[0_0_8px_white]';

      }
      avatarImg.src = member1?.avatar_img;
      avatarImg.onerror = () => {
        avatarImg.src = "/images/DEFAULT.jpg";
      };
      
      avatarDiv.appendChild(avatarImg);
      memberDiv.appendChild(nameP);
      memberDiv.appendChild(avatarDiv);
      rosterCard.appendChild(memberDiv);
    });
    
    // Append new roster without clearing existing content
    container.appendChild(rosterCard);
    
    // Sort rosters by season number (highest to lowest)
    sortRostersBySeason();
  }

  function removeRosterForSeason(season: any) {
    const container = document.getElementById("PoopEater");
    if (!container) return;

    // Find the roster card for this season and remove it
    const rosterCard = document.getElementById(`roster-${season}`);
    if (rosterCard) {
      rosterCard.remove();
     // console.log(`Removed roster for season ${season}`);
    } else {
      console.log(`No roster found for season ${season}`);
    }

    // Also remove skeleton if it exists
    const skeletonCard = document.getElementById(`roster-skeleton-${season}`);
    if (skeletonCard) {
      skeletonCard.remove();
    }
  }

  function sortRostersBySeason() {
    const container = document.getElementById("PoopEater");
    if (!container) return;

    // Get all roster cards (excluding the current season card which has no roster- prefix)
    const rosterCards = Array.from(container.children).filter(child => 
      child.id && child.id.startsWith('roster-')
    ) as HTMLElement[];

    // Sort by season number (highest to lowest)
    rosterCards.sort((a, b) => {
      const seasonA = parseInt(a.id.replace('roster-', ''));
      const seasonB = parseInt(b.id.replace('roster-', ''));
      return seasonB - seasonA; // descending order
    });

    // Re-append the sorted roster cards
    rosterCards.forEach(card => {
      container.appendChild(card);
    });
  }
export default function CreateTeamProfile() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const user = params.team_id as string;

  console.log("🔍 FuckWithProfile rendered with user:", user, "pathname:", pathname);

  // Early return if no user (team_id) or if we're not on a team route - prevents any rendering or API calls
  if (!user || pathname === '/home' || pathname === '/') {
    console.log("❌ No user found or not on team route, returning null");
    return null;
  }

  const [data, setData] = useState<any>(null); // holds team profile
  const [TeamData, setTeamData] = useState<any>(null); // holds team stats
  const [NewData, setNewData] = useState<any>(null); // holds team stats
  const [loading, setLoading] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [selectedMapKeys, setSelectedMapKeys] = useState<Set<string>>(
    new Set(),
  );
  const [uiNode, setUiNode] = useState<React.ReactElement[]>([]);
  const [navLoading, setNavLoading] = useState(false);
  const [loadingSeasonKeys, setLoadingSeasonKeys] = useState<Set<string>>(new Set());
  const [needsPlaceholder, setneedsPlaceholder] = useState(false); // Changed to false since we'll have a default selection

  // ✅ Clear sessionStorage once on page load
  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.removeItem("sizeBeforeClick");
      sessionStorage.removeItem("lastList");
    }
  }, []);

  // Navigate to /home when user presses Shift+Backspace
  useEffect(() => {
    const handleShiftBackspace = (e: KeyboardEvent) => {
      try {
        if (e.key === "Backspace" && e.shiftKey) {
          e.preventDefault();
          router.push("/home");
        }
      } catch (err) {
        // Fallback to location change if router fails for any reason
        window.location.href = "/home";
      }
    };

    window.addEventListener("keydown", handleShiftBackspace);
    return () => window.removeEventListener("keydown", handleShiftBackspace);
  }, [router]);

  // Avatar wrapper to handle fallback image
  function Avatar({
    src,
    alt,
    size = 50,
  }: {
    src: string;
    alt: string;
    size?: number;
  }) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
      <Image
        isBlurred
        isZoomed
        alt={alt}
        className={"cursor-pointer"}
        height={size}
        radius={"md"}
        src={imgSrc}
        width={size}
        onError={() => setImgSrc("/images/DEFAULT.jpg")}
      />
    );
  }

  useEffect(() => {
    console.log("🔄 useEffect triggered with user:", user, "pathname:", pathname);
    
    // Double-check that user exists and we're on a team route before making API calls
    if (!user || pathname === '/home' || pathname === '/') {
      console.log("❌ No user or not on team route in useEffect, skipping API call");
      return;
    }

    async function loadProfile() {
      console.log("🚀 Starting to load profile for user:", user);
      setLoading(true);
      try {
        const res = await fetchTeamProfile(user); // must return a Promise

        console.log("✅ Raw team profile data:", res);
        setData(res);
        document.title = "CS2 - " + res.teamdata?.name;
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user, pathname]);

  // Auto-select thisSeason when data is loaded
  useEffect(() => {
    if (data?.leagues?.[0]?.league_seasons_info && selectedKeys.size === 0) {
      // Helper to attempt selecting a season by number
      const trySelectSeasonAndDivision = (seasonNumber: number, division:string) => {
        const seasonObj = data.leagues[0].league_seasons_info.find(
          (s: any) => Number(s.season_number) === Number(seasonNumber),
        );

        if (seasonObj && seasonObj.season_standings?.length > 0) {
        const seasonKey = `S${seasonObj.season_number} ${division}`;
          const newSelectedKeys = new Set([seasonKey]);
          setSelectedKeys(newSelectedKeys);

          // Construct a mock keys object compatible with Dropdown's expected shape
          const mockKeys = new Set([seasonKey]) as any;
          mockKeys.currentKey = seasonKey;
          handleSelectionChange(mockKeys);
          return true;
        }
        return false;
      };

      // Try configured thisSeason first; if it has no results, fall back to thisSeason - 1
      const primary = Number(thisSeason);
      const seasonObj = data.leagues[0].league_seasons_info.find(
          (s: any) => Number(s.season_number) === Number(primary),
        );
      if (!trySelectSeasonAndDivision(primary,seasonObj.season_standings[0][0].division_name)) {
        // Try previous season as fallback
        trySelectSeasonAndDivision(primary,seasonObj.season_standings[0][1].division_name);
      }
    }
  }, [data, selectedKeys.size]);
  const OpenTeamName = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.preventDefault(); // if needed
    event.stopPropagation(); // if needed
    window.open("https://www.faceit.com/en/teams/" + data.teamdata?.team_id+"/leagues");
    // Your custom logic here
  };




  const handleSelectionChange = async (keys: any) => {
    // Determine sizes: previous (from state) and current (from incoming keys)
    const prevSize = selectedKeys?.size ?? 0;
    const curSize = keys?.size ?? 0;

    // Determine added and removed keys (strings)
    const prevSet = selectedKeys ?? new Set<string>();
    const prevArr = Array.from(prevSet);
    const curArr = Array.isArray(keys) ? keys : Array.from(keys as Set<string>);
    const added = curArr.filter((k: string) => !prevSet.has(k));
    const removed = prevArr.filter((k: string) => !(keys as Set<string>).has(k));

    // If any removed key is currently loading, block the removal
    const tryingToRemoveLoading = removed.some((k) => loadingSeasonKeys.has(k));
    if (tryingToRemoveLoading) {

      // Revert UI to previous selected keys
      setSelectedKeys(new Set(prevArr));
      return;
    }

    // Accept the change (additions or allowed removals)
    setSelectedKeys(keys);
    setneedsPlaceholder(false);
    console.log(keys);

    let B4Size = 0;
    let lastList: any[] = [];

    if (typeof window !== "undefined" && window.sessionStorage) {
      // Read previous values
      B4Size = parseInt(sessionStorage.getItem("sizeBeforeClick") ?? "0", 10);
      lastList = JSON.parse(sessionStorage.getItem("lastList") ?? "[]");

      console.log("Previous sizeBeforeClick:", B4Size);
      console.log("Previous lastList:", lastList);

      // Convert keys to array safely
      let entries: any[] = Array.isArray(keys)
        ? keys
        : keys instanceof Set
          ? Array.from(keys)
          : Object.values(keys);

      console.log("Current entries to save:", entries);

      // Write updated values
      sessionStorage.setItem("sizeBeforeClick", curSize.toString());
      sessionStorage.setItem("lastList", JSON.stringify(entries));

      console.log(
        "Updated sizeBeforeClick:",
        sessionStorage.getItem("sizeBeforeClick"),
      );
      console.log("Updated lastList:", sessionStorage.getItem("lastList"));
    }

    if (B4Size - curSize < 0) {
      console.log("ADD "+parseInt(keys.currentKey.substring(1, 3)));

      const currentKey = keys.currentKey;
      // mark this season as loading (used to block removals and show spinner)
      setLoadingSeasonKeys((prev) => {
        const copy = new Set(prev);
        copy.add(currentKey);
        return copy;
      });

      setNavLoading(true);


      for (const season of data.leagues[0].league_seasons_info) {
        console.log("CHECK SEASON ",season.season_number);
        console.log("CURRENT KEY SEASON ",parseInt(keys.currentKey.substring(1, 3)));
        if (parseInt(season.season_number) === parseInt(keys.currentKey.substring(1, 3))) {
          let GotAllMyShit = [];
            
            for (const standing of season.season_standings) {
            console.log("JON HAS A FUNNY PENIS !!! ",standing);
            for(const eachDivision of standing){
              console.log("something ",eachDivision.division_name);
              console.log("something clicked",keys.currentKey.substring(4))
              if(eachDivision.division_name == keys.currentKey.substring(4)){
                const GotMyShit = await ObtainVetoInfo(
                  eachDivision.championship_id,
                  data.teamdata?.team_id,
                  parseInt(keys.currentKey.substring(1)),
                  eachDivision.division_name,
                );
                eachDivision.SeasonNumber = season.season_number;
                console.log("Cogt my shit? ",GotMyShit)
                for (const eachmatch of GotMyShit) {
                  GotAllMyShit.push(eachmatch);
                }
                
              }
                  

                
                
                
              
            }
              
            

            

            }
          
          
            console.log("GOT ALL MY FUCING SHIT??? ",GotAllMyShit);
            console.log("UMMMM??? ",season);
          GotAllMyShit.sort(
            (a: any, b: any) =>
              b.teamMatchData.finished_at - a.teamMatchData.finished_at,
          );
          if(B4Size == 0){
            console.log("WHAT IS IN HERE ??? ",season);
            setUiNode((prev) => [
            <div
              key={`S${season.season_number}-${keys.currentKey.substring(4)}`}
              id={`S${season.season_number} ${keys.currentKey.substring(4)}`}
              className=""
            >
              {CreateMatchNavbar(
                GotAllMyShit,
                data.teamdata.team_id,
                season.season_standings,
                season.season_number,
                keys.currentKey.substring(4),
              )}
            </div>,
          ]);
          }
          else{
            setUiNode((prev) => [
            ...prev,
            <div
              key={`S${season.season_number}-${keys.currentKey.substring(4)}`}
              id={`S${season.season_number} ${keys.currentKey.substring(4)}`}
              className=""
            >
              {CreateMatchNavbar(
                GotAllMyShit,
                data.teamdata.team_id,
                season.season_standings,
                season.season_number,
                keys.currentKey.substring(4),
              )}
            </div>,
          ]);
          }
          

          // Accumulate data when adding seasons
          setTeamData((prev: any) =>
            prev ? [...prev, ...GotAllMyShit] : GotAllMyShit,
          );
          
          console.log("GOT ALL MY SHIT? ", GotAllMyShit);

          //Find all of the players of every match, add them to an array that sorts players based of how much games they played
          //if the games played by the user is over half of the most games played by someone, then that means they are an actual player, otherwise they are a sub.
          let PlayedPlayers: PlayerStats[] = [];
          for(const game of GotAllMyShit){
            for(const match of  game.matchData.rounds){
              console.log("LALALALAL ",match);
              for(const team of match.teams){
                
                if(team.team_id === data.teamdata?.team_id){
                  console.log("TEAM = ",team);
                  for (const player of team.players){
                      const plyrObj = PlayedPlayers.find(
                        (obj) => obj.player_id === player.player_id,
                      );

                      if (plyrObj) {
                        plyrObj.count += 1;
                      } else {
                        let avatarsrc;
                        if(game.teamMatchData.teams.faction1.faction_id === data.teamdata?.team_id){
                          for(const eachPlayerinTeam of game.teamMatchData.teams.faction1.roster){
                                if(eachPlayerinTeam.player_id === player.player_id){
                                  avatarsrc = eachPlayerinTeam.avatar;
                                }
                            }
                        }
                        else{
                          for(const eachPlayerinTeam of game.teamMatchData.teams.faction2.roster){
                                if(eachPlayerinTeam.player_id === player.player_id){
                                  avatarsrc = eachPlayerinTeam.avatar;
                                }
                            }
                        }
                        if(avatarsrc == ""){
                          avatarsrc = "/images/DEFAULT.jpg";
                        }
                        const latest = await FetchLatestUsername(player.player_id);
                        PlayedPlayers.push({ player_name:player.nickname, player_id:player.player_id, latest_player_name:latest?.nickname, avatar_img:latest?.avatar, count: 1 });
                      }
                  }
                }
              }
            }
          }

          console.log("GOT ALL PLAYED PLAYERS: ",PlayedPlayers);
          if(season.season_number != thisSeason){
             addRosterForSeason(PlayedPlayers, season.season_number)

          }
          // Remove this season from loading set and update navLoading
          setLoadingSeasonKeys((prev) => {
            const copy = new Set(prev);
            copy.delete(currentKey);
            // update global navLoading based on remaining loading seasons
            setNavLoading(copy.size > 0);
            return copy;
          });

          setneedsPlaceholder(false);

          return;
        }
      }
    } else if (B4Size - curSize > 0) {
      console.log("REMOVE");
      console.log("GET DOWN " + lastList);
      const nowList: any[] = JSON.parse(
        sessionStorage.getItem("lastList") ?? "[]",
      );

      // Find elements in lastList that are missing in nowList
      const removedIds: string[] = [];
      for (const eachthinginlist of lastList) {
        let found = false;

        for (const eachthinginnowList of nowList) {
          if (eachthinginlist === eachthinginnowList) {
            found = true; // element exists in nowList
            break; // no need to check further
          }
        }

        if (!found) {
          console.log("Removed item:" + eachthinginlist + "-");
          removedIds.push(eachthinginlist);
          // Do something with the removed item here
          
          // Extract season number from the removed item and remove its roster only if no other divisions from this season are selected
          const seasonNumber = eachthinginlist.substring(1, 3);

            console.log("Removing roster for season ", seasonNumber);
            removeRosterForSeason(seasonNumber);
          
          
          if (lastList.length == 1) {
            setneedsPlaceholder(true);
          }
          let newData = [];

          for (const eachMatch of TeamData) {
            console.log("WHAT THE BALLSACK ",eachMatch);
            if (
              !(
                eachMatch.matchData.seasonNum == eachthinginlist.substring(1, 3) &&
                eachMatch.matchData.Division == eachthinginlist.substring(4)
              )
            ) {
              newData.push(eachMatch);
            }
          }
          console.log("Every match other than the one that we got ", newData);
          setTeamData(newData);
        }
      }
      // Update uiNode to remove the corresponding elements
      setUiNode(prev => prev.filter(node => !removedIds.includes(node.props.id)));
    } else {
      console.log("NOTHING GOT CLICKED YO");
    }
  };

  return (
    <div key={"TeamProfileCard"}>
      {loading ? (
        <CreateSkeleton />
      ) : (
        <div>
          <div className={`p-4 border rounded-xl shadow bg-cumground flex`}>
            {/* team info */}
            <div className="flex gap-3">
              <div onClick={OpenTeamName}>
              <Avatar
                alt="Team1pfp"
                size={150}
                src={
                  data.teamdata?.avatar
                    ? data.teamdata?.avatar
                    : "/images/DEFAULT.jpg"
                }
              />
              </div>
              <div className="">
                <div className="flex ">
                  <div className="text-5xl mr-2 -mt-1 ">
                    <Flag
                      countryCode={data.leagues[0].league_seasons_info[0].season_standings["0"][0].region_name}
                    />
                  </div>
                  <p
                    className="text-5xl font-bold text-white cursor-pointer
                              transition-[text-shadow] duration-300 hover:duration-150
                              hover:[text-shadow:0_0_8px_white]"
                    onClick={OpenTeamName}
                  >
                    {data.teamdata?.name}
                  </p>

                  <p className="text text-zinc-500 flex items-end px-1">
                    ({data.teamdata?.nickname})
                  </p>
                  {/* leagues summary */}
                  <div className="ml-1">
                    {data.leagues?.length > 0 ? (
                      <div className="flex">
                        <div className="ml-2">
                          <Dropdown
                            classNames={{
                              content:
                                "bg-nothinground backdrop-blur-lg shadow-none border-0 p-0 backdrop-blur-md",
                            }}
                          >
                            <DropdownTrigger>
                              <Button
                                className="capitalize text-white font-play text-lg mr-2 mt-1 bg-black-50"
                                variant="solid"
                              >
                                {selectedKeys.size > 0 ? (
                                  <div className="flex gap-1">
                                      {Array.from(new Set(Array.from(selectedKeys).map(key => key.substring(1, 3))))
                                        .sort((a, b) => parseInt(b, 10) - parseInt(a, 10)) // descending
                                        .map((seasonNum) => {
                                          // Check if any division of this season is loading
                                          const isLoading = Array.from(selectedKeys)
                                            .filter(key => key.startsWith(`S${seasonNum}`))
                                            .some(key => loadingSeasonKeys.has(key));
                                          return (
                                            <div key={seasonNum} className="relative w-8 h-8 flex items-center justify-center">
                                                  <Image
                                                    alt={`Season ${seasonNum} Logo`}
                                                    height={seasonNum === "51" || seasonNum === "50" ? SEASON_LOGO_SMALL : SEASON_LOGO_STANDARD}
                                                    src={`images/S${seasonNum}logo.png`}
                                                    width={seasonNum === "51" || seasonNum === "50" ? SEASON_LOGO_SMALL : SEASON_LOGO_STANDARD}
                                                    // ensure the logo sits in a lower stacking context so the overlayed spinner (z-50) is always visible
                                                    className={isLoading ? "opacity-60 relative z-0" : "relative z-0"}
                                                  />
                                              {isLoading && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                                                  <div className="bg-black/50 rounded-full p-1">
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                    </svg>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                  </div>
                                ) : (
                                  "Choose ESEA Season"
                                )}
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              aria-label="Multiple selection"
                              className="text-white font-play"
                              closeOnSelect={false}
                              selectedKeys={selectedKeys}
                              selectionMode="multiple"
                              variant="shadow"
                              onSelectionChange={handleSelectionChange}
                              hideSelectedIcon={true}
                            >
                              {data.leagues[0].league_seasons_info.map(
                                (league: any) => {
                                  const standing = [];

                                  for (const poopfart of league.season_standings) {
                                    standing.push(poopfart);
                                  }
                                  console.log("WHAT IS THIS STANDING HERE!! ",standing);

                                  // compute the common key used by dropdown
                                  const baseKey = `S${league.season_number}`;

                                  if (standing.length >= 1) {
  console.log("JON HAS A MILENKI PENIS ", standing);
  const items = [];
  for (const eachDivision of standing) {
    console.log(`EACH FRIGGEN DIVISION SEASON ${league.season_number}`, eachDivision);

    if (eachDivision["1"] && eachDivision["0"].division_name === eachDivision["1"].division_name) {
      const itemKey = `${baseKey} ${eachDivision["0"].division_name}`;
      const isLoading = loadingSeasonKeys.has(itemKey);
      items.push(
        <DropdownItem
          key={itemKey}
          className={isLoading ? "opacity-60" : undefined}
          startContent={
            <div className={"min-w-[30px] flex items-center justify-center relative"}>
              <Image
                className={
                  !(
                    league.season_number === "51" ||
                    league.season_number === "50"
                  )
                    ? ""
                    : ""
                }
                height={league.season_number === "51" || league.season_number === "50" ? 40 : SEASON_LOGO_STANDARD}
                width={league.season_number === "51" || league.season_number === "50" ? 35 : SEASON_LOGO_STANDARD}
                src={`images/S${league.season_number}logo.png`}
              />
            </div>
          }
          endContent={
            isLoading ? (
              <div className="mr-2 flex items-center">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              </div>
            ) : selectedKeys.has(itemKey) ? (
              <div className="mr-2 flex items-center">
                <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.14 7.14a1 1 0 01-1.415 0l-3.06-3.06a1 1 0 111.415-1.415l2.353 2.353 6.433-6.433a1 1 0 011.415 0z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="mr-2 w-4" />
            )
          }
          description={
            <span>
              (
              <span className="text-green-400">{eachDivision["1"].wins}</span>
              <span className="text-zinc-400"> / </span>
              <span className="text-red-400">{eachDivision["1"].losses}</span>
              ) PO: (
              <span className="text-green-400">{eachDivision["0"].wins}</span>
              <span className="text-zinc-400"> / </span>
              <span className="text-red-400">{eachDivision["0"].losses}</span>
              )
            </span>
          }
        >
          {`S${league.season_number} ${eachDivision["0"].division_name}`}
        </DropdownItem>
      );
    } else {
      // This means the team is in Elite and some other division (Main, Adv)
      console.log("POOOOOOP", league);
      const divisionItems = eachDivision.map((eachdivisions:any) => {
        console.log("WHAT? ", eachdivisions);
        const itemKey = `${baseKey} ${eachdivisions.division_name}`;
        const isLoading = loadingSeasonKeys.has(itemKey);
        return (
          <DropdownItem
            key={itemKey}
            className={isLoading ? "opacity-60" : undefined}
            startContent={
              <div className={"min-w-[30px] flex items-center justify-center relative"}>
                <Image
                  className={
                    !(
                      league.season_number === "51" ||
                      league.season_number === "50"
                    )
                      ? ""
                      : ""
                  }
                  height={league.season_number === "51" || league.season_number === "50" ? 40 : SEASON_LOGO_STANDARD}
                  width={league.season_number === "51" || league.season_number === "50" ? 35 : SEASON_LOGO_STANDARD}
                  src={`images/S${league.season_number}logo.png`}
                />
              </div>
            }
            endContent={
              isLoading ? (
                <div className="mr-2 flex items-center">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </div>
              ) : selectedKeys.has(itemKey) ? (
                <div className="mr-2 flex items-center">
                  <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.14 7.14a1 1 0 01-1.415 0l-3.06-3.06a1 1 0 111.415-1.415l2.353 2.353 6.433-6.433a1 1 0 011.415 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="mr-2 w-4" />
              )
            }
            description={
              <span>
                (
                <span className="text-green-400">{eachdivisions.wins}</span>
                <span className="text-zinc-400"> / </span>
                <span className="text-red-400">{eachdivisions.losses}</span>
                )
              </span>
            }
          >
            {`S${league.season_number} ${eachdivisions.division_name}`}
          </DropdownItem>
        );
      });
      items.push(...divisionItems);
    }
  }
  return items;
}
                                },
                              )}
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div id="PoopEater" className="flex flex-row overflow-x-auto w-full max-w-[98rem]">
                <Card className="flex-row gap-3 items-center border rounded-lg bg-cumground mt-1 mr-2 flex-shrink-0 min-w-max">
                    <Image
                                          key={`Season ${thisSeason}Logo`}
                                          alt={`Season 55Logo`}
                                          height={40}
                                          src={`images/S${thisSeason}logo.png`}
                                          width={40}
                                          className="ml-2 mb-11"
                                        />
                    
                                       
                  
                  <p className="text-white text-xl mb-11">:</p>
                  {data.leagues[0].active_members.map((member: any) => {
                    if (member.game_role.includes("player")) {
                      return (
                        <div
                          key={member.user_id}
                          className="flex flex-col items-center mr-4 mb-3"
                        >
                          <p className="text text-zinc-200 z-50 text-white [text-shadow:-1px_1px_1px_black] ">
                                  {member?.user_name}
                                </p>
                          {member.team_role === "leader" ? (
                            <div className="">
                              <div className="-my-4">
                                
                                <Image
                                  className="cursor-pointer rounded-none z-40"
                                  height={40}
                                  radius="none"
                                  src={`/images/CAPTAIN.png`}
                                  width={40}
                                />
                              </div>
                            </div>
                          ) : (
                            null
                          )}
                          <div
                            className="w-12 h-12 rounded-full cursor-pointer 
                          hover:shadow-[0_0_10px_1px_white] transition duration-200"
                          onClick={OpenPlayerName(member?.user_name)}
                          >
                            <Image
                              alt={`${member?.user_name} logo`}
                              className="w-12 h-12 rounded-full hover:shadow-[0_0_8px_white]"
                              radius="full"
                              
                              src={
                                member?.avatar_img !== ""
                                  ? member?.avatar_img
                                  : "/images/DEFAULT.jpg"
                              }
                            />
                          </div>
                        </div>
                      );
                    }
                  })}
                </Card>
                </div>
              </div>
            </div>
          </div>
          <div className="flex">
            {navLoading ? (
              <>
                <MatchNavbarSkeleton />
              </>
            ) : (
              <>
                <div>
                  {needsPlaceholder ? (
                    <Card
                      className="border rounded-lg bg-cumground flex h-154 w-70 justify-center mt-1"
                      id="placeholder"
                    >
                      <p className="text-center text-lg text-white ">
                        Choose an ESEA season above in order to obtain matches!
                      </p>
                    </Card>
                  ) : (
                    <div className="mt-1 w-70 overflow-x-hidden flex-shrink-0">
                      {uiNode.slice().sort((a: any, b: any) => {
                        if (
                          !React.isValidElement(a) ||
                          !React.isValidElement(b)
                        )
                          return 0;
                        const aNum = parseInt(
                          ((a as any).props.id as string)
                            .split(" ")[0]
                            .slice(1),
                          10,
                        );
                        const bNum = parseInt(
                          ((b as any).props.id as string)
                            .split(" ")[0]
                            .slice(1),
                          10,
                        );

                        return bNum - aNum;
                      })}
                    </div>
                  )}
                   
                  
                </div>
              </>
            )}
            <div id="FartSniffer" className="ml-1 flex-1">
              <CreateStatsPage
                SelectedTeam={data.teamdata?.team_id}
                isLoading={navLoading}
                needsPlaceholder={needsPlaceholder}
                stats={TeamData}
              />

            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
