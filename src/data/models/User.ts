import * as bcrypt from 'bcryptjs';
import {Document} from 'mongoose';
import {createToken, createPlugin} from 'fusion-core';
import {MongooseToken} from '../mongoose';

export type UserDocument = Document & {
  email: string;
  password: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
};

export const UserModel = createPlugin({
  deps: {mongoose: MongooseToken},
  provides: ({mongoose}) => {
    const userSchema = new mongoose.Schema(
      {
        email: {type: String, unique: true},
        password: String,
      },
      {timestamps: true}
    );

    userSchema.pre('save', function save(next) {
      const user = this as UserDocument;
      if (!user.isModified('password')) {
        return next();
      }
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) {
            return next(err);
          }
          user.password = hash;
          next();
        });
      });
    });
    userSchema.methods.comparePassword = function(candidatePassword: string) {
      return new Promise((resolve, reject) => {
        bcrypt.compare(
          candidatePassword,
          this.password,
          (err, isMatch: boolean) => {
            if (err) {
              reject(err);
            } else {
              resolve(isMatch);
            }
          }
        );
      });
    };

    return mongoose.model('User', userSchema);
  },
});
export const UserModelToken = createToken<
  ReturnType<typeof UserModel.provides>
>('User');
