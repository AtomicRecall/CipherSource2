import { Image } from "@heroui/react";
export default function GetAndReturnESEALOGO(Data: any) {
  console.log("the adata ", Data);
  let logoUrl = `images/S${Data.Data}logo.png`;

  console.log("penis p[pp[", logoUrl);

  return (
    <div className="flex items-center mb-2">
      <Image alt="ESEALogo" src={logoUrl} width={30} />
      
    </div>
  );
}
