import { Card } from "@heroui/react";
import { ResponsivePie, PieSvgProps } from "@nivo/pie";
import {ScrollShadow} from "@heroui/react";
import React from "react";
import StatsSkeleton from "./StatsSkeleton";

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

const PieChartWithLegend: React.FC<PieChartWithLegendProps> = ({ title, type, data }) => {
  const itemCount = data?.length ?? 0;
  
  // Ensure data is properly typed
  const pieData: { id: string; label: string; value: string; color: string }[] = data || [];

  // small tweak: shrink a little when > 3 items
  const legendFontSize = itemCount > 5 ? 13 : 20; // px
  const swatchSize = itemCount > 5 ? 12 : 16; // px

  const commonProperties: Partial<PieSvgProps<{ id: string; label: string; value: string; color: string }>> = {
  data: pieData,
  margin: { top: 40, right: 40, bottom: 60, left: 40 },
  innerRadius: 0.6,
  padAngle: 0.5,
  cornerRadius: 5,
  colors: (d:any) => (d.data as any).color as string,
  arcLinkLabelsColor: { from: "color" },
  arcLinkLabelsThickness: 3,
  arcLinkLabelsTextColor: { from: "color", modifiers: [["darker", 1.2]] },

  // 👇 Add theme overrides here
  theme: {
    labels: {
      text: {
        fontSize: 14,
        fontWeight: "bold",  // 🔥 makes arc labels bold
      },
    },
  },
};


  return (
    <div className="flex flex-col items-center" style={{ width: 420, minWidth: 400 }}>
      <h2 className="text-white text-lg font-bold">{title}</h2>
      <div style={{ height: 300, width: "130%" }} className="-mt-6">
        <ResponsivePie {...(commonProperties as any)} />
      </div>
      <div className="flex flex-col gap-2 text-white -mt-9">
  {pieData
    .slice() // create a shallow copy so the original data isn't mutated
    .sort((a:any, b:any) => b.value - a.value) // descending order (largest → smallest)
    .map((slice) => (
      <div key={slice.id} className="flex items-center gap-2">
        <div
          style={{
            width: swatchSize,
            height: swatchSize,
            backgroundColor: slice.color,
            borderRadius: 4,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: `${legendFontSize}px`, lineHeight: 1 }}>
          {slice.label}: {slice.value}
          {(() => {
            switch(title){
              case "Maps Won":
                const playedObj = (type == "all") ?Played.find((obj) => obj.map_name === slice.label) : (type == "bo1") ?bo1Played.find((obj) => obj.map_name === slice.label) :bo3Played.find((obj) => obj.map_name === slice.label);
                  if (!playedObj) return null;

                  const wr = parseInt(slice.value) / playedObj.count;
                  return ` | WR: ${(parseFloat(wr.toFixed(2))*100).toFixed(2)}%`;
              case "Maps Lost":
                const playedObj1 = (type == "all") ?Played.find((obj) => obj.map_name === slice.label) : (type == "bo1") ?bo1Played.find((obj) => obj.map_name === slice.label) :bo3Played.find((obj) => obj.map_name === slice.label);
                  if (!playedObj1) return null;

                  const Lr = parseInt(slice.value) / playedObj1.count;
                  return ` | LR: ${(parseFloat(Lr.toFixed(2))*100).toFixed(2)}%`;
              case "First Ban":
                if(type == "all"){
                  break;
                }
                const BannedObject = (type == "all") ? Banned.find((obj) => obj.map_name === slice.label) : (type == "bo1") ?bo1Banned.find((obj) => obj.map_name === slice.label) :BO3Banned.find((obj) => obj.map_name === slice.label);
                  if (!BannedObject) return null;

                  const FBR = parseInt(slice.value) / BannedObject.count;
                  console.log(`${parseInt(slice.value)} / ${BannedObject.count}`)
                  return ` | ${(parseFloat(FBR.toFixed(2))*100).toFixed(2)}% chance`;  
              case "Second Ban":
                if(type == "all"){
                  break;
                }
                const BannedObject1 = (type == "all") ? Banned.find((obj) => obj.map_name === slice.label) : (type == "bo1") ?bo1Banned.find((obj) => obj.map_name === slice.label) :BO3Banned.find((obj) => obj.map_name === slice.label);
                  if (!BannedObject1) return null;

                  const SBR = parseInt(slice.value) / BannedObject1.count;
                  console.log(`${parseInt(slice.value)} / ${BannedObject1.count}`)
                  return ` | ${(parseFloat(SBR.toFixed(2))*100).toFixed(2)}% chance`;
              case "Third Ban":
                if(type == "all"){
                  break;
                }
                const BannedObject2 = (type == "all") ? Banned.find((obj) => obj.map_name === slice.label) : (type == "bo1") ?bo1Banned.find((obj) => obj.map_name === slice.label) :BO3Banned.find((obj) => obj.map_name === slice.label);

                  if (!BannedObject2) return null;

                  const TBR = parseInt(slice.value) / BannedObject2.count;
                  console.log(`${parseInt(slice.value)} / ${BannedObject2.count}`)
                  return ` | ${(parseFloat(TBR.toFixed(2))*100).toFixed(2)}% chance`;
            }
            return null; // fallback if no condition matched
          })()}
        </span>
      </div>
    ))}
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
  bo1Banned = [];
  BO3Banned = [];
  BO3Picked = [];
  bo1FirstBan = [];
  bo1SecondBan = [];
  bo1ThirdBan = [];
  bo1Played = [];
  bo1Won = [];
  bo1Lost = [];
  bo1Pick = [];
  bo3Played = [];
  bo3FirstPick = [];
  bo3SecondPick = [];
  bo3ThirdPick = [];
  bo3FirstBan = [];
  bo3SecondBan = [];
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
    }

    // Arrays to store stats
    let Played: MapStats[] = [];
    let W: MapStats[] = [];
    let L: MapStats[] = [];
    let Banned: MapStats[] = [];
    let Picks: MapStats[] = [];
    let FirstBan: MapStats[] = [];
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
    let bo1SecondBan: MapStats[] = [];
    let bo1ThirdBan: MapStats[] = [];
    let bo1Pick: MapStats[] = [];
    let bo1Played: MapStats[] = [];
    let bo3Played: MapStats[] = [];
    let bo1Won: MapStats[] = [];
    let bo1Lost: MapStats[] = [];
    let bo3Lost: MapStats[] = [];
    let bo3Won: MapStats[] = [];


    
function CreateStatsPage({ needsPlaceholder, stats, SelectedTeam, isLoading}: CreateStatsPageProps) {
  
  // Reset all global arrays at the start of each render to ensure fresh calculations
  Played = [];
  W = [];
  L = [];
  bo1Banned = [];
  Picks = [];
  FirstBan = [];
  SecondBan = [];
  ThirdBan = [];
  BO3Banned = [];
  BO3Picked = [];
  bo1FirstBan = [];
  bo1SecondBan = [];
  bo1ThirdBan = [];
  bo1Played = [];
  bo1Won = [];
  bo1Lost = [];
  bo1Pick = [];
  bo3FirstPick = [];
  bo3SecondPick = [];
  bo3ThirdPick = [];
  bo3FirstBan = [];
  bo3SecondBan = [];
  bo3Played = [];
  bo3Won = [];
  bo3Lost = [];
    
  console.log("NO FUCKING WAY ",stats);
    
  /* Each of these arrays will have an object like this pushed to them:
      {"map_name" : "number"}
  */
  if(needsPlaceholder){
    return(
      <Card id="placeholder" className="border rounded-lg bg-cumground flex h-154 w-386 justify-center mt-1">
        <p className="text-center text-lg text-white ">Choose an ESEA season above in order to obtain stats!</p>
      </Card>)
  }
  if(stats){
    needsPlaceholder = false;
    let bo1s: any[] = [];
    let bo3s: any[] = [];
    let bo5s: any[] = [];
    let other: any[] = [];
      for (const eachGame of stats){
          for(const eachGameOfGame of eachGame.matchData.rounds){
              console.log("round ",eachGameOfGame);
              const mapObj = Played.find((obj) => obj.map_name === eachGameOfGame.round_stats.Map);
                      if (mapObj) {
                          mapObj.count += 1;
                      } else {
                          Played.push({ map_name: eachGameOfGame.round_stats.Map, count: 1 });
                      }
              if(eachGameOfGame.round_stats.Winner == SelectedTeam){
                   //see if the map is in the W array, if it is not, create one, and if so then add one to
                  const mapObj = W.find((obj) => obj.map_name === eachGameOfGame.round_stats.Map);
                        if (mapObj) {
                            mapObj.count += 1;
                        } else {
                            W.push({ map_name: eachGameOfGame.round_stats.Map, count: 1 });
                        }
                }
                else{
                    const mapObj = L.find((obj) => obj.map_name === eachGameOfGame.round_stats.Map);
                        if (mapObj) {
                            mapObj.count += 1;
                        } else {
                            L.push({ map_name: eachGameOfGame.round_stats.Map, count: 1 });
                        }
                }
            }

            //sort each game by bo1s and bo3s or bo5s.
              switch(eachGame.teamMatchData.best_of){
                case 1:
                  bo1s.push(eachGame);
                  break;
                case 3:
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
        console.log("DUBYA ",W);
        console.log("LOWSE ",L);
        console.log("played ",Played);
        console.log("ALL BO1S? ",bo1s);
        console.log("ALL BO3S? ",bo3s);

        for (const eachBo1 of bo1s){
          let numBan = 0;
          let numPick = 0;
          for (const eachPickOrBan of eachBo1.PicksAndBans.payload.tickets[2].entities){
            if(eachPickOrBan.selected_by == SelectedTeam && eachPickOrBan.status == "drop"){
              numBan++;
              // Always update Banned
              const mapObj1 = Banned.find((obj) => obj.map_name == eachPickOrBan.guid);
                              if (mapObj1) {
                                  mapObj1.count += 1;
                              } else {
                                  Banned.push({ map_name: eachPickOrBan.guid, count: 1 });
                              }
              const mapObj = bo1Banned.find((obj) => obj.map_name == eachPickOrBan.guid);
                              if (mapObj) {
                                  mapObj.count += 1;
                              } else {
                                  bo1Banned.push({ map_name: eachPickOrBan.guid, count: 1 });
                              }
              switch(numBan){
              case 1:
                const mapObj1 = FirstBan.find((obj) => obj.map_name == eachPickOrBan.guid);
                    if (mapObj1) {
                        mapObj1.count += 1;
                    } else {
                        FirstBan.push({ map_name: eachPickOrBan.guid, count: 1 });
                    }
                const mapObj = bo1FirstBan.find((obj) => obj.map_name === eachPickOrBan.guid);
                              if (mapObj) {
                                  mapObj.count += 1;
                              } else {
                                  bo1FirstBan.push({ map_name: eachPickOrBan.guid, count: 1 });
                              }
              
                break;
              case 2:
                const secondObject = bo1SecondBan.find((obj) => obj.map_name === eachPickOrBan.guid);
                              if (secondObject) {
                                  secondObject.count += 1;
                              } else {
                                  bo1SecondBan.push({ map_name: eachPickOrBan.guid, count: 1 });
                              }
                const mapObj2 = SecondBan.find((obj) => obj.map_name == eachPickOrBan.guid);
                    if (mapObj2) {
                        mapObj2.count += 1;
                    } else {
                        SecondBan.push({ map_name: eachPickOrBan.guid, count: 1 });
                    }
                
                break;
              case 3:
                const thirdObject = bo1ThirdBan.find((obj) => obj.map_name === eachPickOrBan.guid);
                              if (thirdObject) {
                                  thirdObject.count += 1;
                              } else {
                                  bo1ThirdBan.push({ map_name: eachPickOrBan.guid, count: 1 });
                              }
                const mapObj3 = ThirdBan.find((obj) => obj.map_name == eachPickOrBan.guid);
                    if (mapObj3) {
                        mapObj3.count += 1;
                    } else {
                        ThirdBan.push({ map_name: eachPickOrBan.guid, count: 1 });
                    }
                break;
              default:
                break;
                
            }
            }
            else{
              if(eachPickOrBan.selected_by == SelectedTeam && eachPickOrBan.status == "pick"){
                numPick++;
                const mapObj = bo1Pick.find((obj) => obj.map_name == eachPickOrBan.guid);
                    if (mapObj) {
                        mapObj.count += 1;
                    } else {
                        bo1Pick.push({ map_name: eachPickOrBan.guid, count: 1 });
                    }
                const mapObj1 = Picks.find((obj) => obj.map_name == eachPickOrBan.guid);
                    if (mapObj1) {
                        mapObj1.count += 1;
                    } else {
                        Picks.push({ map_name: eachPickOrBan.guid, count: 1 });
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
          
          if(round_stats.Winner == SelectedTeam){
            const Object = bo1Won.find((obj) => obj.map_name === round_stats.Map);
                              if (Object) {
                                  Object.count += 1;
                              } else {
                                  bo1Won.push({ map_name: round_stats.Map, count: 1 });
                              }
          }
          else{
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
        const FirstBanData = [];
        const SecondBanData = [];
        const ThirdBanData = [];
        const bo1FirstBanData = [];
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

        if(bo3s.length >1){
          for (const eachBo3 of bo3s){
          let numPick = 0;
          let numBan = 0;
          for (const eachPickOrBan of eachBo3.PicksAndBans.payload.tickets[2].entities){
            if(eachPickOrBan.selected_by == SelectedTeam && eachPickOrBan.status == "pick"){
              numPick++;
              const mapObj1 = Picks.find((obj) => obj.map_name == eachPickOrBan.guid);
              if (mapObj1) {
                  mapObj1.count += 1;
              } else {
                  Picks.push({ map_name: eachPickOrBan.guid, count: 1 });
              }
              const mapObj = BO3Picked.find((obj) => obj.map_name == eachPickOrBan.guid);
              if (mapObj) {
                  mapObj.count += 1;
              } else {
                  BO3Picked.push({ map_name: eachPickOrBan.guid, count: 1 });
              }
              switch(numPick){
              case 1:
                const mapObj = bo3FirstPick.find((obj) => obj.map_name === eachPickOrBan.guid);
                              if (mapObj) {
                                  mapObj.count += 1;
                              } else {
                                  bo3FirstPick.push({ map_name: eachPickOrBan.guid, count: 1 });
                              }
              
                break;
              case 2:
                const secondObject = bo3SecondPick.find((obj) => obj.map_name === eachPickOrBan.guid);
                              if (secondObject) {
                                  secondObject.count += 1;
                              } else {
                                  bo3SecondPick.push({ map_name: eachPickOrBan.guid, count: 1 });
                              }
                
                break;
              case 3:
                const thirdObject = bo3ThirdPick.find((obj) => obj.map_name === eachPickOrBan.guid);
                              if (thirdObject) {
                                  thirdObject.count += 1;
                              } else {
                                  bo3ThirdPick.push({ map_name: eachPickOrBan.guid, count: 1 });
                              }
                
                break;
              default:
                break;
                
            }
            }
            else if(eachPickOrBan.selected_by == SelectedTeam && eachPickOrBan.status == "drop"){
                  numBan++;
              // Always update Banned
              const mapObj1 = Banned.find((obj) => obj.map_name == eachPickOrBan.guid);
                              if (mapObj1) {
                                  mapObj1.count += 1;
                              } else {
                                  Banned.push({ map_name: eachPickOrBan.guid, count: 1 });
                              }
              const mapObj = BO3Banned.find((obj) => obj.map_name == eachPickOrBan.guid);
              if (mapObj) {
                  mapObj.count += 1;
              } else {
                  BO3Banned.push({ map_name: eachPickOrBan.guid, count: 1 });
              }
              switch(numBan){
              case 1:
                const mapObj = bo3FirstBan.find((obj) => obj.map_name === eachPickOrBan.guid);
                              if (mapObj) {
                                  mapObj.count += 1;
                              } else {
                                  bo3FirstBan.push({ map_name: eachPickOrBan.guid, count: 1 });
                              }
                const mapObj1 = FirstBan.find((obj) => obj.map_name == eachPickOrBan.guid);
                    if (mapObj1) {
                        mapObj1.count += 1;
                    } else {
                        FirstBan.push({ map_name: eachPickOrBan.guid, count: 1 });
                    }
              
                break;
              case 2:
                const secondObject = bo3SecondBan.find((obj) => obj.map_name === eachPickOrBan.guid);
                              if (secondObject) {
                                  secondObject.count += 1;
                              } else {
                                  bo3SecondBan.push({ map_name: eachPickOrBan.guid, count: 1 });
                              }
                const mapObj2 = SecondBan.find((obj) => obj.map_name == eachPickOrBan.guid);
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
          let round_stats = eachBo3.matchData.rounds[0].round_stats;
          const Object = bo3Played.find((obj) => obj.map_name === round_stats.Map);
                              if (Object) {
                                  Object.count += 1;
                              } else {
                                  bo3Played.push({ map_name: round_stats.Map, count: 1 });
                              }
          
          if(round_stats.Winner == SelectedTeam){
            const Object = bo3Won.find((obj) => obj.map_name === round_stats.Map);
                              if (Object) {
                                  Object.count += 1;
                              } else {
                                  bo3Won.push({ map_name: round_stats.Map, count: 1 });
                              }
          }
          else{
            const Object = bo3Lost.find((obj) => obj.map_name === round_stats.Map);
                              if (Object) {
                                  Object.count += 1;
                              } else {
                                  bo3Lost.push({ map_name: round_stats.Map, count: 1 });
                              }
          }
        }
        for(const map of bo3FirstPick){
          bo3FirstPickData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for(const map of bo3SecondPick){
          bo3SecondPickData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for(const map of bo3ThirdPick){
          bo3ThirdPickData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        }
        for(const map of W){
          WinsData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }

        for (const map of L){
          LossData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for (const map of Played){
          PlayedData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for(const map of Picks){
          PickData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for(const map of FirstBan){
          FirstBanData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for(const map of SecondBan){
          SecondBanData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for(const map of ThirdBan){
          ThirdBanData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }

        for(const map of bo1FirstBan){
          bo1FirstBanData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for(const map of bo1SecondBan){
          bo1SecondBanData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for(const map of bo1ThirdBan){
          bo1ThirdBanData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }

        for (const map of bo1Played){
          bo1PlayedData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for (const map of bo1Won){
          bo1WonData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for(const map of bo1Lost){
          bo1LostData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }

        for(const map of bo3FirstBan){
          bo3FirstBanData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for (const map of bo1Pick){
          bo1PickData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for(const map of bo3SecondBan){
          bo3SecondBanData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});
        }
        for (const map of bo3Played){
          bo3PlayedData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});

        }
        for (const map of bo3Won){
          bo3WonData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});

        }
        for (const map of bo3Lost){
          bo3LostData.push({ id: `${map.map_name}`, label: `${map.map_name}`, value: `${map.count}`, color:whatColor(map.map_name)});

        }
        return (
          <Card className="p-4 border rounded-lg bg-cumground flex flex-col w-386 ml-1 mt-1 justify-center">
              <ScrollShadow id="onlyHereToCheckIfStuffHasBeenAppended" className="h-146 overflow-y-scroll overflow-x-hidden">
                <Card className="p-4 border rounded-lg bg-cumground mb-4 h-114">
                  <p className="text-2xl text-white absolute">ALL:</p>
                    <div className="flex gap-4 justify-center">
                      
                      {(bo3s.length < 1) 
                      ? <div className="overflow-x-auto overflow-y-hidden overflow-x-hidden flex" style={{ height: 430 }}>
                              <div className="snap-center">
                                <PieChartWithLegend title="Maps Played" type={"all"} data={PlayedData} />
                              </div>
                              <div className="snap-center">
                                  <PieChartWithLegend title="Maps Won" type={"all"} data={WinsData} />
                              </div>
                              <div className="snap-center">
                                <PieChartWithLegend title="Maps Lost" type={"all"} data={LossData} />
                              </div>
                        </div>
                      : <div id="Original" className="flex gap-4 justify-center">
                          <div className="overflow-x-auto overflow-y-hidden flex snap-x"  style={{ width: 400, height: 430 }}>
                                <div className="snap-center">
                                  <PieChartWithLegend title="Maps Played" type={"all"} data={PlayedData} />
                                </div>
                                <div className="snap-center">
                                    <PieChartWithLegend title="Maps Won" type={"all"} data={WinsData} />
                                </div>
                                <div className="snap-center">
                                  <PieChartWithLegend title="Maps Lost" type={"all"} data={LossData} />
                                </div>
                          </div>
                          <PieChartWithLegend title="Picks" type={"all"} data={PickData} />
                          <div className="overflow-x-auto overflow-y-hidden flex snap-x" style={{ width: 400, height: 430 }}>
                                <div className="snap-center">
                                  <PieChartWithLegend title="First Ban" type={"all"} data={FirstBanData} />
                                </div>
                                <div className="snap-center">
                                    <PieChartWithLegend title="Second Ban" type={"all"} data={SecondBanData} />
                                </div>
                                <div className="snap-center">
                                  <PieChartWithLegend title="Third Ban" type={"all"} data={ThirdBanData} />
                                </div>
                          </div>
                        </div>
                }
                    </div>
                </Card>
                  {/*(bo1s should always be outputted)*/}
                  <Card className="p-4 border rounded-lg bg-cumground h-114 mb-4">
                    <p className="text-2xl text-white absolute">BO1:</p>
                    <div className="flex justify-center">
                      <div className="overflow-x-auto overflow-y-hidden flex snap-x" style={{ width: 400, height: 430 }}>
                              <div className="snap-center">
                                <PieChartWithLegend title="Maps Played" type={"bo1"} data={bo1PlayedData} />
                                
                              </div>
                              <div className="snap-center">
                                  <PieChartWithLegend title="Maps Won" type={"bo1"} data={bo1WonData} />
                              </div>
                              
                              <div className="snap-center">
                                <PieChartWithLegend title="Maps Lost" type={"bo1"} data={bo1LostData} />
                              </div>
                        </div>
                        <PieChartWithLegend title="Picks" type={"bo1"} data={bo1PickData} />
                        <div className="overflow-x-auto overflow-y-hidden flex snap-x" style={{ width: 400, height: 430 }}>
                              <div className="snap-center">
                                <PieChartWithLegend title="First Ban" type={"bo1"} data={bo1FirstBanData} />
                                
                              </div>
                              <div className="snap-center">
                                  <PieChartWithLegend title="Second Ban" type={"bo1"} data={bo1SecondBanData} />
                              </div>
                              
                              <div className="snap-center">
                                <PieChartWithLegend title="Third Ban" type={"bo1"} data={bo1ThirdBanData} />
                              </div>
                        </div>

                        
                        
                        
                        
                    </div>
                  </Card>
                  {(bo3s.length > 1
                    ?<Card className="p-4 border rounded-lg bg-cumground h-114">
                        <p className="text-2xl text-gray-100 absolute">BO3:</p>
                        <div className="flex gap-4 justify-center">
                          <div className="overflow-x-auto overflow-y-hidden flex snap-x" style={{ width: 400, height: 430 }}>
                              <div className="snap-center">
                                <PieChartWithLegend title="Maps Played" type={"bo1"} data={bo3PlayedData} />
                                
                              </div>
                              <div className="snap-center">
                                  <PieChartWithLegend title="Maps Won" type={"bo1"} data={bo3WonData} />
                              </div>
                              
                              <div className="snap-center">
                                <PieChartWithLegend title="Maps Lost" type={"bo1"} data={bo3LostData} />
                              </div>
                        </div>
                          {/* First Pick/Ban Slot */}
                          {(bo3FirstPickData.length > 0) && (
                            <div className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory" style={{ width: 400, height: 430 }}>
                              <div className="flex" style={{ width: 'max-content' }}>
                                <div className="snap-start"><PieChartWithLegend title="First Pick" type={"bo3"} data={bo3FirstPickData} /></div>
                                {(bo3SecondPickData.length > 0) ?<div className="snap-start"><PieChartWithLegend title="Second Pick" type={"bo3"} data={bo3SecondPickData} /></div>:null}
                                {(bo3ThirdPickData.length > 0) ?<div className="snap-start"><PieChartWithLegend title="Third Pick" type={"bo3"} data={bo3ThirdPickData} /></div>:null}
                              </div>
                            </div>
                          )}
                          {/* Second Pick/Ban Slot */}
                          {(bo3FirstBanData.length > 0) && (
                            <div className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory" style={{ width: 400, height: 430 }}>
                              <div className="flex" style={{ width: 'max-content' }}>
                                <div className="snap-start"><PieChartWithLegend title="First Ban" type={"bo3"} data={bo3FirstBanData} /></div>
                                <div className="snap-start"><PieChartWithLegend title="Second Ban" type={"bo3"} data={bo3SecondBanData} /></div>
                                
                                
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    :null
                  )}
              </ScrollShadow>
            
          </Card>
        );
    }
    else{
      if(!isLoading){
        return(
        <Card className="border rounded-lg bg-cumground flex h-154 w-386 justify-center mt-1">
            <p className="text-center text-lg text-gray-600">We found nothing in those matches!</p>
        </Card>)
      }
        
    }
    
  
}
export default React.memo(CreateStatsPage);
