import { getFaceitHeaders } from "../config/api-keys";

export default async function fetchGameStats(matchid, seasonNum, seasonDiv) {
  try {
    let skipPrinting = false;
    // 1️⃣ Fetch basic team info
    let Stats = await fetch(`https://cipher-virid.vercel.app/api/proxy2?endpoint=${matchid}/history`);
    if (!Stats.ok) {
      if (Stats.status === 404) {
        console.warn(`Stats not found for match ${matchid} (404). Continuing with empty stats.`);
        skipPrinting = true;
        Stats = {}; // fallback empty object
      } else {
        throw new Error(`Failed to fetch stats: ${Stats.status}`);
      }
    } else {
      Stats = await Stats.json();
    }

    // 2️⃣ Fetch team match data
    const headers = getFaceitHeaders();
    let teamMatchData = await fetch(`https://open.faceit.com/data/v4/matches/${matchid}`, {
      headers
    });
    if (!teamMatchData.ok) {
      if (teamMatchData.status === 404) {
        console.warn(`Team match data not found for match ${matchid} (404). Using empty object.`);
        teamMatchData = {}; // fallback empty object
        skipPrinting = true;
      } else {
        throw new Error(`Failed to fetch team match data: ${teamMatchData.status}`);
      }
    } else {
      teamMatchData = await teamMatchData.json();
     // console.log("winner? "+teamMatchData.results?.winner)
      if (teamMatchData.results?.winner) {
        
        if(teamMatchData.results.winner == "faction1"){
          teamMatchData.results.winner = teamMatchData.teams.faction1.faction_id
        } 
        else{
          teamMatchData.results.winner = teamMatchData.teams.faction2.faction_id
        }
  
      }
      //console.log("winner!"+teamMatchData.results.winner)
    }

    // 3️⃣ Fetch match stats
    let matchData = await fetch(`https://open.faceit.com/data/v4/matches/${matchid}/stats`, {
      headers
    });
    if (!matchData.ok) {
      if (matchData.status === 404) {
        console.warn(`Match stats not found for match ${matchid} (404). Using empty object.`);
        skipPrinting = true;
        matchData = {};
      } else {
        throw new Error(`Failed to fetch match stats: ${matchData.status}`);
      }
    } else {
      matchData = await matchData.json();
    }

    matchData.seasonNum = seasonNum;
    matchData.Division = seasonDiv;

    const FinalStats = {
      PicksAndBans: Stats,
      matchData: matchData,
      teamMatchData: teamMatchData,
      skipPrinting: skipPrinting
    };

    return FinalStats;
  } catch (err) {
    console.error("Unexpected error fetching game stats:", err);
    throw err; // still throw for non-404 errors
  }
}
