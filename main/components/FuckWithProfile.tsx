"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Image } from "@heroui/react";
import React from "react";
import ReactDOM from 'react-dom';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { Card } from "@heroui/react";

import CreateStatsPage from "./CreateStatsPage";
import StartGettingShit from "./GetAllThatFuckingShit";
import StatsSkeleton from "./StatsSkeleton";

import CreateMatchNavbar from "@/components/StartCreatingSomeNewShit";
import MatchNavbarSkeleton from "@/components/matchNavbarSkeleton";
import Flag from "@/components/Flag";
import CreateSkeleton from "@/components/ProfileCard";
import fetchTeamProfile from "@/components/FetchProfile";
interface PlayerStats {
  player_name: string;
  player_id: string;
  avatar_img:string;
  count: number;
}
let thisSeason = 55;


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
    seasonLogo.className = 'ml-2 mb-6';
    
    // Add colon
    const colon = document.createElement('p');
    colon.className = 'text-white text-xl mb-6';
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
      avatarDiv.onclick = () => window.open("https://www.faceit.com/en/players/" + (member1?.user_name || member1?.player_name));

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
export default function FuckWithProfile() {
  const searchParams = useSearchParams();

  if (searchParams.size == 0) {
    window.location.href = "/home";
  }
  const user = searchParams
    .toString()
    .substring(0, searchParams.toString().length - 1);

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
  const [needsPlaceholder, setneedsPlaceholder] = useState(true);

  // ✅ Clear sessionStorage once on page load
  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.removeItem("sizeBeforeClick");
      sessionStorage.removeItem("lastList");
    }
  }, []);

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
    if (!user) return;

    async function loadProfile() {
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
  }, [user]);
  const OpenTeamName = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.preventDefault(); // if needed
    event.stopPropagation(); // if needed
    console.log("Team name clicked!", event);
    window.open("https://www.faceit.com/en/teams/" + data.teamdata?.team_id);
    // Your custom logic here
  };




  const handleSelectionChange = async (keys: any) => {
    setSelectedKeys(keys);
    setneedsPlaceholder(false);
    console.log(keys);

    let B4Size = 0;
    let curSize = keys.size;
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
      setNavLoading(true);
      for (const season of data.leagues[0].league_seasons_info) {
        if (season.season_number == parseInt(keys.currentKey.substring(1, 3))) {
          let GotAllMyShit = [];

          for (const standing of season.season_standings) {
            const GotMyShit = await StartGettingShit(
              standing.championship_id,
              data.teamdata?.team_id,
              parseInt(keys.currentKey.substring(1)),
              keys.currentKey.substring(4),
            );

            standing.SeasonNumber = season.season_number;

            for (const eachmatch of GotMyShit) {
              GotAllMyShit.push(eachmatch);
            }
          }

          console.log("cum ", season);
          GotAllMyShit.sort(
            (a: any, b: any) =>
              b.teamMatchData.finished_at - a.teamMatchData.finished_at,
          );
          if(B4Size == 0){
            setUiNode((prev) => [
            <div
              key={`S${season.season_number}-${season.season_standings[0].division_name}`}
              id={`S${season.season_number} ${season.season_standings[0].division_name}`}
              className=""
            >
              {CreateMatchNavbar(
                GotAllMyShit,
                data.teamdata.team_id,
                season.season_standings,
              )}
            </div>,
          ]);
          }
          else{
            setUiNode((prev) => [
            ...prev,
            <div
              key={`S${season.season_number}-${season.season_standings[0].division_name}`}
              id={`S${season.season_number} ${season.season_standings[0].division_name}`}
              className=""
            >
              {CreateMatchNavbar(
                GotAllMyShit,
                data.teamdata.team_id,
                season.season_standings,
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
                        PlayedPlayers.push({ player_name:player.nickname, player_id:player.player_id, avatar_img:avatarsrc, count: 1 });
                      }
                  }
                }
              }
            }
          }

          console.log("GOT ALL PLAYED PLAYERS: ",PlayedPlayers);
          if(season.season_number != thisSeason){
            console.log("FUCK MY BUTTHOLE "+season.season_number)
             addRosterForSeason(PlayedPlayers, season.season_number)

          }
          setNavLoading(false);
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
          // Do something with the removed item here
          document.getElementById(eachthinginlist)?.remove();
          
          // Extract season number from the removed item and remove its roster
          const seasonNumber = eachthinginlist.substring(1, 3);
          removeRosterForSeason(seasonNumber);
          
          if (lastList.length == 1) {
            setneedsPlaceholder(true);
          }
          let newData = [];

          for (const eachMatch of TeamData) {
            if (
              !(
                eachMatch.matchData.seasonNum == eachthinginlist.substring(1, 3)
              )
            ) {
              newData.push(eachMatch);
            }
          }
          console.log("Every match other than the one that we got ", newData);
          setTeamData(newData);
        }
      }
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
                      countryCode={
                        data.leagues[0].league_seasons_info[0]
                          .season_standings[0].region_name
                      }
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
                                    {Array.from(selectedKeys)
                                      .sort((a, b) => {
                                        const aNum = parseInt(
                                          a.substring(1, 3),
                                          10,
                                        );
                                        const bNum = parseInt(
                                          b.substring(1, 3),
                                          10,
                                        );

                                        return bNum - aNum; // descending
                                      })
                                      .map((key) => (
                                        <Image
                                          key={key}
                                          alt={`Season ${key} Logo`}
                                          height={30}
                                          src={`images/S${key.substring(1, 3)}logo.png`}
                                          width={
                                            !(
                                              key.substring(1, 3) === "51" ||
                                              key.substring(1, 3) === "50"
                                            )
                                              ? 30
                                              : 23
                                          }
                                        />
                                      ))}
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
                            >
                              {data.leagues[0].league_seasons_info.map(
                                (league: any) => {
                                  const standing = [];

                                  for (const poopfart of league.season_standings) {
                                    standing.push(poopfart);
                                  }

                                  if (
                                    !standing ||
                                    `${standing[0].placement.left}` == "0"
                                  )
                                    return null;
                                  if (standing.length > 1) {
                                    return (
                                      <DropdownItem
                                        key={`S${league.season_number} ${standing[0].division_name}`}
                                        startContent={
                                          <div className={"w-[30px]"}>
                                            <Image
                                              className={
                                                !(
                                                  league.season_number ==
                                                    "51" ||
                                                  league.season_number == "50"
                                                )
                                                  ? ""
                                                  : "ml-1"
                                              }
                                              height={30}
                                              src={`images/S${league.season_number}logo.png`}
                                              width={
                                                !(
                                                  league.season_number ==
                                                    "51" ||
                                                  league.season_number == "50"
                                                )
                                                  ? 30
                                                  : 23
                                              }
                                            />
                                          </div>
                                        }
                                      >
                                        {`S${league.season_number} ${standing[0].division_name} `}
                                        : ({standing[1].wins} /{" "}
                                        {standing[1].losses}) PO: (
                                        {standing[0].wins} /{" "}
                                        {standing[0].losses})
                                      </DropdownItem>
                                    );
                                  } else {
                                    return standing.map((type: any) => (
                                      <DropdownItem
                                        key={`S${league.season_number} ${type.division_name}`}
                                        startContent={
                                          <div className={"w-[30px]"}>
                                            <Image
                                              className={
                                                !(
                                                  league.season_number ==
                                                    "51" ||
                                                  league.season_number == "50"
                                                )
                                                  ? ""
                                                  : "ml-1"
                                              }
                                              height={30}
                                              src={`images/S${league.season_number}logo.png`}
                                              width={
                                                !(
                                                  league.season_number ==
                                                    "51" ||
                                                  league.season_number == "50"
                                                )
                                                  ? 30
                                                  : 23
                                              }
                                            />
                                          </div>
                                        }
                                      >
                                        {`S${league.season_number} ${type.division_name} `}
                                        : ({type.wins} / {type.losses})
                                      </DropdownItem>
                                    ));
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
                <Card className="flex-row gap-3 items-center border rounded-lg bg-cumground mt-1 -ml-1 mr-2 flex-shrink-0 min-w-max">
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
                          className="flex flex-col items-center mt-2 mr-4 mb-3"
                        >
                          {member.team_role === "leader" ? (
                            <div className="mt-4">
                              <div className="-my-4">
                                <p className="text text-zinc-200 z-50 text-white [text-shadow:-1px_1px_1px_black] absolute">
                                  {member?.user_name}
                                </p>
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
                            <p className="text text-zinc-200 text-white [text-shadow:0px_1px_2px_black]">
                              {member?.user_name}
                            </p>
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
                {document.getElementById(
                  "onlyHereToCheckIfStuffHasBeenAppended",
                ) ? null : (
                  <StatsSkeleton />
                )}
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
