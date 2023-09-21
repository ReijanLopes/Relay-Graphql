import { GraphQLError } from "graphql";
import debt from "../../models/debt";
import userModel from "../../models/user";
import cardModel from "../../models/card";
import { DebtInput } from "../../types";

export const getDebt = async (_: any, { _id }: { _id?: string }) => {
  // Wow, seriously I have never used this and I saw it in a community place. I thought it would not work because it is not used anywhere, but it seriously works
  // What could be a bad import, could be the tracking and arrangement of my folders or a bug that could be temporary
  require("../../models/tax").default;
  try {
    const result = await debt
      .findById({ _id })
      .populate("tax")
      .populate("user")
      .populate("card")
      .lean();
    return result;
  } catch (error) {
    throw new GraphQLError(error?.message);
  }
};

export const mutationDebt = async (_, { input }: { input: DebtInput }) => {
  const { _id, user, card, ...res } = input;
  if (!_id) {
    try {
      const createDebt = await debt.create({
        ...res,
        user,
        card,
      });
      userModel.updateOne({ _id: user }, { $set: { cards: createDebt?._id } });
      cardModel.updateOne({ _id: card }, { $set: { cards: createDebt?._id } });
      return createDebt.save();
    } catch (error) {
      throw new GraphQLError(error?.message);
    }
  } else {
    try {
      await debt.updateOne({ _id }, { ...res, user }, { $push: { card } });
      userModel.updateOne({ _id: user }, { $set: { cards: _id } });
      cardModel.updateOne({ _id: card }, { $set: { cards: _id } });
    } catch (error) {
      throw new GraphQLError(error?.message);
    }
    return await debt.findById({ _id }).lean();
  }
};
