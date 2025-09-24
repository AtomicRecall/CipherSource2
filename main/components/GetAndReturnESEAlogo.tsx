import { Image } from "@heroui/react";
export default function GetAndReturnESEALOGO(Data: any) {
  console.log("the adata ", Data);
  let logoUrl = `images/S${Data.Data[0].SeasonNumber}logo.png`;

  console.log("penis p[pp[", logoUrl);

  return (
    <div className="flex items-center mb-2">
      <Image alt="ESEALogo" src={logoUrl} width={30} />
      <h1
        className="text-md text-white ml-2"
        id="DivName"
        style={{ whiteSpace: "pre-line" }}
      >
        {Data.Data[0].stage_name === "Playoffs"
          ? `S${Data.Data[0].SeasonNumber} ${Data.Data[0].division_name}: (${Data.Data[1].wins} / ${Data.Data[1].losses}) \nPO: (${Data.Data[0].wins} / ${Data.Data[0].losses})`
          : `S${Data.Data[0].SeasonNumber} ${Data.Data[0].division_name}: (${Data.Data[0].wins} / ${Data.Data[0].losses})`}
      </h1>
    </div>
  );
}
