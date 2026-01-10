import { Card } from "@heroui/react";

import AddSeasonToMenu from "@/components/AddSeasonToNavBar";
import GetAndReturnESEALOGO from "@/components/GetAndReturnESEAlogo";

export default function CreateMatchNavbar(
  stats: any,
  SelectedTeam: any,
  leagueInfo: any,
  seasonNumber: number,
  seasonDivision: string,
) {
 // console.log("vagina farts ", stats);
  //console.log("sub " + SelectedTeam);
  //console.log("WHATR THE FUCK ",seasonDivision);
  //console.log("WHJATASDFAS??? ",seasonNumber);
 // console.log("MOTYA FUCK YOU ",leagueInfo);
  const mappedSeasons = Array.isArray(stats)
    ? stats.map((match: any, index: number) => (
        <div key={`${match.matchData.rounds[0].match_id}`}>
          <AddSeasonToMenu key={index} SELECT={SelectedTeam} stats={match} />
        </div>
      ))
    : [];

  // If there are no matches for this season, render a placeholder card
  if (!mappedSeasons.length) {
    return (
      <Card className="p-4 border rounded-lg bg-cumground flex w-70 flex-shrink-0">
        <div className="flex flex-col items-center w-full">
          <GetAndReturnESEALOGO Data={seasonNumber} />
          <div className="mt-4 w-full">
            <div className="border rounded-lg p-3 bg-[#0b0b0b]">
              <p className="text-white text-center text-lg">
                {`No matches found in season S${seasonNumber ?? ""}!`}
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 border rounded-lg bg-cumground flex w-70 flex-shrink-0">
      <div className="flex flex-col">
        <div className="flex items-center">
        <GetAndReturnESEALOGO Data={seasonNumber} />
        <h1
          className="text-md text-white ml-2"
          id="DivName"
          style={{ whiteSpace: "pre-line" }}
        >
          {(() => {
            const allData = Array.isArray(leagueInfo) ? leagueInfo.flat() : (leagueInfo || []);
           // console.log("ALL THE DATA ", allData);

            const playoffData = allData.find((item: any) =>
              item.division_name === seasonDivision && item.stage_name === "Playoffs"
            );

            const regularData = allData.find((item: any) =>
              item.division_name === seasonDivision && (item.stage_name === "Regular Season" || item.stage_name === "Group Stage")
            ) || allData.find((item: any) => item.division_name === seasonDivision);

            const wins = (regularData && regularData.wins) ?? 0;
            const losses = (regularData && regularData.losses) ?? 0;

            if (playoffData) {
              const poWins = playoffData.wins ?? 0;
              const poLosses = playoffData.losses ?? 0;
              return (
                <>
                  {`S${seasonNumber} ${seasonDivision}: (`}
                  <span className="text-green-400">{wins}</span>
                  {` / `}
                  <span className="text-red-400">{losses}</span>
                  {`) \nPO: (`}
                  <span className="text-green-400">{poWins}</span>
                  {` / `}
                  <span className="text-red-400">{poLosses}</span>
                  {`)`}
                </>
              );
            }

            if (regularData) {
              return (
                <>
                  {`S${seasonNumber} ${seasonDivision}: (`}
                  <span className="text-green-400">{wins}</span>
                  {` / `}
                  <span className="text-red-400">{losses}</span>
                  {`)`}
                </>
              );
            }

            return `S${seasonNumber} ${seasonDivision}: No data available!`;
          })()}

        </h1>
      </div>
        {mappedSeasons}
      </div>
    </Card>
  );
}
