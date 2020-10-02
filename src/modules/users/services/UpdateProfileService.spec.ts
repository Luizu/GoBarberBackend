import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile ', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Luizu',
      email: 'luizu@test.com',
      password: 'luizupass',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Luiz',
      email: 'luizu@test2.com',
    });

    expect(updatedUser.name).toBe('Luiz');
    expect(updatedUser.email).toBe('luizu@test2.com');
  });

  it('should be able to change to another user email ', async () => {
    await fakeUsersRepository.create({
      name: 'Luizu',
      email: 'luizu@test.com',
      password: 'luizupass',
    });

    const user = await fakeUsersRepository.create({
      name: 'Luizu2',
      email: 'luizu@testee.com',
      password: 'luizupass',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Luiz',
        email: 'luizu@test.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password ', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Luizu',
      email: 'luizu@test.com',
      password: 'luizupass',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Luiz',
      email: 'luizu@test2.com',
      old_password: 'luizupass',
      password: 'newluizupass',
    });

    expect(updatedUser.password).toBe('newluizupass');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Luizu',
      email: 'luizu@test.com',
      password: 'luizupass',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Luiz',
        email: 'luizu@test2.com',
        password: 'newluizupass',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Luizu',
      email: 'luizu@test.com',
      password: 'luizupass',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Luiz',
        email: 'luizu@test2.com',
        old_password: 'luizunotpass',
        password: 'newluizupass',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
