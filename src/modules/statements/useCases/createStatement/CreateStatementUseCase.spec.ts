import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create a new statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to register a new statement for deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "1233",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: 150,
      description: "deposit of 150",
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should be able to register a new statement for deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "1233",
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: 150,
      description: "deposit of 150",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: "withdraw" as OperationType,
      amount: 50,
      description: "withdraw of 50",
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should not be able to register a new statement for withdraw if amount is lower than balance", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User Test",
        email: "user@test.com",
        password: "1233",
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        type: "withdraw" as OperationType,
        amount: 50,
        description: "withdraw of 50",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
