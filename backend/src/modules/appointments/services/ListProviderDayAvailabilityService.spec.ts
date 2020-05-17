import 'reflect-metadata';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

let fakeAppointmentsRespository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListPrroviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRepository();

    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRespository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentsRespository.create({
      providerID: 'provider',
      userID: 'user',
      date: new Date(2020, 4, 21, 14, 0, 0),
    });

    await fakeAppointmentsRespository.create({
      providerID: 'provider',
      userID: 'user',
      date: new Date(2020, 4, 21, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 21, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      providerID: 'provider',
      year: 2020,
      month: 5,
      day: 21,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ]),
    );
  });
});
