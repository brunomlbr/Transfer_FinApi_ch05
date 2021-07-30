import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create a new Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new statement", async () => {
    const userTest = await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@test.com",
      password: "user",
    });

    const statementTest = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        user_id: user.id,
        type: "deposit" as OperationType,
        amount: 150,
        description: "deposit of 150",
      });

    // expect(statementTest.statusCode).toBe(201);
    // expect(statementTest.status).toBe(201);
  });
});
