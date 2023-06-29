import user from "../../models/user";
import card from "../../models/card";
import debt from "../../models/debt";
import { GraphQLError } from "graphql";

export const getUser = async (_: any, filter: { _id?: string }) => {
  try {
    return await user.find(filter).populate("user").populate("debts").lean();
  } catch (error) {
    throw new GraphQLError(error?.message as string);
  }
};

export const listUser = async (
  _: any,
  filter: { card: string } | { debt: string }
) => {
  const key = Object.keys(filter)?.[0];

  if (!key) {
    try {
      return await user.find().populate("user").populate("debts").lean();
    } catch (error) {
      throw new GraphQLError(error?.message as string);
    }
  }

  try {
    const users = await user
      .find({ [key]: { $in: filter?.[key] } })
      .populate("user")
      .populate("debts")
      .lean();

    return users;
  } catch (error) {
    throw new GraphQLError(error?.message as string);
  }
};

export const mutationUser = async (_: any, { input }) => {
  const { _id, ...res } = input;
  if (!_id) {
    await user.create(res);
  } else {
    try {
      await user.updateOne({ _id }, res);
    } catch (error) {
      throw new GraphQLError(error?.message);
    }
    return await user.findById({ _id }).lean();
  }
};

export const deleteUser = async (_: any, { _id }: { _id: string }) => {
  try {
    const userDeleted = await user.deleteOne({ _id });

    if (userDeleted?.deletedCount === 1) {
      await card.deleteMany({ user: _id });
      await debt.deleteMany({ user: _id });
      return true;
    } else {
      throw new GraphQLError("Failed to delete user");
    }
  } catch (error) {
    throw new GraphQLError(error?.message);
  }
};
