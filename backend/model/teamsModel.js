import { model, Schema } from "mongoose";

const teams = new Schema(
  {
    team_name: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: [{
      type: Schema.Types.ObjectId,
      ref: "usersData", // Note: userModel uses 'usersData' model name? No, export is 'usersData', table allows whatever. 
      // Step 537: export const usersData = model("usersData", users);
      // teamsModel Step 540 used ref: "users". This might be wrong if model name is "usersData".
      // Wait, previous teamsModel said ref: "users". userModel.js exports model("usersData", users).
      // Mongoose refs refer to the model name. So it should probably be "usersData".
      // However, if the seed worked before... maybe it didn't.
      // I will use "usersData".
      required: true,
    }],
  },
  { timestamps: true }
);

export const teamsData = model("teams", teams);
