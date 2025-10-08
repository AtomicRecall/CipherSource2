import { Card } from "@heroui/react";

import AddSeasonToMenu from "@/components/AddSeasonToNavBar";
import GetAndReturnESEALOGO from "@/components/GetAndReturnESEAlogo";

export default function CreateMatchNavbar(
  stats: any,
  SelectedTeam: any,
  leagueInfo: any,
) {
  console.log("vagina farts ", stats);
  console.log("sub " + SelectedTeam);

  const mappedSeasons = stats.map((match: any, index: number) => (
    <div key={`${match.matchData.rounds[0].match_id}`}>
      <AddSeasonToMenu key={index} SELECT={SelectedTeam} stats={match} />
    </div>
  ));

  return (
    <Card className="p-4 border rounded-lg bg-cumground flex w-70 flex-shrink-0">
      <div className="flex flex-col">
        <GetAndReturnESEALOGO Data={leagueInfo} />
        {mappedSeasons}
      </div>
    </Card>
  );
}
