import 'reflect-metadata';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();

    showProfileService = new ShowProfileService(fakeUserRepository);
  });

  it('should be able show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const profile = await showProfileService.execute(user.id);

    expect(profile.name).toEqual('John Doe');
    expect(profile.email).toEqual('johndoe@example.com');
  });

  it('should not be able show the profile from non-existing user', async () => {
    await expect(
      showProfileService.execute('non-existing-user'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
