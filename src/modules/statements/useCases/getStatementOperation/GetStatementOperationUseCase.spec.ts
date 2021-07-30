import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";

import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Statement operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to get a statement for deposit", async () => {
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

    const getStatement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(getStatement.type).toEqual("deposit");
  });

  it("Should be able to get a statement for deposit", async () => {
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
      description: "withdraw of 150",
    });

    const getStatement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(getStatement.type).toEqual("withdraw");
  });
});
