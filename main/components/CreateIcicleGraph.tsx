import { NumberInputSlots } from '@heroui/react';
import { ResponsiveIcicle } from '@nivo/icicle'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom';

interface MapStats {
  map_name: string;
  count: number;
  // optional per-match details used for 2nd/3rd ban breakdowns. Each entry
  // represents one match where this map was 2nd/3rd banned and can include
  // what the first ban was, that team's first ban, and (for 3rd-ban leaves)
  // what the second ban was. This is optional and preserves backward compatibility.
  details?: Array<{
    firstBan?: string;
    teamFirstBan?: string;
    secondBan?: string; // present when this map is the 3rd ban and you want to include 2nd-ban info
  }>;
}

interface IcicleData {
  id: string;
  name: string;
  total: number;
  MaxTotal: number;
  value?: number; // optional: only leaves should carry a value
  children?: IcicleData[];
}

interface CreateIcicleGraphProps {
  bannedData: MapStats[];
  firstBanData: MapStats[];
  secondBanData: MapStats[];
  thirdBanData: MapStats[];
  bo1FirstBanTeamAData?: MapStats[];
  bo1FirstBanTeamBData?: MapStats[];
  resetZoomRef?: React.MutableRefObject<(() => void) | null>;
  type: string;
  // optional: season number (used to exclude maps not present in a season)
  season?: number;
  // optional override: explicit list of active maps for the season (e.g. ['de_dust2', ...])
  activeMaps?: string[];
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
      return "#ffffff";
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
  // Custom sort: always put "First" (or "1st") children first, then
  // sort remaining siblings by their computed numeric value (descending).
  const isFirst = (n: IcicleData) => {
    if (!n || !n.id) return false;
    return (/^(first|1st)\b/i).test(n.id);
  };

  node.children.sort((a, b) => {
    const aIsFirst = isFirst(a);
    const bIsFirst = isFirst(b);
    if (aIsFirst && !bIsFirst) return -1;
    if (!aIsFirst && bIsFirst) return 1;
    // neither or both are "First" — fall back to value-based descending order
    return computeNodeValue(b) - computeNodeValue(a);
  });

  node.children.forEach(child => sortIcicleDescending(child));
};

