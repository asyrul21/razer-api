import { Document, Schema, model } from "mongoose";
import { UserDocument } from "./User.model";

export type SampleDocument = Document & {
  name: string;
  description?: string;
  user?: UserDocument;
  // categories?: CategoryDocument[];
};

const SampleSchema = new Schema<SampleDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // categories: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Category",
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

const SampleModel = model<SampleDocument>("Sample", SampleSchema);
export default SampleModel;
