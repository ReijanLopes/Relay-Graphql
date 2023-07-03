import { GraphQLError } from "graphql";
import card from "../../models/card";
import type { CardInput } from "../../types";

export const getCard = async (_: any, { _id }: { _id: string }) => {
  try {
    const findCard = await card
      .findById({ _id })
      .populate("user")
      .populate("debts")
      .lean();
    return findCard;
  } catch (error) {
    throw new GraphQLError(error?.message);
  }
};

export const mutationCard = async (_, { input }: { input: CardInput }) => {
  const { _id, ...res } = input;
  if (!_id) {
    try {
      const createCard = await card.create(res);
      return createCard.save();
    } catch (error) {
      throw new GraphQLError(error?.message);
    }
  } else {
    try {
      await card.updateOne({ _id }, res);
    } catch (error) {
      throw new GraphQLError(error?.message);
    }
    return await card.findById({ _id }).lean();
  }
};
