import {Card, CardFooter, CardBody, Image, Button} from "@heroui/react";
import { useState } from "react";

interface CalculateStatsProps {
  stats: any;
  isBo3: boolean;
  SelectedTeam: any;
}

export default function CalculateStats({ stats, isBo3, SelectedTeam }: CalculateStatsProps){
    console.log("IS THIS SHIT BO3? ",isBo3);
    console.log("OUR TEAM ",SelectedTeam);
    console.log("FUCK ME IN THE BOOTYHOLE ",stats);
    stats = stats.stats
    // Avatar wrapper to handle fallback image
    function Avatar({
      src,
      alt,
      size = 50,
      radius = "sm",
      className = "",
    }: {
      src: string;
      alt: string;
      size?: number;
      radius?: "sm" | "md" | "lg" | "full";
      className?: string;
    }) {
      const [imgSrc, setImgSrc] = useState(src);

      return (
        <Image
          src={(imgSrc)?imgSrc:"/images/DEFAULT.jpg"}
          alt={alt}
          radius={radius}
          height={size}
          width={size}
          onError={() => setImgSrc("/images/DEFAULT.jpg")}
        />
      );
    }

    function calculateBO3score(stats:any){
      console.log("IM JUST IMPROVING ",stats)
      let W = 0;
      let L = 0;
      for(const round of stats.matchData.rounds){
        if (round.round_stats.Winner == SelectedTeam){
          W++;
        }
        else{
          L++;
        }
      }
      return (+W+" / "+L)
    }
    return(
        <div className={`absolute z-100 inset-x-0 mx-auto w-fit ${(isBo3?"mt-0":"mt-4")}`}>
                            <div className="flex">
                                <div className="">
                                    {/*team 1*/}
                                    
                                        <div className="mr-2">
                                            <p className="text-xs font-bold h-8 w-10 underline [text-shadow:0px_1px_2px_white]">{stats.teamMatchData.teams.faction1.name}</p>
                                            <Avatar src={(stats.teamMatchData.teams.faction1.faction_id == stats.matchData.rounds[0].teams[0].team_id)? stats.teamMatchData.teams.faction1.avatar: stats.teamMatchData.teams.faction2.avatar} alt="Team1pfp" size={50} />

                                           
                                        </div>
                                    </div>
                                    <h2 id="poopfart" className={` text-2xl [-webkit-text-stroke:1px_black] font-bold text-center translate-y-1/2 ${((stats.teamMatchData.results.winner == SelectedTeam) ? "text-green": "text-red")}`}>{(isBo3)?calculateBO3score(stats):stats.matchData.rounds[0].round_stats.Score}</h2>
                                    
                                    {/*team 2*/}
                                    
                                    <div className="ml-2">
                                      <p className="text-xs font-bold h-8 max-w-[3rem] underline [text-shadow:0px_1px_2px_white] whitespace-normal break-words">
                                        {stats.teamMatchData.teams.faction2.name}
                                      </p>
                                      <Avatar
                                        src={
                                          stats.teamMatchData.teams.faction2.faction_id == stats.matchData.rounds[0].teams[1].team_id
                                            ? stats.teamMatchData.teams.faction2.avatar
                                            : stats.teamMatchData.teams.faction1.avatar
                                        }
                                        alt="Team1pfp"
                                        size={50}
                                      />
                                    </div>

                                </div>
                                <div className="">
                                  {isBo3
                                    ?(<div className="">
                                        <div className="">
                                        {stats.matchData.rounds
                                          .map((map:any) => {return(<div>
                                            <p className="text-xs text-black [text-shadow:0px_1px_2px_white] text-center font-bold underline">{map.round_stats.Score} </p>
                                          </div>)})
                                        }
                                        </div>

                                    </div>)
                                    :/*Picked By*/  
                                    (<div className="flex">
                                        <h2 className="text-lg text-white [text-shadow:0px_1px_2px_black] font-bold underline"> Picked By: </h2>
                                        <div className="ml-2">
                                            <Avatar src={(stats.PicksAndBans["payload"].tickets[2].entities[6].selected_by == stats.teamMatchData.teams.faction1.faction_id)? stats.teamMatchData.teams.faction1.avatar : stats.teamMatchData.teams.faction2.avatar} alt="Team1pfp" size={30} />
                                        </div>
                                         <p className="text-[10px] mt-1.5 text-black absolute ml-32 mt-2 [text-shadow:0px_1px_2px_white] font-bold underline">{(stats.PicksAndBans["payload"].tickets[2].entities[6].selected_by == stats.teamMatchData.teams.faction1.faction_id)? (stats.teamMatchData.teams.faction1.name.length > 11)? `${stats.teamMatchData.teams.faction1.name.substring(0,11)}...`: `${stats.teamMatchData.teams.faction1.name}` : (stats.teamMatchData.teams.faction2.name.length > 11)? `${stats.teamMatchData.teams.faction2.name.substring(0,11)}...`: `${stats.teamMatchData.teams.faction2.name}`} </p>

                                    </div>)}
                                    
                                </div>
        </div>
    );

}