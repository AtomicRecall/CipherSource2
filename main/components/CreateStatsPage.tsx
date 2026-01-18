import { Card } from "@heroui/react";
import { ResponsivePie, PieSvgProps } from "@nivo/pie";
import React from "react";

import { siteConfig } from "../config/site";

import { MyBarCanvas } from "./CreateBarGraph";
import CreateIcicleGraph from "./CreateIcicleGraph";

import StatsSkeleton from "@/components/StatsSkeleton";

interface CreateStatsPageProps {
  needsPlaceholder: boolean;
  stats: any;
  SelectedTeam: any;
  isLoading: boolean;
}

// Add a prop for title
interface PieChartWithLegendProps {
  title: string;
  type: string;
  data: { id: string; label: string; value: string; color: string }[];
}

// Transform maps data for bar chart
const transformMapsDataForBarChart = (
  mapsData: any,
  winsData: any = [],
  lossesData: any = [],
) => {
  // Assuming mapsData is an array of objects with map names and play counts
  // Example: [{ map_name: "de_dust2", count: 15 }, { map_name: "de_mirage", count: 12 }]

  return mapsData.map((mapData: any, index: number) => {
    const mapName = mapData.map_name || `Map ${index + 1}`;
    const totalPlayed = mapData.count || 0;

    // Find corresponding wins and losses for this map
    const winEntry = winsData.find((w: any) => w.map_name === mapName);
    const lossEntry = lossesData.find((l: any) => l.map_name === mapName);

    const wins = winEntry?.count || 0;
    const losses = lossEntry?.count || 0;

    return {
      country: mapName,
      wins: wins,
      losses: losses,
      totalPlayed: totalPlayed, // Add total played for win rate calculation
    };
  });
};