const transformBanDataForIcicle = (
  bannedData: MapStats[],
  firstBanData: MapStats[],
  secondBanData: MapStats[],
  thirdBanData: MapStats[],
  bo1FirstBanTeamAData: MapStats[] | undefined,
  bo1FirstBanTeamBData: MapStats[] | undefined,
  type:string,
  season?: number,
  activeMaps?: string[]
): IcicleData => {
  // ensure we include known maps (so maps with 0 bans are represented)
  // list derived from whatColor switch cases. Allow caller to override via activeMaps.
  const knownMapNames = activeMaps && activeMaps.length > 0 ? [...activeMaps] : [
    'de_dust2',
    'de_ancient',
    'de_nuke',
    'de_anubis',
    'de_inferno',
    'de_vertigo',
    'de_mirage',
    'de_train',
    'de_overpass'
  ];

  // season-specific removals: season 55 removed anubis and vertigo
  if (season === 55) {
    // remove from knownMapNames if present
    const toRemove = new Set(['de_anubis', 'de_vertigo']);
    for (let i = knownMapNames.length - 1; i >= 0; i--) {
      if (toRemove.has(knownMapNames[i])) knownMapNames.splice(i, 1);
    }
  }

  // create local copies and ensure each known map has an entry (count 0 if missing)
  const bannedAll: MapStats[] = [...bannedData];
  const firstAll: MapStats[] = [...firstBanData];
  const secondAll: MapStats[] = [...secondBanData];
  const thirdAll: MapStats[] = [...thirdBanData];
  const bo1FirstAAll: MapStats[] = bo1FirstBanTeamAData ? [...bo1FirstBanTeamAData] : [];
  const bo1FirstBAll: MapStats[] = bo1FirstBanTeamBData ? [...bo1FirstBanTeamBData] : [];

  const ensureEntries = (arr: MapStats[]) => {
    const names = new Set(arr.map(a => a.map_name));
    for (const km of knownMapNames) {
      if (!names.has(km)) arr.push({ map_name: km, count: 0 });
    }
  };

  ensureEntries(bannedAll);
  ensureEntries(firstAll);
  ensureEntries(secondAll);
  ensureEntries(thirdAll);
  // also ensure bo1 arrays have entries so leaves appear consistently
  if (bo1FirstAAll.length > 0) ensureEntries(bo1FirstAAll);
  if (bo1FirstBAll.length > 0) ensureEntries(bo1FirstBAll);

  let bo3ornot = (thirdAll.length > 0) ? true : false;
  const BOWHAT = (bo3ornot) ? "BO1" : "BO3";
  const WHATTYPE = (type === "bans") ? "Banned" : "Picked";
  const TYPEOTHER = (type === "bans") ? "Ban" : "Pick";
  let most:MapStats[] = [];
  let least:MapStats[] = [];
  let first:MapStats[] = [];
  let second:MapStats[] = [];
  let third:MapStats[] = [];
  let count = 0;
  let maxCount = -Infinity;
  let minCount = Infinity;
  for(const map of bannedAll){
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
  let firstMax = -Infinity;
  for(const map of firstAll){
    if(map.count > firstMax){
      firstMax = map.count;
      first = [map];
    } else if(map.count === firstMax){
      first.push(map);
    }
  }
  let secondMax = -Infinity;
  for(const map of secondAll){
    if(map.count > secondMax){
      secondMax = map.count;
      second = [map];
    } else if(map.count === secondMax){
      second.push(map);
    }
  }
  let thirdMax = -Infinity;
  for(const map of thirdAll){
    if(map.count > thirdMax){
      thirdMax = map.count;
      third = [map];
    } else if(map.count === thirdMax){
      third.push(map);
    }
  }

  let mostNames = most.map(m => formatMapName(m.map_name)).join(', ');
  let leastNames = least.map(m => formatMapName(m.map_name)).join(', ');
  let firstNames = first.map(m => formatMapName(m.map_name)).join(', ');
  let secondNames = second.map(m => formatMapName(m.map_name)).join(', ');
  let thirdNames = third.map(m => formatMapName(m.map_name)).join(', ');

  // use non-breaking spaces (\u00A0) so the gap is preserved in HTML/SVG rendering
  const bigGap = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
  let defaultID = "Most " + WHATTYPE + " = " + mostNames + " (" + most[0]?.count + ")" +bigGap+" Least " + WHATTYPE + " = " + leastNames + " (" + least[0]?.count + ")";
  if(most[0]?.count == least[0]?.count){
    defaultID = "Total " + WHATTYPE+" = "+count;
  }
  // Create the root node (do NOT set a value on the root; let the layout compute
  // parent sizes from children to avoid double-counting)
  const rootNode: IcicleData = {
    id:  defaultID,
    name: '',
    total: 0,
    MaxTotal: count,
    children: []
  };

  // For each map that has been banned, create a map node with ban position breakdown
  // iterate over the ensured array so zero-count maps are included
  bannedAll.forEach(map => {
    // If this map has absolutely no bans (and no corresponding position counts),
    // skip adding it so the icicle doesn't show zero-count maps that were only
    // added for statistics (like finding the least banned map).
    const mapTotalCount = map.count || 0;
    const hasFirst = firstAll.find(b => b.map_name === map.map_name && b.count > 0);
    const hasSecond = secondAll.find(b => b.map_name === map.map_name && b.count > 0);
    const hasThird = thirdAll.find(b => b.map_name === map.map_name && b.count > 0);
    if (mapTotalCount === 0 && !hasFirst && !hasSecond && !hasThird) {
      return; // skip this iteration
    }
    const mapNode: IcicleData = {
      id: ((map.count > 2 || count < 40) ? normalizeKey(map.map_name).substring(0,1).toLocaleUpperCase() + normalizeKey(map.map_name).substring(1) : normalizeKey(map.map_name).substring(0,1).toLocaleUpperCase() + normalizeKey(map.map_name).substring(1,3)) + ' - ' + map.count.toString(),
      name: map.map_name,
      MaxTotal: count,
      total: count,
      children: []
    };

    // Find corresponding ban position data for this map
    const firstBanEntry = firstAll.find(ban => ban.map_name === map.map_name);
    const secondBanEntry = secondAll.find(ban => ban.map_name === map.map_name);
    const thirdBanEntry = thirdAll.find(ban => ban.map_name === map.map_name);

    // Add ban position children if they exist
    // Create "First" breakdown. If BO1 team-specific data exists, show two leaves
    // for Team A / Team B beneath the First parent. Otherwise fall back to the
    // original single First leaf.
    if (firstBanEntry && firstBanEntry.count > 0) {
      const bo1AEntry = bo1FirstAAll.find(b => b.map_name === map.map_name);
      const bo1BEntry = bo1FirstBAll.find(b => b.map_name === map.map_name);

      // If we have team-specific BO1 first-ban data, create children for them
      const firstChildren: IcicleData[] = [];
      if (bo1AEntry && bo1AEntry.count > 0) {
        firstChildren.push({
          id: ((bo1AEntry.count > 2)?"First A - "+bo1AEntry.count.toString() : "1st A - "+bo1AEntry.count.toString()),
          name: map.map_name,
          total: bannedAll.find(m => m.map_name === map.map_name)?.count || 0,
          MaxTotal: count,
          value: bo1AEntry.count
        });
      }
      if (bo1BEntry && bo1BEntry.count > 0) {
        firstChildren.push({
          id: ((bo1BEntry.count > 2)?"First B - "+bo1BEntry.count.toString() : "1st B - "+bo1BEntry.count.toString()),
          name: map.map_name,
          total: bannedAll.find(m => m.map_name === map.map_name)?.count || 0,
          MaxTotal: count,
          value: bo1BEntry.count
        });
      }

      if (firstChildren.length === 1) {
        // only one team-specific leaf, add directly
        mapNode.children!.push(firstChildren[0]);
      } else if (firstChildren.length > 1) {
        const totalFirst = firstChildren.reduce((s, c) => s + (c.value || 0), 0);
        mapNode.children!.push({
          id: ((totalFirst > 2) ? "First - " + totalFirst.toString() : "1st - " + totalFirst.toString()),
          name: map.map_name,
          total: bannedAll.find(m => m.map_name === map.map_name)?.count || 0,
          MaxTotal: count,
          children: firstChildren
        });
      } else {
        // no team-specific data — fall back to single First leaf using firstBanEntry
        mapNode.children!.push({
          id: ((firstBanEntry.count > 2)?"First - "+firstBanEntry.count.toString() : "1st - "+firstBanEntry.count.toString()),
          name: map.map_name,
          total: bannedAll.find(m => m.map_name === map.map_name)?.count || 0,
          MaxTotal: count,
          value: firstBanEntry.count
        });
      }
    }
    
    
    if (secondBanEntry && secondBanEntry.count > 0) {
      mapNode.children!.push({
        id: ((secondBanEntry.count > 2)?"Second - "+secondBanEntry.count.toString() : "2nd - "+secondBanEntry.count.toString()),
        name: map.map_name,
        total: bannedAll.find(m => m.map_name === map.map_name)?.count || 0,
        MaxTotal: count,
        value: secondBanEntry.count
      });
    }

    if (thirdBanEntry && thirdBanEntry.count > 0) {
      mapNode.children!.push({
        id: (
          type === "picks"
            ? (thirdBanEntry.count > 2
                ? "Left-Over - " + thirdBanEntry.count.toString()
                : "LO - " + thirdBanEntry.count.toString())
            : (thirdBanEntry.count > 2
                ? "Third - " + thirdBanEntry.count.toString()
                : "3rd - " + thirdBanEntry.count.toString())
        ),
        name: map.map_name,
        total: bannedAll.find(m => m.map_name === map.map_name)?.count || 0,
        MaxTotal: count,
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

// format raw map names like 'de_dust2' or 'dust2' to 'Dust 2', 'de_mirage' -> 'Mirage'
const formatMapName = (raw: string) => {
  if (!raw) return '';
  // remove leading de_ if present
  let s = raw.replace(/^de_/, '');
  // replace underscores with space
  s = s.replace(/_/g, ' ');
  // insert a space before trailing digits, e.g. dust2 -> dust 2
  s = s.replace(/([a-zA-Z])([0-9]+)/g, '$1 $2');
  // trim and capitalize each word
  return s
    .trim()
    .split(/\s+/)
    .map((w) => (w.length ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ');
};

const CreateIcicleGraph: React.FC<CreateIcicleGraphProps> = ({
  bannedData,
  firstBanData,
  secondBanData,
  thirdBanData,
  bo1FirstBanTeamAData,
  bo1FirstBanTeamBData,
  resetZoomRef,
  type,
  season,
  activeMaps
}) => {
  const icicleData = transformBanDataForIcicle(
    bannedData,
    firstBanData,
    secondBanData,
    thirdBanData,
    // pass optional BO1 first-ban team arrays through
    // (these props may be undefined if not provided by caller)
    bo1FirstBanTeamAData,
    bo1FirstBanTeamBData,
    type,
    season,
    activeMaps
  );

  // scroll/ wheel zoom state
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number>(1);
  // innerWidth is the pixel width given to the inner container that holds the icicle.
  const [innerWidth, setInnerWidth] = useState<number>(0);

  // initialize inner width to wrapper width on mount and resize
  useEffect(() => {
    const wr = wrapperRef.current;
    if (!wr) return;
    const setInitial = () => {
      const w = wr.clientWidth || 0;
      setInnerWidth((prev) => (prev <= 0 ? w : prev));
      setScale(1);
    };
    setInitial();
    const ro = new ResizeObserver(() => setInitial());
    ro.observe(wr);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (innerRef.current) innerRef.current.style.width = innerWidth ? `${innerWidth}px` : '100%';
  }, [innerWidth]);

  // wheel handler: change inner width (layout-driven zoom) and adjust scroll so
  // the point under the cursor remains under the cursor. This causes the
  // ResponsiveIcicle to recompute its layout for the new width.
  // per-map focus zoom: wheel will zoom the specific root child under the cursor
  const [focusedMapName, setFocusedMapName] = useState<string | null>(null);
  const [focusScale, setFocusScale] = useState<number>(1);
  // path to a focused leaf inside the tree (array of indices from root). Example: [2,0] => 3rd root child, its 1st child
  const [focusedLeafPath, setFocusedLeafPath] = useState<number[] | null>(null);
  const MIN_FOCUS_SCALE = 0.4;
  // increase this value to allow a larger maximum zoom on a focused icicle
  const MAX_FOCUS_SCALE = 12;
  const clampFocusScale = (v: number) => Math.max(MIN_FOCUS_SCALE, Math.min(v, MAX_FOCUS_SCALE));

  // track last mouse position (client coords) so tooltip can follow cursor
  const [lastMouse, setLastMouse] = useState<{ x: number; y: number } | null>(null);

  // Persisted per-top-level-map scales and per-path scales. These keep widths
  // even when the user zooms elsewhere. Keys for pathScales are JSON.stringify(path).
  const [mapScales, setMapScales] = useState<Record<string, number>>({});
  const [pathScales, setPathScales] = useState<Record<string, number>>({});

  // helper: deep-clone icicle and scale leaf values under a target top-level child
  const cloneAndScaleForMap = (root: IcicleData, targetName: string | null, scale: number): IcicleData => {
    if (!root || !root.children) return root;
    const cloneRoot: IcicleData = { ...root, children: root.children.map(c => ({ ...c })) };
    if (!targetName) return cloneRoot;

    for (let i = 0; i < cloneRoot.children!.length; i++) {
      const child = cloneRoot.children![i];
      if (child.name === targetName) {
        // scale all leaf values under this child
        const scaleLeaves = (n: IcicleData): IcicleData => {
          if (typeof n.value === 'number') {
            return { ...n, value: n.value * scale };
          }
          if (!n.children) return { ...n };
          return { ...n, children: n.children.map(ch => scaleLeaves(ch)) };
        };
        cloneRoot.children![i] = scaleLeaves(child);
        break;
      }
    }

    return cloneRoot;
  };

  // clone and scale a specific node identified by path (array of indices)
  const cloneAndScaleForPath = (root: IcicleData, path: number[] | null, scale: number): IcicleData => {
    if (!root || !root.children || !path || path.length === 0) return root;
    const cloneRoot: IcicleData = { ...root, children: root.children.map(c => ({ ...c })) };
    let node: IcicleData | undefined = cloneRoot;
    for (let i = 0; i < path.length; i++) {
      const idx = path[i];
      if (!node.children || idx < 0 || idx >= node.children.length) return cloneRoot;
      if (i === path.length - 1) {
        // scale leaves under this node
        const target = node.children[idx];
        const scaleLeaves = (n: IcicleData): IcicleData => {
          if (typeof n.value === 'number') return { ...n, value: n.value * scale };
          if (!n.children) return { ...n };
          return { ...n, children: n.children.map(ch => scaleLeaves(ch)) };
        };
        node.children[idx] = scaleLeaves(target);
        return cloneRoot;
      }
      node = node.children[idx];
    }
    return cloneRoot;
  };

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handler = (ev: WheelEvent) => {
      ev.preventDefault();
      const rect = el.getBoundingClientRect();
      const mx = ev.clientX - rect.left; // mouse x within wrapper

      // find which top-level child is under mx using proportions from icicleData
      const root = icicleData;
      if (!root || !root.children || root.children.length === 0) return;
      const totalUnits = root.children.reduce((s, c) => s + computeNodeValue(c), 0) || 1;
      // compute pixel width available inside wrapper
      const base = Math.max(rect.width, 1);
      // note: the inner element may be wider due to prior scaling; compute scale
      const currentScale = innerRef.current ? (innerRef.current.clientWidth / base) : 1;

  const factor = Math.pow(1.001, -ev.deltaY);

  // iterate children to find which top-level map the mouse is over
      let cum = 0;
      let topIndex: number | null = null;
      let topWidth = 0;
      for (let i = 0; i < root.children.length; i++) {
        const c = root.children[i];
        const w = (computeNodeValue(c) / totalUnits) * base * currentScale;
        if (mx >= cum && mx <= cum + w) {
          topIndex = i;
          topWidth = w;
          break;
        }
        cum += w;
      }
      if (topIndex === null) return;
      const topNode = root.children[topIndex];

      // now attempt to find a leaf within that top-level node (second-level children)
      let localX = mx - cum; // x relative to the top node area
      const topTotal = topNode.children ? topNode.children.reduce((s, ch) => s + computeNodeValue(ch), 0) : 0;
      if (topNode.children && topNode.children.length > 0 && topTotal > 0) {
        let childCum = 0;
        let leafIndex: number | null = null;
        for (let j = 0; j < topNode.children.length; j++) {
          const ch = topNode.children[j];
          const cw = (computeNodeValue(ch) / topTotal) * topWidth;
          if (localX >= childCum && localX <= childCum + cw) {
            leafIndex = j;
            break;
          }
          childCum += cw;
        }

          if (leafIndex !== null) {
            // found a leaf — persistently scale that path instead of resetting
            const newPath = [topIndex, leafIndex];
            const key = JSON.stringify(newPath);
            setPathScales((prev) => ({ ...prev, [key]: clampFocusScale(((prev[key] as number) || 1) * factor) }));
            setFocusedLeafPath(newPath);
            setFocusedMapName(null);
            return;
          }
      }

      // no leaf found — fall back to focusing the whole map
  const target = topNode;

  // use previously computed `factor` from above
      setFocusedLeafPath(null);
      // persistently update the top-level map scale
      setMapScales((prev) => ({ ...prev, [target.name]: clampFocusScale(((prev[target.name] as number) || 1) * factor) }));
      setFocusedMapName(target.name);
    };

    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [icicleData, innerWidth, focusedMapName, focusedLeafPath]);

  // expose a reset function to parent via optional ref prop
  useEffect(() => {
    if (!resetZoomRef) return;
    resetZoomRef.current = () => {
      setMapScales({});
      setPathScales({});
      setFocusedMapName(null);
      setFocusedLeafPath(null);
      setFocusScale(1);
    };
    return () => {
      if (resetZoomRef) resetZoomRef.current = null;
    };
  }, [resetZoomRef]);

  return (
    <div
      ref={wrapperRef}
      onMouseMove={(e) => setLastMouse({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setLastMouse(null)}
      style={{ height: '150px', width: '100%', overflow: 'auto', touchAction: 'none', position: 'relative' }}
    >
      <div
        ref={innerRef}
        style={{
          width: innerWidth ? `${innerWidth}px` : '100%',
          height: '100%'
        }}
      >
  <ResponsiveIcicle
  data={useMemo(() => {
    let d: IcicleData = icicleData;
    // apply persisted per-top-level map scales
    for (const [name, s] of Object.entries(mapScales)) {
      d = cloneAndScaleForMap(d, name, s);
    }
    // apply persisted per-path scales
    for (const k of Object.keys(pathScales)) {
      try {
        const p = JSON.parse(k) as number[];
        d = cloneAndScaleForPath(d, p, pathScales[k]);
      } catch (e) {
        // ignore malformed keys
      }
    }
    return d;
  }, [icicleData, mapScales, pathScales])}
  colors={(node: any) => whatColor(node.data?.name || '')}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        valueFormat=">-.0f"
        enableLabels={true}
        labelAlign="center"
        labelRotation={0}
        label={(node: any) => node?.id || node?.data?.id || ''}
        borderWidth={0}
        borderRadius={3}
        zoomMode="global"
        motionConfig={{ mass: 1, tension: 401, friction: 50, clamp: false, precision: 0.01, velocity: 0 }}
        
        labelTextColor="#020202ff"
        
        theme={{
          labels: {
            text: {
              //bacarrat method: the closer the number is to 9 the bigger the font size, lower than 9 means higher font size, bigger than 9 means smaller font size
              fontSize: (15),
              fill: '#ffffff',
              fontFamily: 'Play, sans-serif',
              fontWeight: '600',
              filter: 'drop-shadow(0 0 3px #ffffff)',

            }
          },
        }}
        tooltip={(node: any) => {
          if (!node) return null;

          // print the node to browser console for debugging (open devtools)
          try {
            // eslint-disable-next-line no-console
            //console.log('icicle-tooltip node:', node, {
            //  id: node?.id,
            //  data: node?.data,
            //  value: node?.value,
            //  percentage: node?.percentage,
            //  parentId: node?.parent?.id
           // });
          } catch (e) {
            // ignore
          }

          // coordinates on the node (fallback if properties differ across versions)
          const x = (node.x0 ?? node.x ?? 0);
          const y = (node.y0 ?? node.y ?? 0);
          const inner = innerRef.current;
          const wrapper = wrapperRef.current;

          // build the tooltip content (same visual structure as before)
          const buildContent = () => {
            const WHATTYPE = (type === 'bans') ? 'Banned' : 'Picked';
            const WHATTYPEOTHER = (type === 'bans') ? 'Ban' : 'Pick';
            const header = (() => {
              const mapFull = node.data?.name || '';
              const mapDisplay = mapFull ? formatMapName(mapFull) : '';
              const idParts = (node.id || '').split(' - ');
              let labelWithoutCount = idParts[0] || node.id || '';
              const countPart = idParts[1] || (typeof node.value === 'number' ? String(node.data.MaxTotal) : '0');
              if (!mapFull) return `Total ${WHATTYPEOTHER}s - ${countPart}`;
              return `${(((labelWithoutCount.toString().toUpperCase() == mapDisplay.toString().toUpperCase()) || (labelWithoutCount.toString().toUpperCase() == mapDisplay.substring(0,3).toUpperCase())) ? "Total" : labelWithoutCount)} ${WHATTYPE} ${mapDisplay} - ${countPart}`;
            })();

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
                  boxShadow: '0 4px 1px rgba(0,0,0,0.3)',
                  width: '20vw',
                  maxWidth: '20vw',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#fff' }}>{header}</div>
                {node.data?.name ? (
                  <>
                    {(node.data.id.toString().toUpperCase().includes(node.data.name.substring(3).toUpperCase()))
                      ? (
                        null
                      ) : (
                  
                        ((node.data.id.toString().includes("A - ") || node.data.id.toString().includes("B - "))
                          ?
                          ((node.data.id.toString().includes("A - "))
                            ?<>
                              <span style={{ color: '#ccc' }}>This team 1st {WHATTYPE} {node.data?.name} as the 1st {WHATTYPEOTHER} of the match </span>{' '}
                              <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>{parseInt(node.data.id.substring(node.data.id.indexOf("-") + 1))}</span>
                              <span style={{ color: '#ccc' }}> times </span>{' '}
                            </>
                            :<>
                              <span style={{ color: '#ccc' }}>This team 1st {WHATTYPE} {node.data?.name} as the 2nd {WHATTYPEOTHER} of the match </span>{' '}
                              <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>{parseInt(node.data.id.substring(node.data.id.indexOf("-") + 1))}</span>
                              <span style={{ color: '#ccc' }}> times </span>{' '}
                            </>
                          )
                        
                          :null)

                      )
                      }
                      <>
                      
                      {(node.hierarchy.pathComponents.length == 2)
                      ?null
                      :<div>
                            <span style={{ color: '#ccc' }}>Out of every time {node.data?.name} was {(type === 'bans') ? 'Banned' : 'Picked'}, {node.data?.name} was 
                              {
                              
                              
                              (node.data.id.toString().substring(0,node.data.id.toString().indexOf("-")).includes("A") || node.data.id.toString().substring(0,node.data.id.toString().indexOf("-")).includes("B"))
                              ? `${(node.data.id.toString().substring(0,node.data.id.toString().indexOf("-")).includes("A")) ? " the 1st" : " the 2nd"} ${(type === 'bans') ? 'ban' : 'pick'} of the match`
                              : 
                                (node.hierarchy.pathComponents.length <= 2)
                                ? ` ${(type === 'bans') ? 'Banned' : 'Picked'}`
                                :` ${node.data.id.toString().substring(0,node.data.id.toString().indexOf("-"))} ${(type === 'bans') ? 'Banned' : 'Picked'}`
                              } </span>{' '}
                            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>{(((parseInt(node.data.id.substring(node.data.id.indexOf("-") + 1)) / node.data.total) * 100.0).toFixed(2) + '%')}</span>
                            <span style={{ color: '#ccc' }}> of the time</span>
                            <span style={{ color: '#ccc' }}><br/></span>
                          </div>
                        }
                          <div>
                            <span style={{ color: '#ccc' }}>Out of every {(type === 'bans') ? 'Ban' : 'Pick'}, {node.data?.name} was {
                              
                              
                              (node.data.id.toString().substring(0,node.data.id.toString().indexOf("-")).includes("A") || node.data.id.toString().substring(0,node.data.id.toString().indexOf("-")).includes("B"))
                              ? `${(node.data.id.toString().substring(0,node.data.id.toString().indexOf("-")).includes("A")) ? " the 1st" : " the 2nd"} ${(type === 'bans') ? 'ban' : 'pick'} of the match`
                              : (node.hierarchy.pathComponents.length <= 2)
                                ? ` ${(type === 'bans') ? 'Banned' : 'Picked'}`
                                :` ${node.data.id.toString().substring(0,node.data.id.toString().indexOf("-"))} ${(type === 'bans') ? 'Banned' : 'Picked'}`
                              }:</span>{' '}
                            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>{((parseInt(node.data.id.substring(node.data.id.indexOf("-") + 1)) / node.data.MaxTotal) * 100.0).toFixed(2) + '%' }</span>
                            <span style={{ color: '#ccc' }}> of the time</span>
                            <span style={{ color: '#ccc' }}> <br/></span>
                          </div>
          
                        </>
                  </>
                ) : null}
                <div style={{ marginBottom: '2px' }} />
                {node.parent && (
                  <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>of {node.parent.id}</div>
                )}
              </div>
            );
          };

          // if we don't have DOM refs available, fall back to inline tooltip
          if (!inner || !wrapper) return buildContent();

          const innerRect = inner.getBoundingClientRect();
          const absoluteLeft = lastMouse ? lastMouse.x : innerRect.left + x;
          const absoluteTop = lastMouse ? lastMouse.y : innerRect.top + y;

          try {
            return createPortal(
              <div style={{ position: 'absolute', left: `${absoluteLeft}px`, top: `${absoluteTop}px`, zIndex: 9999, transform: 'translate(-50%, -105%)' }}>
                {buildContent()}
              </div>,
              document.body
            );
          } catch (e) {
            return buildContent();
          }
        }}

        />
      </div>
    </div>
  );
};

export default CreateIcicleGraph;
