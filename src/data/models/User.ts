import * as bcrypt from 'bcrypt-nodejs';
import {default as mongoose} from 'mongoose';

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
  comparePassword: (
    candidatePassword: string,
    cb: (err: any, isMatch: any) => void
  ) => void;
};

const userSchema = new mongoose.Schema(
  {
    email: {type: String, unique: true},
    password: String,
  },
  {timestamps: true}
);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(
  candidatePassword: string,
  cb: (err: any, isMatch: any) => {}
) {
  bcrypt.compare(
    candidatePassword,
    this.password,
    (err: mongoose.Error, isMatch: boolean) => {
      cb(err, isMatch);
    }
  );
};

export const User = mongoose.model('User', userSchema);
