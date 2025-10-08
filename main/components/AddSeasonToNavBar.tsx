import { Image } from "@heroui/react";

import CalculateStats from "@/components/CalculateStatsForNavBar";

export default function AddSeasonToMenu(stats: any) {
  console.log("Fart penis ", stats.stats.matchData);
  console.log("OUR TEAM???", stats.SELECT);
  console.log("FUCK BALLS ", stats);
  let isBO3 = stats.stats.matchData.rounds.length > 1 ? true : false;
    const OpenMatchPage =
      (matchID: any) => (event: React.MouseEvent<HTMLParagraphElement>) => {
        event.preventDefault();
        event.stopPropagation();
        window.open("https://www.faceit.com/en/cs2/room/" + matchID);
        // Your custom logic here
      };
  console.log("GET UP", parseInt(stats.stats.matchData.seasonNum));

  function returnImage(round: any) {
    console.log("fuck balls fuck ", round);
    console.log("god damnit piss balls ", stats.stats);
    const width = 250;

    //for(const map of stats.stats.PicksAndBans.payload.tickets[2].entities){
    //if(map.status == "pick"){
    switch (round) {
      case "de_dust2":
        return (
          <div
            key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} dust2`}
          >
            <Image
              alt="Dust2"
              className="object-cover"
              height={140}
              radius={"none"}
              src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/7c17caa9-64a6-4496-8a0b-885e0f038d79_1695819126962.jpeg"
              width={width}
            />
          </div>
        );
      case "de_inferno":
        return (
          <div
            key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} inferno`}
          >
            <Image
              alt="Inferno"
              className="object-cover"
              height={140}
              radius={"none"}
              src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/993380de-bb5b-4aa1-ada9-a0c1741dc475_1695819220797.jpeg"
              width={width}
            />
          </div>
        );
      case "de_ancient":
        return (
          <div
            key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} ancient`}
          >
            <Image
              alt="Ancient"
              className="object-cover"
              height={140}
              radius={"none"}
              src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/5b844241-5b15-45bf-a304-ad6df63b5ce5_1695819190976.jpeg"
              width={width}
            />
          </div>
        );
      case "de_mirage":
        return (
          <div
            key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} mirage`}
          >
            <Image
              alt="Mirage"
              className="object-cover"
              height={140}
              radius={"none"}
              src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/7fb7d725-e44d-4e3c-b557-e1d19b260ab8_1695819144685.jpeg"
              width={width}
            />
          </div>
        );
      case "de_nuke":
        return (
          <div
            key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} nuke`}
          >
            <Image
              alt="Nuke"
              className="object-cover"
              height={140}
              radius={"none"}
              src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/7197a969-81e4-4fef-8764-55f46c7cec6e_1695819158849.jpeg"
              width={width}
            />
          </div>
        );
      case "de_train":
        return (
          <div
            key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} train`}
          >
            <Image
              alt="Train"
              className="object-cover"
              height={140}
              radius={"none"}
              src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/225a54ad-c66d-46ee-8ae1-2e4159691ee9_1731582334484.png"
              width={width}
            />
          </div>
        );
      case "de_vertigo":
        return (
          <div
            key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} vertigo`}
          >
            <Image
              alt="Vertigo"
              className="object-cover"
              height={140}
              radius={"none"}
              src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/3bf25224-baee-44c2-bcd4-f1f72d0bbc76_1695819180008.jpeg"
              width={width}
            />
          </div>
        );
      case "de_anubis":
        return (
          <div
            key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} anubis`}
          >
            <Image
              alt="Anubis"
              className="object-cover"
              height={140}
              radius={"none"}
              src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/31f01daf-e531-43cf-b949-c094ebc9b3ea_1695819235255.jpeg"
              width={width}
            />
          </div>
        );

      case "de_overpass":
        return (
          <div
            key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} anubis`}
          >
            <Image
              alt="Overpass"
              className="object-cover"
              height={140}
              radius={"none"}
              src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/058c4eb3-dac4-441c-a810-70afa0f3022c_1695819170133.jpeg"
              width={width}
            />
          </div>
        );
      default:
        return null; // render nothing for other maps
    }
    //}

    //}
  }

  return (
    <div onClick={OpenMatchPage(stats.stats.teamMatchData.match_id)} key={stats.stats.matchData.seasonNum}>
      {isBO3 ? (
        <div className="flex rounded-lg overflow-hidden mt-2 cursor-pointer hover:shadow-[0_0_8px_white] transition duration-200">
          <div className="flex justfiy-center">
            <CalculateStats
              SelectedTeam={stats.SELECT}
              isBo3={true}
              stats={stats}
            />
          </div>

          <div className="flex">
            <div className="flex">
              {stats.stats.PicksAndBans.payload.tickets[2].entities
                .filter((map: any) => map.status === "pick")
                .map((map: any) => returnImage(map.guid))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex rounded-lg overflow-hidden mt-2 cursor-pointer hover:shadow-[0_0_8px_white] transition duration-200">
          <div className="justify-center">
            <CalculateStats
              SelectedTeam={stats.SELECT}
              isBo3={false}
              stats={stats}
            />
          </div>

          {stats.stats.PicksAndBans.payload.tickets[2].entities
            .filter((map: any) => map.status === "pick")
            .map((map: any) => returnImage(map.guid))}
        </div>
      )}
    </div>
  );
}
