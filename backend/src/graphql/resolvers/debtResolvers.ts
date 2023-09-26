import { GraphQLError } from "graphql";
import debt from "../../models/debt";
import taxModel from "../../models/tax";
import userModel from "../../models/user";
import cardModel from "../../models/card";
import { DebtInput } from "../../types";

export const getDebt = async (_: any, { _id }: { _id?: string }) => {
  try {
    const result = await debt
      .findById({ _id })
      .populate("user")
      .populate("card")
      .lean();

    const { tax, ...res } = result;
    const resultTax = await taxModel.findById({ _id: tax }).lean();

    return { ...res, tax: resultTax };
  } catch (error) {
    throw new GraphQLError(error?.message);
  }
};

export const createAndUpdateDebt = async (
  _,
  { input }: { input: DebtInput }
) => {
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
    const resultDebt = await debt.findById({ _id }).lean();
    return resultDebt;
  }
};
