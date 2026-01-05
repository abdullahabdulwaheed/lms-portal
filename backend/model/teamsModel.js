import { model, Schema } from "mongoose";

const teams = new Schema(
  {
    team_name: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

export const teamsData = model("teams", teams);
