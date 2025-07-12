import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullname: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: [validator.isEmail, "Email format is not valid"],
    },
    dob: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Date of birth cannot be in the future.",
      },
    },
    phoneNo: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    age: { type: Number, default: 0 },

    password: {
      type: String,
      required: [true, "Password must required"],
    },

    location: { type: String },
    availability: { type: String },

    profileVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    profilePhoto: { type: String },

    skillsOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    skillsWanted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const today = new Date();
  this.age = today.getFullYear() - this.dob.getFullYear();
  if (
    today.getMonth() < this.dob.getMonth() ||
    (today.getMonth() === this.dob.getMonth() &&
      today.getDate() < this.dob.getDate())
  ) {
    this.age--;
  }

  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async (password, enteredPassword) => {
  if (!password) {
    throw new Error("Password field is missing");
  }
  return await bcrypt.compare(password, enteredPassword);
};

userSchema.methods.generateAccessToken = (database) => {
  return jwt.sign(
    {
      _id: database._id,
      username: database.username,
      email: database.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = (database) => {
  return jwt.sign(
    {
      _id: database._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
