import { v4 as uuidV4 } from "uuid";

import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to show user profile information", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Profile",
      email: "user@profile.com",
      password: "123",
    });
    // console.log(`profile=`, user);
    const profile = await showUserProfileUseCase.execute(user.id);
    expect(user).toEqual(profile);
  });

  it("Should not be able to show a profile of a nonexistent user", async () => {
    expect(async () => {
      const id = uuidV4();
      await showUserProfileUseCase.execute(id);
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
