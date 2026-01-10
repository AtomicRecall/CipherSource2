import fetchUpcomingMatches from "@/components/FetchUpcomingMatches.js";
import fetchGameStats from "@/components/FetchGameStats.js";

export default async function ObtainVetoInfo(championshipID, teamID, seasonNum, seasonDiv) {
 // console.log("CHAMP ID: ", championshipID);
  
  const res = await fetchUpcomingMatches(teamID, championshipID);
  const fart = await res.json();
//console.log(fart.payload.items)
  let Stats = [];

  for (const match of fart.payload.items) {
   // console.log("penis 123",match);
    let shouldFinish = false;
    for (const team of match.factions){
      if(team.id == "bye" || match.status == "dummy"){
        shouldFinish = true;

      }
    }

    if(shouldFinish) continue;
    let fac1id;
    let fac2id;

    for(const faction of match.factions){
    //  console.log("FACTION: ",faction);
      switch(faction.number){
        case 1:
          fac1id = faction.id;
          break;
        case 2:
          fac2id = faction.id;
          break;
      }
    }

    if (match.status === "finished") {
        let amtOfPicks = 0;
      const stats = await fetchGameStats(match.origin.id, seasonNum, seasonDiv);
      if(!stats.skipPrinting || shouldFinish){
        for (let d = 0; d < stats.PicksAndBans["payload"].tickets[2].entities.length; d++) {

        if(stats.PicksAndBans["payload"].tickets[2].entities[d].status == "pick"){
            amtOfPicks++;
        }
       // console.log("SELECTED BY??!? ",stats.PicksAndBans["payload"].tickets[2].entities[d].selected_by);
        if (stats.PicksAndBans["payload"].tickets[2].entities[d].selected_by === "faction1") {
          stats.PicksAndBans["payload"].tickets[2].entities[d].selected_by = fac1id;
        } 
        else if (stats.PicksAndBans["payload"].tickets[2].entities[d].selected_by === "faction2"){
          stats.PicksAndBans["payload"].tickets[2].entities[d].selected_by = fac2id;
        }
      }


      if(amtOfPicks == 1){
        stats.PicksAndBans["payload"].tickets[2].entities[stats.PicksAndBans["payload"].tickets[2].entities.length-1].selected_by = stats.PicksAndBans["payload"].tickets[2].entities[stats.PicksAndBans["payload"].tickets[2].entities.length-2].selected_by
      }
      Stats.push(stats);
      }
      
    }
  }


  return Stats;
}