const PieChartWithLegend: React.FC<PieChartWithLegendProps> = ({
  title,
  type,
  data,
}) => {
  const itemCount = data?.length ?? 0;

  // Ensure data is properly typed
  const pieData: { id: string; label: string; value: string; color: string }[] =
    data || [];

  // small tweak: shrink a little when > 3 items
  const legendFontSize = itemCount > 5 ? 13 : 20; // px
  const swatchSize = itemCount > 5 ? 12 : 16; // px

  const commonProperties: Partial<
    PieSvgProps<{ id: string; label: string; value: string; color: string }>
  > = {
    enableArcLinkLabels: false,
    data: pieData,
    animate: true,
    margin: { top: 40, right: 0, bottom: 20, left: 0 },
    arcLabel: (e: any) => {
      return ` (${e.value})`;
    },
    arcLabelsTextColor: { from: "color" },
    innerRadius: 0.3,
    padAngle: 3,
    cornerRadius: 15,

    colors: (d: any) => (d.data as any).color as string,
    arcLinkLabelsColor: { from: "color" },
    arcLinkLabelsThickness: 0,
    arcLinkLabelsTextColor: { from: "color", modifiers: [["darker", 1.2]] },

    theme: {
      legends: {},
      labels: {
        text: {
          fontSize: 28,
          fontWeight: "bold",
          textShadow: "1px 1px 1px rgba(0, 0, 0, 1)",
        },
      },
    },
  };
  const normalizeKey = (raw: string) => {
    if (!raw) return "";
    const m = raw.match(/de_([a-z0-9_]+)/i);

    if (m && m[1]) return m[1].toLowerCase();

    return raw
      .replace(/^de_/, "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)[0];
  };

  return (
    <div className="flex flex-col items-center" style={{ width: "550px" }}>
      <h2 className="text-white text-lg font-bold">{title}</h2>
      <div className="-mt-6" style={{ height: 300, width: "100%" }}>
        <ResponsivePie {...(commonProperties as any)} />
      </div>
    </div>
  );
};

// Function to reset all global arrays
export function resetGlobalArrays() {
  Played = [];
  W = [];
  L = [];
  Banned = [];
  Picks = [];
  FirstBan = [];

  SecondBan = [];
  ThirdBan = [];
  BO3Picked = [];
  bo3FirstPick = [];
  bo3SecondPick = [];
  bo3ThirdPick = [];
  bo3FirstBan = [];
  bo3SecondBan = [];
  bo1Banned = [];
  bo1FirstBan = [];
  bo1FirstBanTeamA = [];
  bo1FirstBanTeamB = [];
  bo3FirstBanTeamA = [];
  bo3FirstBanTeamB = [];
  bo1SecondBan = [];
  bo1ThirdBan = [];
  bo1Pick = [];
  bo1Played = [];
  bo3Played = [];
  bo1Won = [];
  bo1Lost = [];
  bo3Won = [];
  bo3Lost = [];
}
// Returns a color based on the map name
function whatColor(mapname: string): string {
  switch (mapname) {
    case "de_dust2":
      return "#FFF2BA";
    case "de_ancient":
      return "#00FF00";
    case "de_nuke":
      return "#00C8FF";
    case "de_anubis":
      return "#FF6666";
    case "de_inferno":
      return "#FFCD00";
    case "de_vertigo":
      return "#0000FF";
    case "de_mirage":
      return "#994C00";
    case "de_train":
      return "#331900";
    case "de_overpass":
      return "#660066";
    default:
      return "#AAAAAA"; // fallback
  }
}
interface MapStats {
  map_name: string;
  count: number;
  wholePickBanData?: any;
}

// Arrays to store stats
let Played: MapStats[] = [];
let W: MapStats[] = [];
let L: MapStats[] = [];
let Banned: MapStats[] = [];
let Picks: MapStats[] = [];
let LeftOverPick: MapStats[] = [];
let FirstBan: MapStats[] = [];
let FirstBanTeamA: MapStats[] = [];
let FirstBanTeamB: MapStats[] = [];
let SecondBan: MapStats[] = [];
let ThirdBan: MapStats[] = [];
let BO3Picked: MapStats[] = [];
let bo3FirstPick: MapStats[] = [];
let bo3SecondPick: MapStats[] = [];
let bo3ThirdPick: MapStats[] = [];
let bo3FirstBan: MapStats[] = [];
let bo3SecondBan: MapStats[] = [];
let BO3Banned: MapStats[] = [];
let bo1Banned: MapStats[] = [];
let bo1FirstBan: MapStats[] = [];
let bo1FirstBanTeamA: MapStats[] = [];
let bo1FirstBanTeamB: MapStats[] = [];
let bo3FirstBanTeamA: MapStats[] = [];
let bo3FirstBanTeamB: MapStats[] = [];
let bo1SecondBan: MapStats[] = [];
let bo1ThirdBan: MapStats[] = [];
let bo1Pick: MapStats[] = [];
let bo1Played: MapStats[] = [];
let bo3Played: MapStats[] = [];
let bo1Won: MapStats[] = [];
let bo1Lost: MapStats[] = [];
let bo3Lost: MapStats[] = [];
let bo3Won: MapStats[] = [];

function CreateStatsPage({
  needsPlaceholder,
  stats,
  SelectedTeam,
  isLoading,
}: CreateStatsPageProps) {
  // Reset all global arrays at the start of each render to ensure fresh calculations
  Played = [];
  W = [];
  L = [];
  Banned = [];
  BO3Banned = [];
  Picks = [];
  LeftOverPick = [];
  FirstBan = [];
  FirstBanTeamA = [];
  FirstBanTeamB = [];
  SecondBan = [];
  ThirdBan = [];
  BO3Picked = [];
  bo3FirstPick = [];
  bo3SecondPick = [];
  bo3ThirdPick = [];
  bo3FirstBan = [];
  bo3SecondBan = [];
  bo1Banned = [];
  bo1FirstBan = [];
  bo1FirstBanTeamA = [];
  bo1FirstBanTeamB = [];
  bo3FirstBanTeamA = [];
  bo3FirstBanTeamB = [];
  bo1SecondBan = [];
  bo1ThirdBan = [];
  bo1Pick = [];
  bo1Played = [];
  bo3Played = [];
  bo1Won = [];
  bo1Lost = [];
  bo3Won = [];
  bo3Lost = [];

  //console.log("NO FUCKING WAY ", stats);
  const bo1ResetZoomRef = React.useRef<(() => void) | null>(null);

  /* Each of these arrays will have an object like this pushed to them:
      {"map_name" : "number"}
  */
  if (needsPlaceholder) {
    return (
      <div>
        <Card
          className="border rounded-lg bg-cumground flex h-154 justify-center mt-1 w-full"
          id="placeholder"
        >
          <p className="text-center text-lg text-white ">
            Choose an ESEA season above in order to obtain stats!
          </p>
        </Card>
        <footer className="bottom-0 mt-auto flex flex-col items-center justify-center pointer-events-none h-0">
          <span className="text-white ">&copy; {siteConfig.copyright}</span>
          <p className="text-background font-bold text-shadow-lg">
            {siteConfig.version}
          </p>
        </footer>
      </div>
    );
  }
  if (stats && stats.length > 0) {
    needsPlaceholder = false;
    let bo1s: any[] = [];
    let bo3s: any[] = [];
    let bo5s: any[] = [];
    let other: any[] = [];

    for (const eachGame of stats) {
      for (const eachGameOfGame of eachGame.matchData.rounds) {
        // console.log("round ", eachGameOfGame);
        const mapObj = Played.find(
          (obj) => obj.map_name === eachGameOfGame.round_stats.Map,
        );

        if (mapObj) {
          mapObj.count += 1;
        } else {
          Played.push({ map_name: eachGameOfGame.round_stats.Map, count: 1 });
        }
        if (eachGameOfGame.round_stats.Winner == SelectedTeam) {
          //see if the map is in the W array, if it is not, create one, and if so then add one to
          const mapObj = W.find(
            (obj) => obj.map_name === eachGameOfGame.round_stats.Map,
          );

          if (mapObj) {
            mapObj.count += 1;
          } else {
            W.push({ map_name: eachGameOfGame.round_stats.Map, count: 1 });
          }
        } else {
          const mapObj = L.find(
            (obj) => obj.map_name === eachGameOfGame.round_stats.Map,
          );

          if (mapObj) {
            mapObj.count += 1;
          } else {
            L.push({ map_name: eachGameOfGame.round_stats.Map, count: 1 });
          }
        }
      }

      //sort each game by bo1s and bo3s or bo5s.
      switch (eachGame.teamMatchData.best_of) {
        case 1:
          bo1s.push(eachGame);
          break;
        case 2:
          bo1s.push(eachGame);
          break;
        case 3:
          bo3s.push(eachGame);
          break;
        case 4:
          bo3s.push(eachGame);
          break;
        case 5:
          bo5s.push(eachGame);
          break;
        default:
          other.push(eachGame);
          break;
      }
    }
    //  console.log("DUBYA ", W);
    //// console.log("LOWSE ", L);
    // console.log("played ", Played);
    // console.log("ALL BO1S? ", bo1s);
    //console.log("ALL BO3S? ", bo3s);

    for (const eachBo1 of bo1s) {
      let numBan = 0;
      let numPick = 0;
      let numBanThisGame = 0;

      for (const eachPickOrBan of eachBo1.PicksAndBans.payload.tickets[2]
        .entities) {
        numBanThisGame++;
        if (
          eachPickOrBan.selected_by == SelectedTeam &&
          eachPickOrBan.status == "drop"
        ) {
          numBan++;
          // Always update Banned
          const mapObj1 = Banned.find(
            (obj) => obj.map_name == eachPickOrBan.guid,
          );

          if (mapObj1) {
            mapObj1.count += 1;
          } else {
            Banned.push({ map_name: eachPickOrBan.guid, count: 1 });
          }
          const mapObj = bo1Banned.find(
            (obj) => obj.map_name == eachPickOrBan.guid,
          );

          if (mapObj) {
            mapObj.count += 1;
          } else {
            bo1Banned.push({ map_name: eachPickOrBan.guid, count: 1 });
          }
          switch (numBan) {
            case 1:
              if (numBanThisGame == 1) {
                const mapObj1 = bo1FirstBanTeamA.find(
                  (obj) => obj.map_name == eachPickOrBan.guid,
                );

                if (mapObj1) {
                  mapObj1.count += 1;
                } else {
                  bo1FirstBanTeamA.push({
                    map_name: eachPickOrBan.guid,
                    count: 1,
                  });
                }

                const mapObj2 = FirstBanTeamA.find(
                  (obj) => obj.map_name == eachPickOrBan.guid,
                );

                if (mapObj2) {
                  mapObj2.count += 1;
                } else {
                  FirstBanTeamA.push({
                    map_name: eachPickOrBan.guid,
                    count: 1,
                  });
                }
              } else if (numBanThisGame == 2) {
                const mapObj1 = bo1FirstBanTeamB.find(
                  (obj) => obj.map_name == eachPickOrBan.guid,
                );

                if (mapObj1) {
                  mapObj1.count += 1;
                } else {
                  bo1FirstBanTeamB.push({
                    map_name: eachPickOrBan.guid,
                    count: 1,
                  });
                }

                const mapObj2 = FirstBanTeamB.find(
                  (obj) => obj.map_name == eachPickOrBan.guid,
                );

                if (mapObj2) {
                  mapObj2.count += 1;
                } else {
                  FirstBanTeamB.push({
                    map_name: eachPickOrBan.guid,
                    count: 1,
                  });
                }
              }
              const mapObj1 = FirstBan.find(
                (obj) => obj.map_name == eachPickOrBan.guid,
              );

              if (mapObj1) {
                mapObj1.count += 1;
              } else {
                FirstBan.push({ map_name: eachPickOrBan.guid, count: 1 });
              }
              const mapObj = bo1FirstBan.find(
                (obj) => obj.map_name === eachPickOrBan.guid,
              );

              if (mapObj) {
                mapObj.count += 1;
              } else {
                bo1FirstBan.push({ map_name: eachPickOrBan.guid, count: 1 });
              }

              break;
            case 2:
              const secondObject = bo1SecondBan.find(
                (obj) => obj.map_name === eachPickOrBan.guid,
              );

              if (secondObject) {
                secondObject.count += 1;
                secondObject.wholePickBanData?.push(
                  eachBo1.PicksAndBans.payload.tickets[2].entities,
                );
              } else {
                bo1SecondBan.push({
                  map_name: eachPickOrBan.guid,
                  count: 1,
                  wholePickBanData: [
                    eachBo1.PicksAndBans.payload.tickets[2].entities,
                  ],
                });
              }
              const mapObj2 = SecondBan.find(
                (obj) => obj.map_name == eachPickOrBan.guid,
              );

              if (mapObj2) {
                mapObj2.count += 1;
                mapObj2.wholePickBanData?.push(
                  eachBo1.PicksAndBans.payload.tickets[2].entities,
                );
              } else {
                SecondBan.push({
                  map_name: eachPickOrBan.guid,
                  count: 1,
                  wholePickBanData: [
                    eachBo1.PicksAndBans.payload.tickets[2].entities,
                  ],
                });
              }

              break;
            case 3:
              const thirdObject = bo1ThirdBan.find(
                (obj) => obj.map_name === eachPickOrBan.guid,
              );

              if (thirdObject) {
                thirdObject.count += 1;
                thirdObject.wholePickBanData?.push(
                  eachBo1.PicksAndBans.payload.tickets[2].entities,
                );
              } else {
                bo1ThirdBan.push({
                  map_name: eachPickOrBan.guid,
                  count: 1,
                  wholePickBanData: [
                    eachBo1.PicksAndBans.payload.tickets[2].entities,
                  ],
                });
              }
              const mapObj3 = ThirdBan.find(
                (obj) => obj.map_name == eachPickOrBan.guid,
              );

              if (mapObj3) {
                mapObj3.count += 1;
                mapObj3.wholePickBanData?.push(
                  eachBo1.PicksAndBans.payload.tickets[2].entities,
                );
              } else {
                ThirdBan.push({
                  map_name: eachPickOrBan.guid,
                  count: 1,
                  wholePickBanData: [
                    eachBo1.PicksAndBans.payload.tickets[2].entities,
                  ],
                });
              }
              break;
            default:
              break;
          }
        } else {
          if (
            eachPickOrBan.selected_by == SelectedTeam &&
            eachPickOrBan.status == "pick"
          ) {
            numPick++;
            const mapObj = bo1Pick.find(
              (obj) => obj.map_name == eachPickOrBan.guid,
            );

            if (mapObj) {
              mapObj.count += 1;
            } else {
              bo1Pick.push({ map_name: eachPickOrBan.guid, count: 1 });
            }
            const mapObj1 = Picks.find(
              (obj) => obj.map_name == eachPickOrBan.guid,
            );

            if (mapObj1) {
              mapObj1.count += 1;
            } else {
              Picks.push({ map_name: eachPickOrBan.guid, count: 1 });
            }

            //bo1 picks are always LO (Left-Over) picks, so they will are considered like a third ban in bo3s.
            const leftoverpick = LeftOverPick.find(
              (obj: any) => obj.map_name == eachPickOrBan.guid,
            );

            if (leftoverpick) {
              leftoverpick.count += 1;
            } else {
              LeftOverPick.push({ map_name: eachPickOrBan.guid, count: 1 });
            }
          }
        }
      }

      let round_stats = eachBo1.matchData.rounds[0].round_stats;
      const Object = bo1Played.find((obj) => obj.map_name === round_stats.Map);

      if (Object) {
        Object.count += 1;
      } else {
        bo1Played.push({ map_name: round_stats.Map, count: 1 });
      }

      if (round_stats.Winner == SelectedTeam) {
        const Object = bo1Won.find((obj) => obj.map_name === round_stats.Map);

        if (Object) {
          Object.count += 1;
        } else {
          bo1Won.push({ map_name: round_stats.Map, count: 1 });
        }
      } else {
        const Object = bo1Lost.find((obj) => obj.map_name === round_stats.Map);

        if (Object) {
          Object.count += 1;
        } else {
          bo1Lost.push({ map_name: round_stats.Map, count: 1 });
        }
      }
    }

    const WinsData = [];
    const LossData = [];
    const PlayedData = [];
    const PickData = [];
    const LeftOverPickData = [];
    const FirstBanData = [];
    const FirstBanTeamAData = [];
    const FirstBanTeamBData = [];
    const SecondBanData = [];
    const ThirdBanData = [];
    const bo1FirstBanData = [];
    const bo1FirstBanTeamAData = [];
    const bo1FirstBanTeamBData = [];
    const bo3FirstBanTeamAData = [];
    const bo3FirstBanTeamBData = [];
    const bo1SecondBanData = [];
    const bo1ThirdBanData = [];
    const bo1PickData = [];
    const bo1PlayedData = [];
    const bo1WonData = [];
    const bo1LostData = [];
    const bo3FirstPickData = [];
    const bo3SecondPickData = [];
    const bo3ThirdPickData = [];
    const bo3FirstBanData = [];
    const bo3SecondBanData = [];
    const bo3PlayedData = [];
    const bo3WonData = [];
    const bo3LostData = [];

    if (bo3s.length > 0) {
      for (const eachBo3 of bo3s) {
        let numPick = 0;
        let numBan = 0;

        for (const Round of eachBo3.matchData.rounds) {
          let round_stats = Round.round_stats;
          const Object = bo3Played.find(
            (obj) => obj.map_name === round_stats.Map,
          );

          if (Object) {
            Object.count += 1;
          } else {
            bo3Played.push({ map_name: round_stats.Map, count: 1 });
          }

          if (round_stats.Winner == SelectedTeam) {
            const Object = bo3Won.find(
              (obj) => obj.map_name === round_stats.Map,
            );

            if (Object) {
              Object.count += 1;
            } else {
              bo3Won.push({ map_name: round_stats.Map, count: 1 });
            }
          } else {
            const Object = bo3Lost.find(
              (obj) => obj.map_name === round_stats.Map,
            );

            if (Object) {
              Object.count += 1;
            } else {
              bo3Lost.push({ map_name: round_stats.Map, count: 1 });
            }
          }
        }
        let numPickThisGame = 0;
        let numBanThisGame = 0;

        for (const eachPickOrBan of eachBo3.PicksAndBans.payload.tickets[2]
          .entities) {
          if (eachPickOrBan.status == "pick") {
            numPickThisGame++;
            if (eachPickOrBan.selected_by == SelectedTeam) {
              numPick++;
              const mapObj1 = Picks.find(
                (obj) => obj.map_name == eachPickOrBan.guid,
              );

              if (mapObj1) {
                mapObj1.count += 1;
              } else {
                Picks.push({ map_name: eachPickOrBan.guid, count: 1 });
              }
              const mapObj = BO3Picked.find(
                (obj) => obj.map_name == eachPickOrBan.guid,
              );

              if (mapObj) {
                mapObj.count += 1;
              } else {
                BO3Picked.push({ map_name: eachPickOrBan.guid, count: 1 });
              }
              switch (numPick) {
                case 1:
                  const mapObj = bo3FirstPick.find(
                    (obj) => obj.map_name === eachPickOrBan.guid,
                  );

                  if (mapObj) {
                    mapObj.count += 1;
                  } else {
                    bo3FirstPick.push({
                      map_name: eachPickOrBan.guid,
                      count: 1,
                    });
                  }

                  break;
                case 2:
                  const secondObject = bo3SecondPick.find(
                    (obj) => obj.map_name === eachPickOrBan.guid,
                  );

                  if (secondObject) {
                    secondObject.count += 1;
                  } else {
                    bo3SecondPick.push({
                      map_name: eachPickOrBan.guid,
                      count: 1,
                    });
                  }

                  break;
                case 3:
                  const thirdObject = bo3ThirdPick.find(
                    (obj) => obj.map_name === eachPickOrBan.guid,
                  );

                  if (thirdObject) {
                    thirdObject.count += 1;
                  } else {
                    bo3ThirdPick.push({
                      map_name: eachPickOrBan.guid,
                      count: 1,
                    });
                  }

                  const leftoverpick = LeftOverPick.find(
                    (obj: any) => obj.map_name == eachPickOrBan.guid,
                  );

                  if (leftoverpick) {
                    leftoverpick.count += 1;
                  } else {
                    LeftOverPick.push({
                      map_name: eachPickOrBan.guid,
                      count: 1,
                    });
                  }
                  break;
                default:
                  break;
              }
            }
          } else if (eachPickOrBan.status == "drop") {
            numBanThisGame++;
            if (eachPickOrBan.selected_by == SelectedTeam) {
              numBan++;
              // Always update Banned
              const mapObj1 = Banned.find(
                (obj) => obj.map_name == eachPickOrBan.guid,
              );

              if (mapObj1) {
                mapObj1.count += 1;
              } else {
                Banned.push({ map_name: eachPickOrBan.guid, count: 1 });
              }
              const mapObj = BO3Banned.find(
                (obj) => obj.map_name == eachPickOrBan.guid,
              );

              if (mapObj) {
                mapObj.count += 1;
              } else {
                BO3Banned.push({ map_name: eachPickOrBan.guid, count: 1 });
              }
              switch (numBan) {
                case 1:
                  if (numBanThisGame == 1) {
                    const mapObj1 = bo3FirstBanTeamA.find(
                      (obj) => obj.map_name == eachPickOrBan.guid,
                    );

                    if (mapObj1) {
                      mapObj1.count += 1;
                    } else {
                      bo3FirstBanTeamA.push({
                        map_name: eachPickOrBan.guid,
                        count: 1,
                      });
                    }
                    const mapObj2 = FirstBanTeamA.find(
                      (obj) => obj.map_name == eachPickOrBan.guid,
                    );

                    if (mapObj2) {
                      mapObj2.count += 1;
                    } else {
                      FirstBanTeamA.push({
                        map_name: eachPickOrBan.guid,
                        count: 1,
                      });
                    }
                  } else if (numBanThisGame == 2) {
                    const mapObj1 = bo3FirstBanTeamB.find(
                      (obj) => obj.map_name == eachPickOrBan.guid,
                    );

                    if (mapObj1) {
                      mapObj1.count += 1;
                    } else {
                      bo3FirstBanTeamB.push({
                        map_name: eachPickOrBan.guid,
                        count: 1,
                      });
                    }
                    const mapObj2 = FirstBanTeamB.find(
                      (obj) => obj.map_name == eachPickOrBan.guid,
                    );

                    if (mapObj2) {
                      mapObj2.count += 1;
                    } else {
                      FirstBanTeamB.push({
                        map_name: eachPickOrBan.guid,
                        count: 1,
                      });
                    }
                  }
                  const mapObj1 = FirstBan.find(
                    (obj) => obj.map_name == eachPickOrBan.guid,
                  );

                  if (mapObj1) {
                    mapObj1.count += 1;
                  } else {
                    FirstBan.push({ map_name: eachPickOrBan.guid, count: 1 });
                  }
                  const mapObj = bo3FirstBan.find(
                    (obj) => obj.map_name === eachPickOrBan.guid,
                  );

                  if (mapObj) {
                    mapObj.count += 1;
                  } else {
                    bo3FirstBan.push({
                      map_name: eachPickOrBan.guid,
                      count: 1,
                    });
                  }
                  break;
                case 2:
                  const secondObject = bo3SecondBan.find(
                    (obj) => obj.map_name === eachPickOrBan.guid,
                  );

                  if (secondObject) {
                    secondObject.count += 1;
                  } else {
                    bo3SecondBan.push({
                      map_name: eachPickOrBan.guid,
                      count: 1,
                    });
                  }
                  const mapObj2 = SecondBan.find(
                    (obj) => obj.map_name == eachPickOrBan.guid,
                  );

                  if (mapObj2) {
                    mapObj2.count += 1;
                  } else {
                    SecondBan.push({ map_name: eachPickOrBan.guid, count: 1 });
                  }

                  break;
                default:
                  break;
              }
            }
          }
        }
      }

      for (const map of bo3FirstPick) {
        bo3FirstPickData.push({
          id: `${map.map_name}`,
          label: `${map.map_name}`,
          value: `${map.count}`,
          color: whatColor(map.map_name),
        });
      }
      for (const map of bo3SecondPick) {
        bo3SecondPickData.push({
          id: `${map.map_name}`,
          label: `${map.map_name}`,
          value: `${map.count}`,
          color: whatColor(map.map_name),
        });
      }
      for (const map of bo3ThirdPick) {
        bo3ThirdPickData.push({
          id: `${map.map_name}`,
          label: `${map.map_name}`,
          value: `${map.count}`,
          color: whatColor(map.map_name),
        });
      }
    }
    for (const map of bo1FirstBanTeamA) {
      bo1FirstBanTeamAData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of bo1FirstBanTeamB) {
      bo1FirstBanTeamBData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of FirstBanTeamB) {
      FirstBanTeamBData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of FirstBanTeamA) {
      FirstBanTeamAData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of bo3FirstBanTeamA) {
      bo3FirstBanTeamAData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of bo3FirstBanTeamB) {
      bo3FirstBanTeamBData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    //  console.log("BO1 FIRST BAN TEAM A DATA ", bo1FirstBanTeamAData);
    //  console.log("BO1 FIRST BAN TEAM B DATA ", bo1FirstBanTeamBData);
    for (const map of W) {
      WinsData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }

    for (const map of L) {
      LossData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of Played) {
      PlayedData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of Picks) {
      PickData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of LeftOverPick) {
      LeftOverPickData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of FirstBan) {
      FirstBanData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of SecondBan) {
      SecondBanData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of ThirdBan) {
      ThirdBanData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }

    for (const map of bo1FirstBan) {
      bo1FirstBanData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of bo1SecondBan) {
      bo1SecondBanData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    // console.log("Did it work? ",bo1SecondBan, bo1ThirdBan)
    for (const map of bo1ThirdBan) {
      bo1ThirdBanData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }

    for (const map of bo1Played) {
      bo1PlayedData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of bo1Won) {
      bo1WonData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of bo1Lost) {
      bo1LostData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }

    // console.log("BO3 FIRST BAN ", bo3FirstBan);
    for (const map of bo3FirstBan) {
      bo3FirstBanData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of bo1Pick) {
      bo1PickData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of bo3SecondBan) {
      bo3SecondBanData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of bo3Played) {
      bo3PlayedData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of bo3Won) {
      bo3WonData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }
    for (const map of bo3Lost) {
      bo3LostData.push({
        id: `${map.map_name}`,
        label: `${map.map_name}`,
        value: `${map.count}`,
        color: whatColor(map.map_name),
      });
    }

    return (
      <div>
        <Card className="p-4 border rounded-lg bg-cumground flex flex-col mt-1 justify-center w-full overflow-hidden">
          <div
            className="overflow-hidden w-full"
            id="onlyHereToCheckIfStuffHasBeenAppended"
          >
            {bo3s.length >= 1 && bo1s.length >= 1 ? (
              <Card className="p-4 border rounded-lg bg-cumground mb-4 overflow-hidden">
                <p className="text-[50px] font-bold -mt-5 text-white absolute">
                  BO1+BO3:
                </p>
                {/* BO1 Bar Chart and Picks Section */}
                <div className="flex flex-wrap  mt-8">
                  {/* Bar Chart Section */}
                  <div className="flex-1 overflow-hidden">
                    <div className="p-4 rounded-lg">
                      <div className="bg-cumground rounded-lg -mx-4">
                        <MyBarCanvas
                          data={transformMapsDataForBarChart(Played, W, L)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {PickData.length > 0 && (
                  <div className="w-full mb-4 max-w-10xl mx-auto">
                    <div className="p-4 bg-cumground rounded-lg">
                      <div style={{ position: "relative", marginBottom: 8 }}>
                        <h3
                          className="font-bold text-white text-xl"
                          style={{
                            textAlign: "center",
                            margin: 0,
                            color: "white",
                          }}
                        >
                          BO1+BO3 <span className="text-green">Picks</span>
                        </h3>
                      </div>
                      <div className=" h-full">
                        <CreateIcicleGraph
                          bannedData={Picks}
                          bo1FirstBanTeamAData={[]}
                          bo1FirstBanTeamBData={[]}
                          firstBanData={bo3FirstPick}
                          resetZoomRef={undefined}
                          season={55}
                          secondBanData={bo3SecondPick}
                          thirdBanData={LeftOverPick}
                          type={"picks"}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {Banned.length > 0 && (
                  <div className="w-full mb-4 max-w-10xl mx-auto">
                    <div className="p-4 bg-cumground rounded-lg">
                      <div style={{ position: "relative", marginBottom: 8 }}>
                        <h3
                          className="font-bold text-white text-xl"
                          style={{
                            textAlign: "center",
                            margin: 0,
                            color: "white",
                          }}
                        >
                          BO1+BO3 <span className="text-red">Bans</span>
                        </h3>
                      </div>
                      <div className=" h-full">
                        <CreateIcicleGraph
                          bannedData={Banned}
                          bo1FirstBanTeamAData={FirstBanTeamA}
                          bo1FirstBanTeamBData={FirstBanTeamB}
                          firstBanData={FirstBan}
                          resetZoomRef={undefined}
                          season={55}
                          secondBanData={SecondBan}
                          thirdBanData={ThirdBan}
                          type={"bans"}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ) : null}

            {/*(bo1s should always be outputted)*/}
            {bo1s.length >= 1 ? (
              <Card className="p-4 border rounded-lg bg-cumground mb-4 overflow-hidden">
                <p className="text-[50px] font-bold -mt-5 text-white absolute">
                  BO1:
                </p>
                <div className="flex-row overflow-hidden">
                  {/* BO1 Bar Chart and Picks Section */}
                  <div className="flex flex-wrap  mt-8">
                    {/* Bar Chart Section */}
                    <div className="flex-1 overflow-hidden">
                      <div className="p-4 rounded-lg">
                        <div className="bg-cumground rounded-lg -mx-4">
                          <MyBarCanvas
                            data={transformMapsDataForBarChart(
                              bo1Played,
                              bo1Won,
                              bo1Lost,
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {bo1PickData.length > 0 && (
                    <div className="w-full mb-4 max-w-10xl mx-auto">
                      <div className="p-4 bg-cumground rounded-lg">
                        <div style={{ position: "relative", marginBottom: 8 }}>
                          <h3
                            className="font-bold text-white text-xl"
                            style={{
                              textAlign: "center",
                              margin: 0,
                              color: "white",
                            }}
                          >
                            BO1 <span className="text-green">Picks</span>
                          </h3>
                        </div>
                        <div className=" h-full">
                          <CreateIcicleGraph
                            bannedData={bo1Pick}
                            bo1FirstBanTeamAData={[]}
                            bo1FirstBanTeamBData={[]}
                            firstBanData={[]}
                            resetZoomRef={bo1ResetZoomRef}
                            season={55}
                            secondBanData={[]}
                            thirdBanData={[]}
                            type={"picks"}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Icicle Graph Section for BO1 Bans */}
                  {bo1FirstBanData.length > 0 && (
                    <div className="w-full mb-4 max-w-10xl mx-auto">
                      <div className="p-4 bg-cumground rounded-lg">
                        <div style={{ position: "relative", marginBottom: 8 }}>
                          <h3
                            className="font-bold text-white text-xl"
                            style={{
                              textAlign: "center",
                              margin: 0,
                              color: "white",
                            }}
                          >
                            BO1 <span className="text-red">Bans</span>
                          </h3>
                        </div>
                        <div className=" h-full">
                          <CreateIcicleGraph
                            bannedData={bo1Banned}
                            bo1FirstBanTeamAData={bo1FirstBanTeamA}
                            bo1FirstBanTeamBData={bo1FirstBanTeamB}
                            firstBanData={bo1FirstBan}
                            resetZoomRef={bo1ResetZoomRef}
                            season={55}
                            secondBanData={bo1SecondBan}
                            thirdBanData={bo1ThirdBan}
                            type={"bans"}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : null}
            {bo3s.length >= 1 ? (
              <Card className="p-4 border rounded-lg bg-cumground overflow-hidden">
                <p className="text-[50px] -mt-5 font-bold text-gray-100 absolute">
                  BO3:
                </p>
                <div className="flex-row gap-4 overflow-hidden">
                  {/* BO1 Bar Chart and Picks Section */}
                  <div className="flex flex-wrap  mt-8">
                    {/* Bar Chart Section */}
                    <div className="flex-1 overflow-hidden">
                      <div className="p-4 rounded-lg">
                        <div className="bg-cumground rounded-lg -mx-4">
                          <MyBarCanvas
                            data={transformMapsDataForBarChart(
                              bo3Played,
                              bo3Won,
                              bo3Lost,
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Icicle Graph Section for BO3 Bans */}
                  {bo3FirstPickData.length > 0 && (
                    // console.log("BO3 FIRST BAN DATA ", bo3FirstBanData),
                    <div className="w-full mb-4 max-w-10xl mx-auto">
                      <div className="p-4 bg-cumground rounded-lg">
                        <h3 className="text-center mb-4 font-bold text-white text-xl">
                          BO3 <span className="text-green">Picks</span>
                        </h3>
                        <div className="w-full h-full">
                          <CreateIcicleGraph
                            bannedData={BO3Picked}
                            firstBanData={bo3FirstPick}
                            season={55}
                            secondBanData={bo3SecondPick}
                            thirdBanData={bo3ThirdPick}
                            type={"picks"}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Icicle Graph Section for BO3 Bans */}
                  {bo3FirstBanData.length > 0 && (
                    <div className="w-full mb-4 max-w-10xl mx-auto">
                      <div className="p-4 bg-cumground rounded-lg overflow-hidden">
                        <h3 className="text-center mb-4 font-bold text-white text-xl">
                          BO3 <span className="text-red">Bans</span>
                        </h3>
                        <div className="w-full h-full">
                          <CreateIcicleGraph
                            bannedData={BO3Banned}
                            bo1FirstBanTeamAData={bo3FirstBanTeamA}
                            bo1FirstBanTeamBData={bo3FirstBanTeamB}
                            firstBanData={bo3FirstBan}
                            season={55}
                            secondBanData={bo3SecondBan}
                            thirdBanData={[]} // BO3 typically only has first and second bans
                            type={"bans"}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : null}
          </div>
        </Card>
        <footer className="bottom-0 mt-auto flex flex-col items-center justify-center pointer-events-none h-0">
          <span className="text-white ">&copy; {siteConfig.copyright}</span>
          <p className="text-background font-bold text-shadow-lg">
            {siteConfig.version}
          </p>
        </footer>
      </div>
    );
  } else {
    if (isLoading) {
      return (
        <div>
          <StatsSkeleton />

          <footer className="bottom-0 mt-auto flex flex-col items-center justify-center pointer-events-none h-0">
            <span className="text-white ">&copy; {siteConfig.copyright}</span>
            <p className="text-background font-bold text-shadow-lg">
              {siteConfig.version}
            </p>
          </footer>
        </div>
      );
    } else {
      return (
        <Card className="border rounded-lg bg-cumground flex h-154 justify-center mt-1">
          <p className="text-center text-lg text-gray-600">
            We found nothing in season !
          </p>
        </Card>
      );
    }
  }
}
export default React.memo(CreateStatsPage);
