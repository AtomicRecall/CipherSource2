import React from "react";
import ReactCountryFlag from "react-country-flag";

interface FlagProps {
  countryCode: string; // ISO alpha-2 code, e.g. "US"
}
const regionToCode: Record<string, string> = {
  // Individual countries
  "United States": "US",
  "United Kingdom": "GB",
  Japan: "JP",
  Germany: "DE",
  France: "FR",
  Canada: "CA",
  Mexico: "MX",
  Brazil: "BR",
  Argentina: "AR",
  China: "CN",
  India: "IN",
  Russia: "RU",
  "South Korea": "KR",
  Australia: "AU",
  "New Zealand": "NZ",
  "South Africa": "ZA",
  Egypt: "EG",
  Turkey: "TR",
  "Saudi Arabia": "SA",
  Israel: "IL",

  // Continents / regions (map to representative country)
  "North America": "US",
  "South America": "BR",
  Europe: "GB",
  Asia: "CN",
  Africa: "ZA",
  Oceania: "AU",
  "Middle East": "SA",
  Caribbean: "CU", // Cuba as representative
  "Central America": "MX",
  "Southeast Asia": "TH", // Thailand as representative
  Scandinavia: "SE", // Sweden
  Benelux: "NL", // Netherlands
  "Eastern Europe": "PL", // Poland
  "Western Europe": "FR", // France
  Baltics: "LT", // Lithuania
  Balkans: "GR", // Greece
  "Central Africa": "CD", // Democratic Republic of Congo
  "North Africa": "EG", // Egypt
  "Southern Africa": "ZA", // South Africa
  "Central Asia": "KZ", // Kazakhstan
  "South Asia": "IN",
  "East Asia": "JP",

  // Major regions by economy or organization
  G7: "US",
  G20: "US",
  EU: "DE", // Germany as representative
  NATO: "US",
};

const Flag: React.FC<FlagProps> = ({ countryCode }) => {
  const code = regionToCode[countryCode];

  if (!code) return <span>🏳️</span>;

  return (
    <ReactCountryFlag
      svg
      countryCode={code}
      style={{
        width: "1em",
        height: "1em",
      }}
      title={countryCode}
    />
  );
};

export default Flag;
