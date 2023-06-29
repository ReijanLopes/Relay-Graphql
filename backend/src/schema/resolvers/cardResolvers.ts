import { GraphQLError } from "graphql";
import card from "../../models/card";

export const getCard = async (
  _: any,
  filter: { _id: string } | { user: string } | { debts: string }
) => {
  try {
    return await card.find(filter).populate("user").populate("debts").lean();
  } catch (error) {
    throw new GraphQLError(error?.message);
  }
};

export const mutationCard = async (_, { input }) => {
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
