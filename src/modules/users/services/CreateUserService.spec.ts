import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
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
