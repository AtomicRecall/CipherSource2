"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Image } from "@heroui/react";
import CalculateStats from "@/components/CalculateStatsForNavBar";

export function getImageForKey(round: string): string | null {
  switch (round) {
    case "de_dust2":
      return "https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/7c17caa9-64a6-4496-8a0b-885e0f038d79_1695819126962.jpeg";
    case "de_inferno":
      return "https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/993380de-bb5b-4aa1-ada9-a0c1741dc475_1695819220797.jpeg";
    case "de_ancient":
      return "https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/5b844241-5b15-45bf-a304-ad6df63b5ce5_1695819190976.jpeg";
    case "de_mirage":
      return "https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/7fb7d725-e44d-4e3c-b557-e1d19b260ab8_1695819144685.jpeg";
    case "de_nuke":
      return "https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/7197a969-81e4-4fef-8764-55f46c7cec6e_1695819158849.jpeg";
    case "de_train":
      return "https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/225a54ad-c66d-46ee-8ae1-2e4159691ee9_1731582334484.png";
    case "de_vertigo":
      return "https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/3bf25224-baee-44c2-bcd4-f1f72d0bbc76_1695819180008.jpeg";
    case "de_anubis":
      return "https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/31f01daf-e531-43cf-b949-c094ebc9b3ea_1695819235255.jpeg";
    case "de_overpass":
      return "https://assets.faceit-cdn.net/third_party/games/ce652bd4-0abb-4c90-9936-1133965ca38b/assets/votables/058c4eb3-dac4-441c-a810-70afa0f3022c_1695819170133.jpeg";
    default:
      return null; // Return null for other maps
  }
}

