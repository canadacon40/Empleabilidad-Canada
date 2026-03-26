import React from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

// A topojson file specifically for Canada provinces
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/canada/canada-provinces.json"

interface ProvinceDemand {
  provincia: string
  codigo: string // ON, BC, AB, QC, NS, NB, MB, PE, SK, NL, NT, YT, NU
  demanda: "Baja/Incierta" | "Media" | "Buena" | "Muy Buena"
  nota: string
}

interface CanadaMapProps {
  demanda: ProvinceDemand[]
}

const colorMap: Record<string, string> = {
  "Baja/Incierta": "#e2e8f0", // Default (Slate 200)
  "Media": "#e2e8f0",         // Default
  "Buena": "#22c55e",         // Green
  "Muy Buena": "#3b82f6",     // Blue
  "Default": "#e2e8f0"        // Slate 200
}

export default function CanadaMap({ demanda }: CanadaMapProps) {
  // Map of TopoJSON IDs or names to our standard 2-letter codes.
  // The exact property depends on the TopoJSON, usually it's "NAME_1" or "name".
  // We'll map the known province names to our codes.
  const nameToCode: Record<string, string> = {
    "Ontario": "ON",
    "British Columbia": "BC",
    "Alberta": "AB",
    "Quebec": "QC",
    "Québec": "QC",
    "Nova Scotia": "NS",
    "New Brunswick": "NB",
    "Manitoba": "MB",
    "Prince Edward Island": "PE",
    "Saskatchewan": "SK",
    "Newfoundland and Labrador": "NL",
    "Northwest Territories": "NT",
    "Yukon": "YT",
    "Nunavut": "NU",
  }

  return (
    <div className="w-full h-auto bg-muted/10 rounded-2xl border border-border p-4 relative">
      <ComposableMap 
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [100, -45, 0],
          center: [5, 20],
          scale: 400
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
              const provName = geo.properties.NAME_1 || geo.properties.name || ""
              const provCode = nameToCode[provName] || ""
              
              // Find demand for this province
              const provData = demanda.find(d => d.codigo === provCode)
              const fillColor = provData ? colorMap[provData.demanda] || colorMap.Default : colorMap.Default

              return (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo}
                  fill={fillColor}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#94a3b8", outline: "none", cursor: "pointer" },
                    pressed: { outline: "none" },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ef4444]" /> Baja/Incierta</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#facc15]" /> Media</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#22c55e]" /> Buena</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#3b82f6]" /> Muy Buena</div>
      </div>
    </div>
  )
}
