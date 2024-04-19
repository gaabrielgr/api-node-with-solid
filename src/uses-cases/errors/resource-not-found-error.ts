export class ResourceNotFoundError extends Error {
  constructor() {
    super('Recursos não encontrados!');
  }
}
