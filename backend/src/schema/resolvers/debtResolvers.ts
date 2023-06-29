import { GraphQLError } from "graphql";
import debt from "../../models/debt";

export const getDebt = async (_: any, filter: { _id?: string }) => {
  try {
    return await debt
      .find(filter)
      .populate("user")
      .populate("debts")
      .populate("tax")
      .lean();
  } catch (error) {
    throw new GraphQLError(error?.message);
  }
};
