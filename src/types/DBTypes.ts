import mongoose, {Document} from 'mongoose';

type Category = {
  id: mongoose.Types.ObjectId;
  category_name: string;
};

type Merchandise = Partial<Document> & {
  merchandise_name: string;
  category: mongoose.Types.ObjectId;
  filename: string;
  price: number;
  description: string;
  owner: mongoose.Types.ObjectId;
}

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

type MerchandiseTest = Partial<Merchandise>;

type CategoryTest = Partial<Category>;

type LoginUser = Omit<User, 'password'>;

type TokenContent = {
  token: string;
  user: LoginUser;
};

export {
  Category,
  Merchandise,
  User,
  UserOutput,
  UserInput,
  UserTest,
  MerchandiseTest,
  CategoryTest,
  LoginUser,
  TokenContent,
};
