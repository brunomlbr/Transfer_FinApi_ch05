import { v4 as uuidV4 } from "uuid";

import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

import { CreateStatementError } from "../createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get account balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to get statement and balance from an account", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@test.com",
      password: "1233",
    });

    const amount1 = 500;
    const amount2 = 150;
    const amount3 = 250;
    const amount4 = 50;
    const sum = amount1 - amount2 + amount3 - amount4;

    await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: amount1,
      description: `deposit of ${amount1}`,
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: "withdraw" as OperationType,
      amount: amount2,
      description: `withdraw of ${amount2}`,
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: "deposit" as OperationType,
      amount: amount3,
      description: `deposit of ${amount3}`,
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: "withdraw" as OperationType,
      amount: amount4,
      description: `withdraw of ${amount4}`,
    });

    const user_id = user.id as string;

    const userInMemory = await getBalanceUseCase.execute({ user_id });

    expect(sum).toEqual(userInMemory.balance);
  });

  it("Should not be able to get a balance of a nonexistent user id", () => {
    expect(async () => {
      const id = uuidV4();
      const user_id = id as string;

      const userInMemory = await getBalanceUseCase.execute({ user_id });
      console.log(userInMemory);
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("Should not be able to get a balance if funds is insufficient", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User Test",
        email: "user@test.com",
        password: "1233",
      });

      const amount1 = 300;
      const amount2 = 250;
      const amount3 = 50;
      const amount4 = 150;
      const sum = amount1 - amount2 + amount3 - amount4;

      await createStatementUseCase.execute({
        user_id: user.id,
        type: "deposit" as OperationType,
        amount: amount1,
        description: `deposit of ${amount1}`,
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        type: "withdraw" as OperationType,
        amount: amount2,
        description: `withdraw of ${amount2}`,
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        type: "deposit" as OperationType,
        amount: amount3,
        description: `deposit of ${amount3}`,
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        type: "withdraw" as OperationType,
        amount: amount4,
        description: `withdraw of ${amount4}`,
      });

      const user_id = user.id as string;

      const userInMemory = await getBalanceUseCase.execute({ user_id });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
