const API_KEY = "503892e2-2d7b-4373-ab3e-69f53a6acdd3";

import fetchUpcomingMatches from "./FetchUpcomingMatches";

export default async function fetchTeamProfile(teamId) {
  try {
    
    const resTeam = await fetch(`https://open.faceit.com/data/v4/teams/${teamId}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!resTeam.ok) throw new Error("Failed to fetch team info");
    const teamData = await resTeam.json();


    const resTeamStats = await fetch(`https://open.faceit.com/data/v4/teams/${teamId}/stats/cs2`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
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