export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('Não é permitido realizar outro check-in hoje!');
  }
}
