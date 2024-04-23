export class LateCheckInValidationError extends Error {
  constructor() {
    super('Não é possível validar o check-in após 20 minutos da sua criação!');
  }
}
