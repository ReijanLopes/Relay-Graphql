import { Schema, model } from "mongoose";

const debtSchema = new Schema(
  {
    value: { type: Number, required: [true, "Value is required"] },
    cashback: { type: Number, default: 0 },
    numberOfInstallments: { type: Number, default: 1 },
    totalValue: {
      type: { type: Number },
    },
    installments: {
      type: [
        {
          status: { type: String, default: "OnTime" },
          idMonth: { type: Number, required: [true, "What portion is needed"] },
          value: {
            type: Number,
            required: [true, "Installment amount is required"],
          },
          expires: { type: String, required: true },
        },
      ],
    },
    tax: {
      type: Schema.Types.ObjectId,
      ref: "Tax",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    card: {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
  },
  { timestamps: true }
);

export default model("Debt", debtSchema);
