import type {
  Feature,
  FeatureCollection,
  Geometry,
  MultiPolygon,
  Polygon,
} from "geojson";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import oaxacaGeoJsonRaw from "../../../assets/geo/oaxaca.geojson?raw";

const parsedGeoJson = JSON.parse(oaxacaGeoJsonRaw) as FeatureCollection<
  Polygon | MultiPolygon
>;

const firstFeature = parsedGeoJson.features[0];

if (!firstFeature) {
  throw new Error("No se encontró geometría para Oaxaca en el GeoJSON");
}

const oaxacaFeature = firstFeature as Feature<Polygon | MultiPolygon>;

export const isPointInOaxaca = (lat: number, lng: number): boolean => {
  const turfPoint = point([lng, lat]);
  return booleanPointInPolygon(turfPoint, oaxacaFeature as Feature<Geometry>);
};
