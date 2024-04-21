export class MaxDistanceError extends Error {
  constructor() {
    super(
      'É necessário estar a menos de 100 metros da academia para fazer check-in!',
    );
  }
}
