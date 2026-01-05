import { model, Schema } from "mongoose";

const teams = new Schema(
  {
    team_name: {
      type: String,
      required: [true, "Team name field is required"],
      unique: [true, "Team name already exists"],
    },
    user_id: {
      type: Number,
      ref: "users",
      required: [true, "User name Field is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const teamsData = model("teamsData", teams);
