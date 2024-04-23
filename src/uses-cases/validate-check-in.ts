import { CheckIn } from '@prisma/client';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    );
    /* Ao utiilizar o método diff do dayjs, para termos um número positivo, devemos fazer o seguinte:
      no argumento do dayjs, passamos a data atual, que é a data de agora, e no primeiro argumento do método diff, passamos a data que queremos subtrair. Assim teremos um número positivo
    */

    const TWENTY_MINUTES = 20;

    if (distanceInMinutesFromCheckInCreation > TWENTY_MINUTES) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
