export type MapCoordinate = readonly [latitude: number, longitude: number];

export type DemoCompetitor = {
  id: string;
  name: string;
  coordinate: MapCoordinate;
  distanceLabel: string;
};

export const demoMarketMap = {
  center: [-6.2268, 106.8528] as MapCoordinate,
  centerLabel: "Tebet, Jakarta Selatan",
  competitors: [
    {
      id: "competitor-01",
      name: "Kopi Janji Manis",
      coordinate: [-6.2255, 106.8538],
      distanceLabel: "180 m",
    },
    {
      id: "competitor-02",
      name: "Cafe Ruang Bersama",
      coordinate: [-6.229, 106.855],
      distanceLabel: "340 m",
    },
    {
      id: "competitor-03",
      name: "Warung Kopi Tebet",
      coordinate: [-6.224, 106.8505],
      distanceLabel: "410 m",
    },
    {
      id: "competitor-04",
      name: "Kedai Sudut",
      coordinate: [-6.2302, 106.852],
      distanceLabel: "520 m",
    },
    {
      id: "competitor-05",
      name: "Kopi Pagi",
      coordinate: [-6.218, 106.86],
      distanceLabel: "1,2 km",
    },
    {
      id: "competitor-06",
      name: "Brew Corner",
      coordinate: [-6.236, 106.861],
      distanceLabel: "1,4 km",
    },
  ] satisfies DemoCompetitor[],
  competitorCountByRadius: {
    1000: 4,
    1500: 6,
    3000: 6,
  } satisfies Record<number, number>,
  source: {
    map: "© OpenStreetMap contributors",
    competitors: "Fixture demo market-map-v1",
    observedAt: "9 Agustus 2026",
    confidence: "Data contoh",
  },
} as const;

export const demoRadiusOptions = [1000, 1500, 3000] as const;

export type DemoRadius = (typeof demoRadiusOptions)[number];

export function isDemoRadius(value: number): value is DemoRadius {
  return demoRadiusOptions.some((option) => option === value);
}
