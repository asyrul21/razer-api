import { Document, Schema, model } from "mongoose";

export type ItemDocument = Document & {
  name: string;
  price: number;
  description?: string;
};

const ItemSchema = new Schema<ItemDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ItemModel = model<ItemDocument>("Item", ItemSchema);
export default ItemModel;
