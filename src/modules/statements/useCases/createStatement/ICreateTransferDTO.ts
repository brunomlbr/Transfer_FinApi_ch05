import { Statement } from "../../entities/Statement";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  //
  TRANSFER = "transfer",
}

interface ICreateTransferDTO {
  user_id: string;
  type: OperationType;
  amount: number;
  description: string;
  sender_id: string;
}

export { ICreateTransferDTO };
