

export default async function fetchUpcomingMatches(teamId,champID) {
  try {
    // 1️⃣ Fetch basic team info


    const Games = await fetch(`https://cipher-virid.vercel.app/api/ChampionshipMatchesProxy?teamId=${teamId}&champID=${champID}`, {
  
    });
    https://cipher-virid.vercel.app/api/proxy2?endpoint=${matchid}/history
    if (!Games.ok) throw new Error("Failed to fetch poop info");

    return Games;
    }catch (err) {
        console.error(err);
        throw err;
     }
 }
