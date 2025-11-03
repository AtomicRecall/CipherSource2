import { ResponsiveIcicle } from '@nivo/icicle'
import React, { useEffect, useMemo, useState } from 'react'

interface MapStats {
  map_name: string;
  count: number;
}

interface IcicleData {
  id: string;
  name: string;
  value?: number; // optional: only leaves should carry a value
  children?: IcicleData[];
}

interface CreateIcicleGraphProps {
  bannedData: MapStats[];
  firstBanData: MapStats[];
  secondBanData: MapStats[];
  thirdBanData: MapStats[];
  type: string;
}

// Function to get map color (same as in CreateStatsPage)
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

// Transform ban data into icicle graph format
// Helper: compute total numeric value for a node (summing children when value is undefined)
const computeNodeValue = (node: IcicleData): number => {
  if (typeof node.value === 'number') return node.value;
  if (!node.children || node.children.length === 0) return 0;
  return node.children.reduce((sum, child) => sum + computeNodeValue(child), 0);
};

// Helper: sort node.children descending by their computed values, recursively
const sortIcicleDescending = (node: IcicleData) => {
  if (!node.children || node.children.length === 0) return;
  // descending: larger values first
  node.children.sort((a, b) => computeNodeValue(b) - computeNodeValue(a));
  node.children.forEach(child => sortIcicleDescending(child));
};

const transformBanDataForIcicle = (
  bannedData: MapStats[],
  firstBanData: MapStats[],
  secondBanData: MapStats[],
  thirdBanData: MapStats[],
  type:string
): IcicleData => {
  
  let bo3ornot = (thirdBanData.length > 0) ? true : false;
  const BOWHAT = (bo3ornot) ? "BO1" : "BO3";
  const WHATTYPE = (type === "bans") ? "Banned" : "Picked";
  const TYPEOTHER = (type === "bans") ? "Ban" : "Pick";
  let most:MapStats[] = [];
  let least:MapStats[] = [];
  let first:MapStats[] = [];
  let second:MapStats[] = [];
  let third:MapStats[] = [];
  let count = 0;
  let maxCount = 0;
  let minCount = Infinity;
  for(const map of bannedData){
    count += map.count;
    if(map.count > maxCount){
      maxCount = map.count;
      most = [map];
    } else if(map.count === maxCount){
      most.push(map);
    }
    if(map.count < minCount){
      minCount = map.count;
      least = [map];
    } else if(map.count === minCount){
      least.push(map);
    }
  }
  let firstMax = 0;
  for(const map of firstBanData){
    if(map.count > firstMax){
      firstMax = map.count;
      first = [map];
    } else if(map.count === firstMax){
      first.push(map);
    }
  }
  let secondMax = 0;
  for(const map of secondBanData){
    if(map.count > secondMax){
      secondMax = map.count;
      second = [map];
    } else if(map.count === secondMax){
      second.push(map);
    }
  }
  let thirdMax = 0;
  for(const map of thirdBanData){
    if(map.count > thirdMax){
      thirdMax = map.count;
      third = [map];
    } else if(map.count === thirdMax){
      third.push(map);
    }
  }

  let mostNames = most.map(m => m.map_name.substring(3)).join(', ');
  let leastNames = least.map(m => m.map_name.substring(3)).join(', ');
  let firstNames = first.map(m => m.map_name.substring(3)).join(', ');
  let secondNames = second.map(m => m.map_name.substring(3)).join(', ');
  let thirdNames = third.map(m => m.map_name.substring(3)).join(', ');

  let defaultID = "Most " + WHATTYPE+" = "+mostNames+" ("+most[0]?.count+") [First "+TYPEOTHER+" = "+firstNames+", Second "+TYPEOTHER+" = "+secondNames+(thirdBanData.length>0?(", Third "+TYPEOTHER+" = "+thirdNames):(""))+"]| Least " + WHATTYPE+" = "+leastNames+" ("+least[0]?.count+")";
  if(most[0]?.count == least[0]?.count){
    defaultID = "Total " + WHATTYPE+" = "+count;
  }
  // Create the root node (do NOT set a value on the root; let the layout compute
  // parent sizes from children to avoid double-counting)
  const rootNode: IcicleData = {
    id:  defaultID,
    name: '',
    children: []
  };

  // For each map that has been banned, create a map node with ban position breakdown
  bannedData.forEach(map => {
    const mapNode: IcicleData = {
      id: (normalizeKey(map.map_name).substring(0,1).toLocaleUpperCase() + normalizeKey(map.map_name).substring(1)) + ' - ' + map.count.toString(),
      name: map.map_name,
      children: []
    };

    // Find corresponding ban position data for this map
    const firstBanEntry = firstBanData.find(ban => ban.map_name === map.map_name);
    const secondBanEntry = secondBanData.find(ban => ban.map_name === map.map_name);
    const thirdBanEntry = thirdBanData.find(ban => ban.map_name === map.map_name);

    // Add ban position children if they exist
    if (firstBanEntry && firstBanEntry.count > 0) {
      mapNode.children!.push({
        id: "First - "+firstBanEntry.count.toString(),
        name: map.map_name,
        value: firstBanEntry.count
      });
    }

    if (secondBanEntry && secondBanEntry.count > 0) {
      mapNode.children!.push({
        id: "Second - "+secondBanEntry.count.toString(), 
        name: map.map_name,
        value: secondBanEntry.count
      });
    }

    if (thirdBanEntry && thirdBanEntry.count > 0) {
      mapNode.children!.push({
        id: "Third - "+thirdBanEntry.count.toString(),
        name: map.map_name,
        value: thirdBanEntry.count
      });
    }

    // Only add map node if it has children (ban position data)
    // If this map has no position children, make it a leaf by assigning its total count
    // as the value. If it has children, leave value undefined so the layout uses the
    // children's values to size the node.
    if (!mapNode.children || mapNode.children.length === 0) {
      mapNode.value = map.count;
      // remove the empty children array to keep leaves clean
      delete mapNode.children;
    }

    rootNode.children!.push(mapNode);
  });

  // Sort children descending so larger values appear first (left-to-right)
  sortIcicleDescending(rootNode);

  return rootNode;
};

