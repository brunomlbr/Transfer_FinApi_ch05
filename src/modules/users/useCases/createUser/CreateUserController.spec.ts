import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Create a new User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(`INSERT INTO USERS ( id, name, email, password, created_at, updated_at)
    values ( '${id}', 'admin', 'admin@test.com', '${password}', 'now()', 'now()' ) `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {
    const userTest = await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@test.com",
      password: "user",
    });

    expect(userTest.statusCode).toBe(201);
    expect(userTest.status).toBe(201);
  });

  it("Should not be able to create a new user if email exists", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User test1",
      email: "user@test.com",
      password: "user1",
    });

    const userTest = await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@test.com",
      password: "user",
    });

    expect(userTest.statusCode).toBe(400);
    expect(userTest.status).toBe(400);
  });
});
