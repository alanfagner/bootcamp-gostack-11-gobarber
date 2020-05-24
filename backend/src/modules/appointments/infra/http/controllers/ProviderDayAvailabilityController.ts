import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { year, month, day } = request.query;

    const { providerID } = request.params;

    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const availability = await listProviderDayAvailability.execute({
      providerID,
      year: Number(year),
      month: Number(month),
      day: Number(day),
    });

    return response.json(availability);
  }
}
