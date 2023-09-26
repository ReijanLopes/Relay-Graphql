import { Schema, model } from "mongoose";

const cardSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    number: {
      type: String,
      required: [true, "Card number is required"],
      unique: [true, "Card number must be unique"],
    },
    cpf: {
      type: String,
      required: [true, "CPF is required"],
      index: true,
    },
    expiration: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
    cvv: {
      type: Number,
      required: [true, "Card verification value is required"],
    },
    debts: {
      type: [Schema.Types.ObjectId],
      ref: "Debt",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "Card user is required"],
      ref: "User",
    },
  },
  { timestamps: true }
);

const Card = model("Card", cardSchema);
export default Card;
