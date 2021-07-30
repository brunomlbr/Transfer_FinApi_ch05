import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Authenticate a user and create a token JWT", () => {
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

  it("Should be able do authenticate a user and create a token JWT", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@supertest.com",
      password: "supertest",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@supertest.com",
      password: "supertest",
    });

    expect(responseToken.body).toHaveProperty("token");
  });

  it("Should not be able to authenticate a nonexistent email", async () => {
    const responseError = await request(app).post("/api/v1/sessions").send({
      email: "user1@supertest.com",
      password: "supertest",
    });

    expect(responseError.statusCode).toBe(401);
  });

  it("Should not be able to authenticate a nonexistent password", async () => {
    const responseError = await request(app).post("/api/v1/sessions").send({
      email: "user@supertest.com",
      password: "supertest1",
    });

    expect(responseError.statusCode).toBe(401);
  });
});
