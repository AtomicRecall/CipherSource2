'use client';
import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  colorSchemeDarkBlue,
  colorSchemeDarkWarm,
  colorSchemeLightCold,
  colorSchemeLightWarm,
  themeQuartz,
} from "ag-grid-community";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
interface IRow {
  MapName: string;
  WinPercent: string;
  FMS: number;
  TimesPlayed: string;
  TimesWon: string;
  TimesBanned: string;
  TimesTeamA: string;
  TimesTeamB: string;
}

// Create new CreateTable component
const CreateTable = () => {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<IRow[]>([
    { MapName: "Mirage", WinPercent: "90%", FMS: 99.8 , TimesPlayed: "100", TimesWon: "90", TimesBanned: "5", TimesTeamA: "50", TimesTeamB: "50" },
    { MapName: "Ancient", WinPercent: "80%", FMS: 98.5 , TimesPlayed: "80", TimesWon: "64", TimesBanned: "8", TimesTeamA: "40", TimesTeamB: "40"},
    { MapName: "Fart Palace", WinPercent: "70%", FMS: 97.2 , TimesPlayed: "70", TimesWon: "49", TimesBanned: "7", TimesTeamA: "35", TimesTeamB: "35"},
    { MapName: "Jaid's Bedroom", WinPercent: "60%", FMS: 95.9 , TimesPlayed: "60", TimesWon: "36", TimesBanned: "6", TimesTeamA: "30", TimesTeamB: "30"},
    { MapName: "Train", WinPercent: "50%", FMS: 94.6 , TimesPlayed: "50", TimesWon: "25", TimesBanned: "5", TimesTeamA: "25", TimesTeamB: "25"},

  ]);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
    { field: "MapName" },
    { field: "WinPercent" },
    { field: "FMS" },
    { field: "TimesPlayed" },
    { field: "TimesWon" },
    { field: "TimesBanned" },
    { field: "TimesTeamA" },
    { field: "TimesTeamB" },
  ]);

  const defaultColDef: ColDef = {
    flex: 1,
  };

  const myTheme = themeQuartz.withParams({
    backgroundColor: 'cumground',
    foregroundColor: 'white',
    headerTextColor: 'rgba(255, 255, 255, 1)',
    headerBackgroundColor: '#FF6900',
    oddRowBackgroundColor: 'rgba(255, 255, 255, 0.07)',
    headerColumnResizeHandleColor: '#a54500da',
});

  // Container: Defines the grid's theme & dimensions.
  return (
    <div style={{ width: "97%" }} className="mt-5 ml-3">
      <AgGridReact
        theme={myTheme}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        domLayout={"autoHeight"}
      />
    </div>
  );
};

export default CreateTable;