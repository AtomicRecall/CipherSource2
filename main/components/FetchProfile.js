import { getFaceitHeaders } from "../config/api-keys";
import fetchUpcomingMatches from "./FetchUpcomingMatches";

export default async function fetchTeamProfile(teamId) {
  try {
    const headers = getFaceitHeaders();
    console.log("🔑 Using API headers:", headers.Authorization ? "✅ Set" : "❌ Not set");
    
    const resTeam = await fetch(`https://open.faceit.com/data/v4/teams/${teamId}`, {
      headers,
    });

    console.log("📡 API Response status:", resTeam.status);
    if (!resTeam.ok) {
      const errorText = await resTeam.text();
      console.error("❌ API Error:", errorText);
      throw new Error(`Failed to fetch team info: ${resTeam.status} - ${errorText}`);
    }
    const teamData = await resTeam.json();


    const resTeamStats = await fetch(`https://open.faceit.com/data/v4/teams/${teamId}/stats/cs2`, {
      headers,
    });

    if (!resTeamStats.ok) throw new Error("Failed to fetch team info");
    const teamDataStats = await resTeamStats.json();

    // 2️⃣ Fetch team leagues summary
    const resLeagues = await fetch(
      `https://cipher-virid.vercel.app/api/TeamLeagueProxy?teamId=${teamId}`
    );

    if (!resLeagues.ok) throw new Error("Failed to fetch team leagues");
    let leagueData = await resLeagues.json();
    leagueData = leagueData.payload;

    let upcomingdata = [];
    for (const seasonstandings of leagueData[0].league_seasons_info[0].season_standings){
        const UpcomingMatches = await fetchUpcomingMatches(teamId,seasonstandings.championship_id);
        if(!UpcomingMatches.ok) throw new Error("Failed to fetch upcoming matches");
        let fart = await UpcomingMatches.json();
        upcomingdata.push(fart.payload);
    }
    
  

    let finalreturn = {
      teamdata: teamData,
      teamstats: teamDataStats,
      leagues: leagueData,
      UpcomingMatches: upcomingdata,
    }

    return finalreturn;
  } catch (err) {
    console.error(err);
    throw err;
  }
}