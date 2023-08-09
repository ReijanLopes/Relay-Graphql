import user from "../../models/user";
import cardModel from "../../models/card";
import debtModel from "../../models/debt";

import { GraphQLError } from "graphql";

import type { UserInput } from "../../types";

export const getUser = async (_, { _id }: { _id?: string }) => {
  try {
    const getUser = await user
      .findById({ _id })
      .populate("cards")
      .populate("debts")
      .lean();
    return getUser;
  } catch (error) {
    throw new GraphQLError(error?.message);
  }
};

export const listUser = async (
  _: any,
  filter: { cards: string } | { debts: string }
) => {
  const key = Object.keys(filter)?.[0];

  if (!key) {
    try {
      const listUser = await user
        .find()
        .populate("cards")
        .populate("debts")
        .lean();

      return listUser;
    } catch (error) {
      throw new GraphQLError(error?.message);
    }
  }

  try {
    const users = await user
      .find({ [key]: { $in: filter?.[key] } })
      .populate("cards")
      .populate("debts")
      .lean();
    return users;
  } catch (error) {
    throw new GraphQLError(error?.message);
  }
};

export const mutationUser = async (_: any, { input }: { input: UserInput }) => {
  const { _id, cashDesk, cards, debts, ...res } = input;
  if (!_id) {
    try {
      const createUser = await user.create({ ...res, cards, debts });
      await cardModel.updateOne({ _id: cards }, { user: createUser?._id });
      await debtModel.updateOne({ _id: debts }, { user: createUser?._id });
      return createUser.save();
    } catch (error) {
      throw new GraphQLError(error?.message);
    }
  } else {
    try {
      await user.updateOne(
        { _id },
        { $inc: { cashDesk: cashDesk }, ...res, cards, debts }
      );
      await cardModel.updateOne({ _id: cards }, { user: _id });
      await debtModel.updateOne({ _id: debts }, { user: _id });
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
      await cardModel.deleteMany({ user: _id });
      await debtModel.deleteMany({ user: _id });
      return { message: true };
    } else {
      return { message: false };
    }
  } catch (error) {
    throw new GraphQLError(error?.message);
  }
};
