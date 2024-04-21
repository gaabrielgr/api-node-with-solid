export interface Coordinate {
  latitude: number;
  longitude: number;
}
/**
 * @param from a coordenada do ponto de origem do usuário, um objeto com latitude e longitude
 * @param to a coordenada do ponto de destino, um objeto com latitude e longitude
 * @returns distância em quilômetros
 * @description Função que calcula a distância entre duas coordenadas geográficas 
seu retorno é um número que representa a distância em quilômetros
 */
export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0;
  }

  const fromRadian = (Math.PI * from.latitude) / 180;
  const toRadian = (Math.PI * to.latitude) / 180;

  const theta = from.longitude - to.longitude;
  const radTheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(fromRadian) * Math.sin(toRadian) +
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;

  return dist;
}
