import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Luizu',
      email: 'luizu@test.com',
      password: 'luizupass',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Luizu');
  });

  it('should not be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'Luizu',
      email: 'luizu@test.com',
      password: 'luizupass',
    });

    await expect(
      createUser.execute({
        name: 'Luizu',
        email: 'luizu@test.com',
        password: 'luizupass',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
