import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateTransferUseCase } from "./CreateTransferUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  //
  TRANSFER = "transfer",
}

class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { sender_id } = request.headers;
    const { amount, description } = request.body;
    const { user_id } = request.params;

    const splittedPath = request.originalUrl.split("/");

    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const createTransfer = container.resolve(CreateTransferUseCase);

    const transfer = await createTransfer.execute({
      user_id,
      type,
      amount,
      description,
      sender_id: String(sender_id),
    });

    return response.status(201).json(transfer);
  }
}

export { CreateTransferController };
