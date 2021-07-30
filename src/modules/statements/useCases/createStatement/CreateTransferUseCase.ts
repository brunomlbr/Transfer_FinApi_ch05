import { inject, injectable } from "tsyringe";

import { Statement } from "@modules/statements/entities/Statement";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository // eslint-disable-next-line prettier/prettier
  ) { }

  //
  async execute({
    user_id,
    type,
    amount,
    description,
    sender_id,
  }: ICreateTransferDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(user_id);
    // const user = "";
    if (!user) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    await this.statementsRepository.create({
      user_id: sender_id, // Remetente
      type, // Saída de transferência
      amount,
      description,
      sender_id: null,
    });

    const transferOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
      sender_id,
    });

    return transferOperation;
    // return null;
  }
}

export { CreateTransferUseCase };
