import dotenv from 'dotenv';
dotenv.config();
import app from '../src/app';
import mongoose from 'mongoose';
import {deleteUser, getSingleUser, getUsers, loginUser, postUser, putUser} from './userFunction';
import {getNotFound} from './testFunction';

const uploadApp = process.env.UPLOAD_URL as string;

import randomstring from 'randomstring';
import {CategoryTest, MerchandiseTest, UserTest} from '../src/types/DBTypes';
import {LoginResponse, UploadResponse} from '../src/types/MessageTypes';
import {postFile} from './merchdiseFunction';
import {deleteCategory, postCategory} from './categoryFunction';

describe('test for /graphql', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL!);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // test not found
  it('responds with a not found message', async () => {
    await getNotFound(app);
  });

  let user: UserTest;
  const testUser: UserTest = {
    user_name: 'Test User ' + randomstring.generate(7),
    email: randomstring.generate(7) + '@user.fi',
    password: 'testpassword'
  };
  let userData: LoginResponse;
  let userId: string;

  // test create a new user
  it('should create a new user', async () => {
    const userResponse = await postUser(app, testUser);
    user = userResponse.user;
    userId = user.id!;
    // console.log('userId:', userId)
  })

  // test login
  it('should login user', async () => {
    const vars = {
      credentials: {
        username: testUser.email!,
        password: testUser.password!,
      },
    };
    userData = await loginUser(app, vars);
  });

  // test get all users
  it('should return array of users', async () => {
    await getUsers(app);
  });

  // test get single user
  it('should return single user', async () => {
    await getSingleUser(app, userId);
  });

  // test update user
  it('should update user', async () => {
    await putUser(app, userData.token!);
  });

  const testCategory: CategoryTest = {
    category_name: 'Test Category ' + randomstring.generate(7),
  };
  let categoryId: string;

  // test create category
  it('should create a new category', async () => {
    const category = await postCategory(app, {category: testCategory});
    categoryId = String(category.id!);
    console.log('categoryId:', categoryId);
  });

  // // test merchandise upload
  // let uploadData1: UploadResponse;
  // let merchData1: {input: MerchandiseTest};
  // it('should upload a merchandise with file', async () => {
  //   uploadData1 = await postFile(uploadApp, userData.token!);
  //   merchData1 = {
  //     input: {
  //       merchandise_name: 'Test Cat' + randomstring.generate(7),
  //       price: 15,
  //       description: 'Test Cat Description' + randomstring.generate(7),
  //       filename: uploadData1.data.filename,
  //       category: ,
  //     },
  //   };
  // });



  // test delete the category
  it('should delete the category', async () => {
    await deleteCategory(app, categoryId, userData.token!);
  });

  // test delete user based on token
  it('should delete current user', async () => {
    await deleteUser(app, userData.token!);
  });
});
