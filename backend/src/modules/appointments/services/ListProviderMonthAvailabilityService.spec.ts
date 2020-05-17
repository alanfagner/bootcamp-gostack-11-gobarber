import 'reflect-metadata';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

let fakeAppointmentsRespository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRespository = new FakeAppointmentsRepository();

    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRespository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const hourStart = 8;
    await Promise.all(
      Array.from({ length: 10 }, (_, index) => {
        const hour = index + hourStart;
        fakeAppointmentsRespository.create({
          providerID: 'provider',
          userID: 'user',
          date: new Date(2020, 4, 20, hour, 0, 0),
        });
      }),
    );

    await fakeAppointmentsRespository.create({
      providerID: 'provider',
      userID: 'user',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      providerID: 'provider',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
