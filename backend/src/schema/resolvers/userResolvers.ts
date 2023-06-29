import user from "../../models/user";
import card from "../../models/card";
import debt from "../../models/debt";
import { GraphQLError } from "graphql";

export const getUser = async (_: any, filter: { _id?: string }) => {
  try {
    const getUser = await user
      .find(filter)
      .populate("user")
      .populate("debts")
      .lean();

    return getUser;
  } catch (error) {
    throw new GraphQLError(error?.message);
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
      throw new GraphQLError(error?.message);
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
    throw new GraphQLError(error?.message);
  }
};

export const mutationUser = async (_: any, { input }) => {
  const { _id, ...res } = input;
  if (!_id) {
    try {
      const createUser = await user.create(res);
      return createUser.save();
    } catch (error) {
      throw new GraphQLError(error?.message);
    }
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
    const userDeleted = await user.deleteOne({ _id }).lean();

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
