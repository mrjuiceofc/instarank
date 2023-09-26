import { BaseError } from '../../errors';
import axios from 'axios';
import { sendEmail } from '../sendEmail';

type ChoseServiceDTO = {
  planName: string;
  amount: number;
  userId: string;
  requestId: string;
};

type SMMService = {
  service: string;
  name: string;
  type: string;
  rate: string;
  min: string;
  max: string;
  dripfeed: boolean;
  refill: boolean;
  cancel: boolean;
  category: string;
};

export async function choseService({
  planName,
  amount,
  userId,
  requestId,
}: ChoseServiceDTO): Promise<SMMService> {
  try {
    const response = await axios.get('https://smmengineer.com/api/v2', {
      params: {
        key: process.env.SMMENGINEER_API_KEY,
        action: 'services',
      },
    });

    let stepWork = 'request';

    const services: SMMService[] = response.data;

    stepWork = 'services';

    if (planName === 'free') {
      stepWork = 'free';
      const freeService = services.find((s) => s.service === '7555');

      if (!freeService) {
        await errorNotFoundService({
          requestId,
          planName,
          userId,
          amount,
          stepWork,
        });
      }

      return freeService;
    }

    stepWork = 'planNameVerify';

    const noRefillServices = services.filter(
      (s) => s.category === 'Instagram | Followers - No Refill'
    );

    if (!noRefillServices.length) {
      await errorNotFoundService({
        requestId,
        planName,
        userId,
        amount,
        stepWork,
      });
    }

    stepWork = 'noRefillServices';

    const minServices = noRefillServices.filter((s) => s.min === '10');

    if (!minServices.length) {
      await errorNotFoundService({
        requestId,
        planName,
        userId,
        amount,
        stepWork,
      });
    }

    stepWork = 'minServices';

    const lowerPrices = minServices.filter((s) => Number(s.rate) <= 0.2);

    if (!lowerPrices.length) {
      await errorNotFoundService({
        requestId,
        planName,
        userId,
        amount,
        stepWork,
      });
    }

    stepWork = 'lowerPrices';

    // const theLowest = lowerPrices.sort((a, b) => {
    //   return Number(a.rate) - Number(b.rate);
    // })[0];
    const theLowest = null;

    if (!theLowest) {
      await errorNotFoundService({
        requestId,
        planName,
        userId,
        amount,
        stepWork,
      });
    }

    stepWork = 'theLowest';

    return theLowest;
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new BaseError({
      errorLocationCode: 'choseService',
      message: 'Houve um erro desconhecido',
      statusCode: 500,
      requestId,
    });
  }
}

async function errorNotFoundService({
  requestId,
  planName,
  userId,
  amount,
  stepWork,
}) {
  await sendEmail({
    requestId,
    subject: 'BUG URGENTE!',
    template: 'NotifyAdminBug',
    to: 'devtheryston@gmail.com',
    variables: {
      message: `Não foi possível encontrar o serviço para um usuário do plano ${planName}.
      <br />
      O id da requisição: ${requestId}. 
      <br />
      O id do usuário: ${userId}. 
      <br />
      A quantidade da tentativa: ${amount}.
      <br />
      funcionou até o step: ${stepWork}.
      `,
    },
  });
  throw new BaseError({
    errorLocationCode: 'choseService:theLowest',
    message: 'Houve um erro ao buscar o serviço, tente novamente mais tarde!',
    statusCode: 500,
    requestId,
  });
}
