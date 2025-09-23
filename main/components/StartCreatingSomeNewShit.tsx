

import {Card, CardHeader, CardBody, Image} from "@heroui/react";
import AddSeasonToMenu from "@/components/AddSeasonToNavBar";

import { useEffect, useState, useMemo  } from "react";
import GetAndReturnESEALOGO from "@/components/GetAndReturnESEAlogo";

export default function CreateMatchNavbar( stats : any, SelectedTeam:any, leagueInfo:any) {

   let div = stats[0].matchData.Division
    console.log("vagina farts ",stats)
    console.log("sub "+SelectedTeam);
    let isBO3 = (stats[0].matchData.rounds.length > 1 ? true: false);

    const mappedSeasons = stats.map((match: any, index: number) => (
      <div key={`${match.matchData.rounds[0].match_id}`}>
        <AddSeasonToMenu 
          key={index} 
          SELECT={SelectedTeam} 
          stats={match} 
          
        />
      </div>
  ));
 


return (

    <Card className="p-4 border rounded-lg bg-cumground flex w-70 ">
      <div className="flex flex-col">
        <GetAndReturnESEALOGO 
          Data={leagueInfo} 
        />
        {mappedSeasons}
      </div>
    </Card>
);


}
