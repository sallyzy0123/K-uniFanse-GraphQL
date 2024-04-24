import {Point} from 'geojson';
import mongoose, {Document} from 'mongoose';

type Category = {
  _id: mongoose.Types.ObjectId;
  category_name: string;
};

type Merchandise = Partial<Document> & {
  merchandise_name: string;
  category: mongoose.Types.ObjectId;
  filename: string;
  location: Point;
  price: number;
  description: string;
  owner: mongoose.Types.ObjectId;
}

// type Species = Partial<Document> & {
//   species_name: string;
//   category: mongoose.Types.ObjectId;
//   image: string;
//   location: Point;
// };

// type Animal = Partial<Document> & {
//   animal_name: string;
//   species: mongoose.Types.ObjectId;
//   birthdate: Date;
//   gender: 'male' | 'female';
//   owner: mongoose.Types.ObjectId;
//   image: string;
//   location: Point;
// };

type User = Partial<Document> & {
  id: mongoose.Types.ObjectId;
  user_name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};
type UserOutput = Omit<User, 'password' | 'role'>;

type UserInput = Omit<User, 'id' | 'role'>;

type UserTest = Partial<User>;

type LoginUser = Omit<User, 'password'>;

// type UserWithoutPassword = Omit<User, 'password'>;

// type UserWithoutPasswordRole = Omit<UserWithoutPassword, 'role'>;

type TokenContent = {
  token: string;
  user: LoginUser;
};

export {
  Category,
  Merchandise,
  // Animal,
  User,
  UserOutput,
  UserInput,
  UserTest,
  LoginUser,
  // UserWithoutPassword,
  // UserWithoutPasswordRole,
  TokenContent,
};
