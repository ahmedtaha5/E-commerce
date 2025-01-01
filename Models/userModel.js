const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name is required'],
      minLength: 3
    },
    slug: {
      type: String,
      lowercase: true
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address'
      ],
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password is must be at least 8 characters']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true, // Ensure no two users have the same phone number
      validate: {
        validator: function(value) {
          // Regex for basic phone number validation (e.g., digits only, 10-15 characters)
          return /^\+?[1-9]\d{1,14}$/.test(value); // E.164 international format
        },
        message: 'Please enter a valid phone number'
      }
    },
    profileImg: String,
    role: {
      type: String,
      enum: ['user', 'manager', 'admin'],
      default: 'user'
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetverified: Boolean,
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