// normalize a node name to a short key like 'dust2', 'inferno', etc.
const normalizeKey = (raw: string) => {
  if (!raw) return '';
  const m = raw.match(/de_([a-z0-9_]+)/i);
  if (m && m[1]) return m[1].toLowerCase();

  return raw.replace(/^de_/, '').toLowerCase().split(/[^a-z0-9]+/)[0];
};

const CreateIcicleGraph: React.FC<CreateIcicleGraphProps> = ({
  bannedData,
  firstBanData,
  secondBanData,
  thirdBanData,
  type
}) => {
  const icicleData = transformBanDataForIcicle(
    bannedData,
    firstBanData,
    secondBanData,
    thirdBanData,
    type
  );

  return (
    <div style={{ height: '150px', width: '100%' }}>
      <ResponsiveIcicle
        data={icicleData}
        colors={(node) => whatColor(node.data.name)}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        valueFormat=">-.0f"
        enableLabels={true}
        labelAlign="center"
        labelRotation={0}
        label={(node: any) => node?.id || node?.data?.id || ''}
        borderWidth={1}
        animate={true}
        motionConfig="gentle"
        labelTextColor="#020202ff"
        
        theme={{
          labels: {
            text: {
              fontSize: 15,
              fill: '#ffffff',
              fontFamily: 'Play, sans-serif',
              fontWeight: '600'
              
            }
          },

        }}
        tooltip={(node: any) => {
          if (!node) return null;
          return (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.9)',
                color: '#ffffff',
                fontFamily: 'Play, sans-serif',
                textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '10px',
                boxShadow: '0 4px 1px rgba(0,0,0,0.3)'
              }}
            >
              <div
                style={{
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  color: '#fff'
                }}
              >
                {node.data.name || 'Total'}
              </div>
              <div style={{ marginBottom: '2px' }}>
                <span style={{ color: '#ccc' }}>Count:</span>{' '}
                <span style={{ color: '#fff', fontWeight: 'bold' }}>
                  {node.value || 0}
                </span>
              </div>
              <div style={{ marginBottom: '2px' }}>
                <span style={{ color: '#ccc' }}>Percentage:</span>{' '}
                <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                  {node.percentage.toFixed(2)}%
                </span>
              </div>
              {node.parent && (
                <div
                  style={{
                    fontSize: '11px',
                    color: '#aaa',
                    marginTop: '4px'
                  }}
                >
                  of {node.parent.id}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default CreateIcicleGraph;
