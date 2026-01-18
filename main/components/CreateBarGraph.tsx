import { ResponsiveBar } from "@nivo/bar";

function whatColor(mapname: string): string {
  switch (mapname) {
    case "de_dust2":
      return "#FFF2BA";
    case "de_ancient":
      return "#00FF00";
    case "de_nuke":
      return "#00C8FF";
    case "de_anubis":
      return "#FF6666";
    case "de_inferno":
      return "#FFCD00";
    case "de_vertigo":
      return "#0000FF";
    case "de_mirage":
      return "#994C00";
    case "de_train":
      return "#331900";
    case "de_overpass":
      return "#660066";
    default:
      return "#ffffffff";
  }
}
export const MyBarCanvas = ({ data }: { data: any }) => {
  // console.log("MyBarCanvas received data:", data);

  if (!data || data.length === 0) {
    return <div className="text-white text-center">No data available!</div>;
  }

  // Process data to remove de_ prefix from map names and add total
  const processedData = data.map((item: any) => {
    const processedName =
      item.country?.replace(/^de_/, "").substring(0, 1).toUpperCase() +
        item.country?.replace(/^de_/, "").substring(1) || item.country;
    const total = (Number(item.wins) || 0) + (Number(item.losses) || 0);

    return {
      ...item,
      country: `${processedName} (${total})`,
      originalMap: item.country,
      total: total,
    };
  });

  // Compute max total (wins + losses or provided totalPlayed) to drive dynamic grid/ticks
  const getTotal = (item: any) => {
    const wins = Number(item.wins) || 0;
    const losses = Number(item.losses) || 0;
    const totalPlayed = Number(item.totalPlayed);

    return Number.isFinite(totalPlayed) && totalPlayed >= 0
      ? totalPlayed
      : wins + losses;
  };

  const maxTotal = Math.max(...processedData.map(getTotal), 0);
  // Prefer ticks for every integer (0..maxTotal). If maxTotal is very large, fall back to a step.
  const MAX_TICK_COUNT = 200; // safety cap to avoid creating excessively large arrays
  let tickValues: number[];

  if (maxTotal <= MAX_TICK_COUNT) {
    tickValues = Array.from({ length: maxTotal + 1 }, (_, i) => i);
  } else {
    // Fallback: create up to MAX_TICK_COUNT ticks by stepping
    const step = Math.ceil(maxTotal / MAX_TICK_COUNT);

    tickValues = Array.from(
      { length: Math.floor(maxTotal / step) + 1 },
      (_, i) => i * step,
    );
    if (tickValues[tickValues.length - 1] < maxTotal) tickValues.push(maxTotal);
  }

  // Dynamic sizing based on number of maps
  const mapCount = data.length;
  const minHeight = 200; // Minimum height for 1-2 maps
  const maxHeight = 600; // Maximum height for many maps
  const heightPerMap = 40; // Height per map
  const calculatedHeight = Math.min(
    maxHeight,
    Math.max(minHeight, mapCount * heightPerMap),
  );
  // console.log("organize infofr", processedData);
  let mostPlayed: any = [];
  let leastPlayed: any = [];
  let maxCount = 0;
  let minCount = Infinity;

  for (const item of processedData) {
    const total = item.total;

    if (total > maxCount) {
      maxCount = total;
      mostPlayed = [item];
    } else if (total === maxCount) {
      mostPlayed.push(item);
    }
    if (total < minCount) {
      minCount = total;
      leastPlayed = [item];
    } else if (total === minCount) {
      leastPlayed.push(item);
    }
  }
  // Use full width of container
  const widthPercentage = "100%";

  return (
    <div className="flex">
      {/* Bar Graph */}
      <div className="" style={{ height: `${300}px`, width: widthPercentage }}>
        <div style={{ height: `${260}px`, flex: 1 }}>
          <h3 className="text-center mb-1 font-bold text-white text-xl">
            Maps Played
          </h3>
          <ResponsiveBar
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              format: (value) =>
                Number.isInteger(value) || typeof value === "number"
                  ? value.toString()
                  : "",
              tickValues,
            }}
            axisTop={{
              tickSize: 0,
              tickPadding: 0,
              tickRotation: 0,
              format: () => "",
              tickValues: [],
            }}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            colors={["#22c55e", "#ef4444"]} // Green for wins, red for losses
            data={processedData}
            enableGridX={true}
            enableGridY={false}
            gridXValues={tickValues}
            gridYValues={[]}
            indexBy="country"
            keys={["wins", "losses"]}
            label={(d) => {
              const wins = Number(d.data.wins) || 0;
              const losses = Number(d.data.losses) || 0;
              const totalPlayed = Number(d.data.totalPlayed) || wins + losses;
              // console.log('Label function called:', { id: d.id, data: d.data, totalPlayed });

              // If no data, don't show any text
              if (totalPlayed === 0) {
                return "";
              }

              // Show win rate on wins bar only if > 0%
              if (d.id === "wins") {
                const winRate =
                  totalPlayed > 0 ? Math.round((wins / totalPlayed) * 100) : 0;

                if (winRate > 0) {
                  const result = `WR: ${winRate}%`;

                  //  console.log('Wins case:', result);
                  return result;
                }

                return "";
              }

              // Show number of losses on losses bar only if > 0
              if (d.id === "losses") {
                const lossesNum = losses;

                if (lossesNum > 0) {
                  const result = `L: ${lossesNum}`;

                  // console.log('Losses case:', result);
                  return result;
                }

                return "";
              }

              // console.log('No match case, returning empty');
              return "";
            }}
            labelSkipHeight={0}
            labelSkipWidth={0}
            labelTextColor="#ffffff"
            layout="horizontal"
            margin={{ top: 0, right: 20, bottom: 80, left: 90 }}
            theme={{
              background: "transparent",
              labels: {
                text: {
                  fontSize: 14,
                  fill: "#ffffff",
                  fontFamily: "Play, sans-serif",
                  fontWeight: "bold",
                },
              },
              text: {
                fontSize: 14,
                fill: "#ffffff",
                fontFamily: "Play, sans-serif",
                textShadow: "2px 2px 1px rgba(0, 0, 0, 1)",
              },
              axis: {
                domain: {
                  line: {
                    stroke: "#ffffff",
                  },
                },
                legend: {
                  text: {
                    fill: "#ffffff",
                  },
                },
                ticks: {
                  line: {
                    stroke: "#ffffff",
                  },
                  text: {
                    fill: "#ffffff",
                  },
                },
              },
              grid: {
                line: {
                  stroke: "#ffffff",
                  strokeOpacity: 0.4,
                  strokeWidth: 1,
                },
              },
            }}
          />
        </div>
        <h3 className="text-center mb-1 font-bold text-white text-xl">
          MOST PLAYED:{" "}
          {mostPlayed.map((item: any, index: number) => (
            <span
              key={item.originalMap}
              style={{ color: whatColor(item.originalMap) }}
            >
              {item.country.split(" (")[0]}
              {index < mostPlayed.length - 1 ? "" : ""}
              <span className={"text-white"}>
                {index < mostPlayed.length - 1 ? (
                  ", "
                ) : (
                  <span>
                    {" "}
                    ({item.total} Time{item.total > 1 ? "s" : ""})
                  </span>
                )}
              </span>
            </span>
          ))}{" "}
          | LEAST PLAYED:{" "}
          {leastPlayed.map((item: any, index: number) => (
            <span
              key={item.originalMap}
              style={{ color: whatColor(item.originalMap) }}
            >
              {item.country.split(" (")[0]}
              {index < leastPlayed.length - 1 ? "" : ""}

              <span className={"text-white"}>
                {index < leastPlayed.length - 1 ? (
                  ", "
                ) : (
                  <span>
                    {" "}
                    ({item.total} Time{item.total > 1 ? "s" : ""})
                  </span>
                )}
              </span>
            </span>
          ))}
        </h3>
      </div>
    </div>
  );
};
