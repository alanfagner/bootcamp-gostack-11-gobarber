import 'reflect-metadata';
import { addDays, subDays, setHours } from 'date-fns';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: setHours(addDays(new Date(), 2), 8),
      userID: 'user',
      providerID: 'provider',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.providerID).toBe('provider');
  });

  it('should not be able to create a two appointment on the same time', async () => {
    const appointmentDate = setHours(addDays(new Date(), 2), 8);

    await createAppointment.execute({
      date: appointmentDate,
      userID: 'user',
      providerID: 'provider',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        userID: 'user',
        providerID: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    await expect(
      createAppointment.execute({
        date: setHours(subDays(new Date(), 2), 8),
        userID: 'user',
        providerID: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a appointment with same user as provider', async () => {
    await expect(
      createAppointment.execute({
        date: setHours(addDays(new Date(), 2), 8),
        userID: 'user',
        providerID: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a appointment before 8am and after 5pm', async () => {
    await expect(
      createAppointment.execute({
        date: setHours(addDays(new Date(), 2), 7),
        userID: 'user',
        providerID: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: setHours(addDays(new Date(), 2), 18),
        userID: 'user',
        providerID: 'provider',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
