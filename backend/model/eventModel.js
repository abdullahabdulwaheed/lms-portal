import { model, Schema } from "mongoose";

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
        },
        location: {
            type: String,
        },
        type: {
            type: String,
            enum: ["Meeting", "Workshop", "Seminar", "Social", "Holiday", "Other", "Training"],
            default: "Other",
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "adminUsersData",
        },
    },
    { timestamps: true }
);

export const eventData = model("events", eventSchema);
