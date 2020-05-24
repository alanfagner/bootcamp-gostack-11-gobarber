import 'reflect-metadata';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the appointments on a specifc day', async () => {
    const hourStart = 8;
    const appointments = await Promise.all(
      Array.from({ length: 10 }, (_, index) => {
        const hour = index + hourStart;
        return fakeAppointmentsRepository.create({
          providerID: 'provider',
          userID: 'user',
          date: new Date(2020, 4, 20, hour, 0, 0),
        });
      }),
    );

    await fakeAppointmentsRepository.create({
      providerID: 'provider',
      userID: 'user',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderAppointments.execute({
      providerID: 'provider',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual(appointments);
  });
});
