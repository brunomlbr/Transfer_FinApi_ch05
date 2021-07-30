import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Get a profile information", () => {
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

  it("Should be able to show a profile information", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      name: "admin",
      email: "admin@test.com",
      password: "admin",
    });
    // console.log(responseToken.body.token);
    const { token } = responseToken.body;

    const profile = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

    expect(profile.status).toBe(200);
    expect(profile.body).toHaveProperty("id");
    expect(profile.body.email).toEqual("admin@test.com");
  });

  it("Should not be able to show a profile information without a token", async () => {
    const profile = await request(app).get("/api/v1/profile");
    // .set({ Authorization: `Bearer ${token}` });

    expect(profile.statusCode).toBe(401);
    expect(profile.unauthorized).toEqual(true);
  });
});
