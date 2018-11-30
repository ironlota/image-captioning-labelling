import * as mongoose from 'mongoose';

export const CaptionEditSchema = new mongoose.Schema({
  text: { type: String },
  caption_id: { type: Number },
});

export const UsersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(v) {
          return /^[a-z0-9_]{5,}[a-zA-Z]+[0-9]*$/.test(v);
        },
        message: props => `${props.value} is not a valid username!`,
      },
      minLength: [6, 'Username is too short'],
      maxLength: [15, 'Username is too long'],
    },
    captionEditCount: {
      type: Number,
      default: 0,
    },
    captionEdit: {
      type: [CaptionEditSchema],
      default: [],
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    verified: { type: Boolean, default: false },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);
