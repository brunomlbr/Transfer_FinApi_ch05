import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Name User",
      email: "email@user.com",
      password: "987654",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a user with email exists", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Name User 1",
        email: "email@user.com",
        password: "123",
      });

      await createUserUseCase.execute({
        name: "Name User 2",
        email: "email@user.com",
        password: "321",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
