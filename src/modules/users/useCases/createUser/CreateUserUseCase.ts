import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { User } from "@modules/users/entities/User";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { ICreateUserDTO } from "./ICreateUserDTO";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository // eslint-disable-next-line prettier/prettier
  ) { }


  async execute({ name, email, password }: ICreateUserDTO): Promise<User> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new CreateUserError();
    }

    const passwordHash = await hash(password, 8);

    const user = await this.usersRepository.create({
      email,
      name,
      password: passwordHash,
    });

    return user;
  }
}

export { CreateUserUseCase };
