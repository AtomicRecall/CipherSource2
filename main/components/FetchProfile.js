import { getFaceitHeaders } from "../config/api-keys";

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
    
    
    for(const season of leagueData[0].league_seasons_info){
      let organizedLeagueSeasonInfo = [];
      let DivisionCheck = season.season_standings[0].division_name;
      let DivisionArray = [];
      for(const Division of season.season_standings){
        if(Division.division_name == DivisionCheck){
          DivisionArray.push(Division);
        }
        else{
          DivisionCheck = Division.division_name;
          organizedLeagueSeasonInfo.push(DivisionArray);
          DivisionArray = [];
          DivisionArray.push(Division);
        }
      };
      // Push the last group after the loop
      if (DivisionArray.length > 0) {
        organizedLeagueSeasonInfo.push(DivisionArray);
      }
      console.log("🏆 Organized League Season Info:", organizedLeagueSeasonInfo);
      
      // Replace the original season standings with the organized groups
      season.season_standings = organizedLeagueSeasonInfo;
    }
    
    

    let finalreturn = {
      teamdata: teamData,
      teamstats: teamDataStats,
      leagues: leagueData,
    }

    return finalreturn;
  } catch (err) {
    console.error(err);
    throw err;
  }
}