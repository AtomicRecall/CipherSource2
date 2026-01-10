import { getFaceitHeaders } from "../config/api-keys";

export default async function fetchLatestUsername(playerId) {
    try {
      
      const headers = getFaceitHeaders();
      const resPlayer = await fetch(`https://open.faceit.com/data/v4/players/${playerId}`, {
        headers,
      });
  
      if (!resPlayer.ok) throw new Error("Failed to fetch player info");
      const PlayerData = await resPlayer.json();
      //console.log("GET YOUR BOOTYHOLE DOWN: ",PlayerData);
      const playerInfo = {
        nickname: PlayerData.nickname,
        avatar: PlayerData.avatar
      };
      return playerInfo;
    } catch (error) {
      console.error("Error fetching latest username:", error);
      return null; // or return a default value like playerId
    }
}