export default function AddSeasonToMenu(stats: any) {
  console.log("Fart penis ", stats.stats.matchData);
  console.log("OUR TEAM???", stats.SELECT);
  console.log("FUCK BALLS ", stats);
  let isBO3 = stats.stats.matchData.rounds.length > 1 ? true : false;
    const OpenMatchPage =
      (matchID: any) => (event: React.MouseEvent<HTMLParagraphElement>) => {
        event.preventDefault();
        event.stopPropagation();
        window.open("https://www.faceit.com/en/cs2/room/" + matchID+"/scoreboard");
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

  // Hover state and anchor for portal positioning
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [hovered, setHovered] = useState(false);

  function handleMouseEnter() {
    const rect = containerRef.current?.getBoundingClientRect() ?? null;
    setAnchorRect(rect);
    setHovered(true);
  }

  function handleMouseMove() {
    const rect = containerRef.current?.getBoundingClientRect() ?? null;
    setAnchorRect(rect);
  }

  function handleMouseLeave() {
    setHovered(false);
  }

  // Render a picks & bans panel that appears to the right of the hovered match
  function renderPicksBansPanel(stats: any) {
    try {
      const entities =
        stats?.stats?.PicksAndBans?.payload?.tickets?.[2]?.entities ?? [];

      if (!entities || entities.length === 0) return null;

      return (
        <div className="absolute left-full top-0 ml-2 w-56 bg-black/80 text-white p-2 rounded hidden group-hover:flex z-50 flex-col shadow-lg">
          <h3 className="font-bold text-sm mb-2">Picks & Bans</h3>
          {entities
            .filter((e: any) => e.status === "pick" || e.status === "ban")
            .map((e: any, idx: number) => {
              const img = getImageForKey(e.guid) ?? "/images/DEFAULT.jpg";
              return (
                <div className="flex items-center mb-2" key={`pb-${idx}`}>
                  <img
                    src={img}
                    alt={e.guid}
                    className="w-14 h-8 object-cover mr-2 rounded"
                  />
                  <div className="text-xs leading-tight">
                    <div className="font-semibold">{e.status.toUpperCase()}</div>
                    <div className="text-[11px] opacity-90">{e.guid.replace('de_','').toUpperCase()}</div>
                  </div>
                </div>
              );
            })}
        </div>
      );
    } catch (err) {
      console.error("Error rendering picks/bans panel", err);
      return null;
    }
  }
  
  // Renders picks & bans panel into a top-level portal so it's not clipped by parent overflow
  function PicksBansPortal({
    stats,
    anchorRect,
  }: {
    stats: any;
    anchorRect: DOMRect | null;
  }) {
    if (typeof document === "undefined" || !anchorRect) return null;

    const entities =
      stats?.stats?.PicksAndBans?.payload?.tickets?.[2]?.entities ?? [];
    if (!entities || entities.length === 0) return null;

    const initialTop = anchorRect.top + window.scrollY;
    const initialLeft = anchorRect.right + 8 + window.scrollX; // position to right with small gap

    const panelRef = useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = useState({ top: initialTop, left: initialLeft });

    useLayoutEffect(() => {
      if (!panelRef.current || !anchorRect) return;
      const panelRect = panelRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      let newTop = anchorRect.top + scrollY;
      const panelBottom = newTop + panelRect.height;
      const viewportBottom = scrollY + viewportHeight - 8; // 8px padding from bottom

      if (panelBottom > viewportBottom) {
        // Shift up so bottom aligns with viewport bottom (but don't go above top padding)
        newTop = Math.max(scrollY + 8, viewportBottom - panelRect.height);
      }

      // also ensure we don't go above viewport top
      if (newTop < scrollY + 8) newTop = scrollY + 8;

      setPos({ top: newTop, left: initialLeft });
    }, [anchorRect, entities]);

    return createPortal(
      <div
        ref={panelRef}
        data-picks-bans-panel
        className="z-[9999] bg-black/80 text-white p-2 rounded shadow-lg font-play"
        style={{ position: "absolute", top: `${pos.top}px`, left: `${pos.left}px`, width: 260 }}
      >
        <h3 className="font-bold text-sm mb-2">Picks & Bans</h3>
        <div>
          {entities.map((e: any, idx: number) => {
            const img = getImageForKey(e.guid) ?? "/images/DEFAULT.jpg";

            // determine which team selected this (if available)
            const selectedById = e.selected_by ?? e.selectedBy ?? null;
            let selectedName: string | null = null;
            let selectedAvatar: string | null = null;
            try {
              const t1 = stats?.stats?.teamMatchData?.teams?.faction1;
              const t2 = stats?.stats?.teamMatchData?.teams?.faction2;
              if (t1 && selectedById === t1.faction_id) {
                selectedName = t1.name;
                selectedAvatar = t1.avatar;
              } else if (t2 && selectedById === t2.faction_id) {
                selectedName = t2.name;
                selectedAvatar = t2.avatar;
              }
            } catch (err) {
              // ignore
            }

            const status = (e.status || "").toString().toLowerCase();
            const isPick = status.includes("pick");
            const isDrop = status.includes("ban") || status.includes("drop");

            const containerClass = `flex items-center mb-2 p-1 rounded ${isPick ? "bg-[rgba(72,255,0,0.12)]" : isDrop ? "bg-[rgba(255,0,0,0.12)]" : ""}`;
            const statusClass = isPick ? "text-green font-semibold" : isDrop ? "text-red font-semibold" : "font-semibold";

            return (
              <div className={containerClass} key={`pb-${idx}`}>
                <img src={img} alt={e.guid} className="w-16 h-9 object-cover mr-2 rounded" onError={(ev)=>{(ev.currentTarget as HTMLImageElement).src='/images/DEFAULT.jpg'}} />
                <div className="text-xs leading-tight flex-1">
                  <div className="flex justify-between items-center">
                    <div className={statusClass}>{(e.status || "").toUpperCase()}</div>
                    <div className="text-[11px] opacity-90">{(e.guid || "").replace("de_", "").toUpperCase()}</div>
                  </div>
                  {selectedName ? (
                    <div className="flex items-center mt-1">
                      {(() => {
                        const normalizedAvatar = selectedAvatar && selectedAvatar !== "" && selectedAvatar !== "undefined" ? selectedAvatar : "/images/DEFAULT.jpg";
                        return (
                          <img
                            src={normalizedAvatar}
                            onError={(ev) => {(ev.currentTarget as HTMLImageElement).src = "/images/DEFAULT.jpg"}}
                            className="w-5 h-5 rounded-full mr-2"
                          />
                        );
                      })()}
                      <div className="text-[11px] opacity-90">{selectedName}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>,
      document.body,
    );
  }

  // Hide tooltip when scrolling or when pointer definitively leaves anchor and panel
  useEffect(() => {
    if (!hovered) return;

    const onScroll = () => setHovered(false);
    const onWheel = () => setHovered(false);

    const onPointerMove = (e: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX;
      const y = e.clientY;

      const insideAnchor = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      if (insideAnchor) {
        // update anchor rect while moving inside
        setAnchorRect(containerRef.current?.getBoundingClientRect() ?? null);
        return;
      }

      // If pointer is over the portal, keep it open
      const el = document.elementFromPoint(x, y) as HTMLElement | null;
      if (el && el.closest && el.closest('[data-picks-bans-panel]')) {
        return;
      }

      // pointer left both anchor and portal -> hide
      setHovered(false);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [hovered]);

  return (
    <div onClick={OpenMatchPage(stats.stats.teamMatchData.match_id)} key={stats.stats.matchData.seasonNum}>
      {isBO3 ? (
        <div className="relative" ref={containerRef} onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
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

          {hovered && <PicksBansPortal stats={stats} anchorRect={anchorRect} />}
        </div>
      ) : (
        <div className="relative" ref={containerRef} onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
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

          {hovered && <PicksBansPortal stats={stats} anchorRect={anchorRect} />}
        </div>
      )}
    </div>
  );
}
