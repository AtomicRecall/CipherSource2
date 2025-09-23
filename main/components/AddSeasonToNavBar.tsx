import {Card, CardFooter, CardBody, Image, Button} from "@heroui/react";
import CalculateStats from "@/components/CalculateStatsForNavBar";


export default function AddSeasonToMenu(stats:any) {
    console.log("Fart penis ",stats.stats.matchData);
    console.log("OUR TEAM???",stats.SELECT);
    let isBO3 = (stats.stats.matchData.rounds.length > 1 ? true: false);
    console.log("GET UP",parseInt(stats.stats.matchData.seasonNum));

    function returnImage(round:any,){
        console.log("fuck balls fuck ",round);
        console.log("god damnit piss balls ",stats.stats)
        let height = 120;
        let width = 250;
        let radius = "none";

        let pickedMaps = [];
        //for(const map of stats.stats.PicksAndBans.payload.tickets[2].entities){
            //if(map.status == "pick"){
                switch (round) {
                    case "de_dust2":
                        return (    

                            <div key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} dust2`}>
                                    
                                    <Image
                                        src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/7c17caa9-64a6-4496-8a0b-885e0f038d79_1695819126962.jpeg"
                                        alt="Dust2"
                                        height={140} 
                                        width={width}  
                                        className="object-cover"
                                        radius={"none"}
                                    >
                                    </Image>
                                    
                            </div>
                            
                        );
                    case "de_inferno":
                        return (    
                            <div key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} inferno`}>
                                    
                                    <Image
                                        src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/993380de-bb5b-4aa1-ada9-a0c1741dc475_1695819220797.jpeg"
                                        alt="Inferno"
                                        height={140} 
                                        width={width}  
                                        className="object-cover"
                                        radius={"none"}
                                    >
                                    </Image>
                                    
                            </div>
                            
                        );
                    case "de_ancient":
                        return (    
                            <div key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} ancient`}>
                                    
                                    <Image
                                        src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/5b844241-5b15-45bf-a304-ad6df63b5ce5_1695819190976.jpeg"
                                        alt="Ancient"
                                        height={140} 
                                        width={width}  
                                        className="object-cover"
                                        radius={"none"}
                                    >
                                    </Image>
                                    
                            </div>
                            
                        );
                    case "de_mirage":
                        return (    
                            <div key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} mirage`}>
                                    
                                    <Image
                                        src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/7fb7d725-e44d-4e3c-b557-e1d19b260ab8_1695819144685.jpeg"
                                        alt="Mirage"
                                        height={140} 
                                        width={width}  
                                        className="object-cover"
                                        radius={"none"}
                                    >
                                    </Image>
                                    
                            </div>
                            
                        );
                        case "de_nuke":
                            return (    
                                <div key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} nuke`}>
                                        
                                        <Image
                                            src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/7197a969-81e4-4fef-8764-55f46c7cec6e_1695819158849.jpeg"
                                            alt="Nuke"
                                            height={140} 
                                            width={width}  
                                            className="object-cover"
                                            radius={"none"}
                                        >
                                        </Image>
                                        
                                </div>
                                
                            );
                        case "de_train":
                            return (    
                                <div key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} train`}>
                                        
                                        <Image
                                            src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/225a54ad-c66d-46ee-8ae1-2e4159691ee9_1731582334484.png"
                                            alt="Train"
                                            height={140} 
                                            width={width}  
                                            className="object-cover"
                                            radius={"none"}
                                        >
                                        </Image>
                                        
                                </div>
                                
                            );
                        case "de_vertigo":
                            return (    
                                <div key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} vertigo`}>
                                        
                                        <Image
                                            src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/3bf25224-baee-44c2-bcd4-f1f72d0bbc76_1695819180008.jpeg"
                                            alt="Vertigo"
                                            height={140} 
                                            width={width}  
                                            className="object-cover"
                                            radius={"none"}
                                        >
                                        </Image>
                                        
                                </div>
                                
                            );
                            case "de_anubis":
                            return (    
                                <div key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} anubis`}>
                                        
                                        <Image
                                            src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/31f01daf-e531-43cf-b949-c094ebc9b3ea_1695819235255.jpeg"
                                            alt="Anubis"
                                            height={140} 
                                            width={width}  
                                            className="object-cover"
                                            radius={"none"}
                                        >
                                        </Image>
                                        
                                </div>
                                
                            );
                            
                            case "de_overpass":
                            return (    
                                <div key={`S${stats.stats.matchData.seasonNum} ${stats.stats.matchData.Division} anubis`}>
                                        
                                        <Image
                                            src="https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/058c4eb3-dac4-441c-a810-70afa0f3022c_1695819170133.jpeg"
                                            alt="Overpass"
                                            height={140} 
                                            width={width}  
                                            className="object-cover"
                                            radius={"none"}
                                        >
                                        </Image>
                                        
                                </div>
                                
                            );
                        default:
                        return null; // render nothing for other maps
                }
            //}
            
        //}
        
    }
    return (
        <div key={stats.stats.matchData.seasonNum}>
            
            {(isBO3)

            ?
                
                    
                    (<div className="flex rounded-lg overflow-hidden mt-2 cursor-pointer hover:shadow-[0_0_8px_white] transition duration-200">
                        <div className="flex justfiy-center">
                            <CalculateStats stats={stats} isBo3={true} SelectedTeam={stats.SELECT}/>
                        </div>
                        
                        <div className="flex">
                                <div className="flex">
                                {stats.stats.PicksAndBans.payload.tickets[2].entities
                                    .filter((map:any) => map.status === "pick")
                                    .map((map:any) => 
                                        returnImage(map.guid)
                                    )}
                                    
                                </div>
                        </div>
                        
                    </div>)
                
            


            : (<div className="flex rounded-lg overflow-hidden mt-2 cursor-pointer hover:shadow-[0_0_8px_white] transition duration-200" >
                    <div className="justify-center">
                        <CalculateStats stats={stats} isBo3={false} SelectedTeam={stats.SELECT}/>
                    </div>
                    
                    {stats.stats.PicksAndBans.payload.tickets[2].entities
                                    .filter((map:any) => map.status === "pick")
                                    .map((map:any) => 
                                        returnImage(map.guid)
                                    )}
               </div>)
                
            }
        </div>
    );

}