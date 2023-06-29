import { GraphQLError } from "graphql";
import card from "../../models/card";

export const getCard = async (
  _: any,
  filter: { _id: string } | { user: string } | { debts: string }
) => {
  try {
    return await card.find(filter).populate("user").populate("debts").lean();
  } catch (error) {
    throw new GraphQLError(error?.message as string);
  }
};

export const mutationCard = async (_, { input }) => {
  const { _id, ...res } = input;
  if (!_id) {
    try {
      return await card.create(res);
    } catch (error) {
      throw new GraphQLError(error?.message as string);
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
