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
import {deleteMerchandise, getMerchByOwner, getMerchandises, getSingleMerchandise, postFile, postMerchandise, putMerchandise} from './merchdiseFunction';
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

  // test merchandise upload
  let uploadData1: UploadResponse;
  let merchData1: MerchandiseTest;
  it('should upload a merchandise image', async () => {
    uploadData1 = await postFile(uploadApp, userData.token!);
    merchData1 = {
      merchandise_name: 'Test Merchandise' + randomstring.generate(7),
      price: 15,
      description: 'Test Merchandise Description' + randomstring.generate(7),
      filename: uploadData1.data.filename,
      category: categoryId,
    }
  })

  // test post merchandise data
  let merchID1: string;
  it('should post merchandise data with file', async () => {
    // console.log(merchData1);
    const merchandiseResponse = await postMerchandise(app, {merchandise: merchData1}, userData.token!);
    merchID1 = merchandiseResponse.merchandise.id!;
  });

  // test get all merchandises
  it('should return array of merchandises', async () => {
    await getMerchandises(app);
  });

  // test get single merchandise
  it('should return single merchandise', async () => {
    await getSingleMerchandise(app, merchID1);
  });

  // get merchandises by user id
  it('should return merchandise by current user', async () => {
    await getMerchByOwner(app, userData.token!);
  });

  // modify merch by id
  it('should modify a merchandise', async () => {
    const newMerch: MerchandiseTest = {
      merchandise_name: 'Test Merch' + randomstring.generate(7),
      price: 5,
    };
    const vars: {input: MerchandiseTest; modifyMerchandiseId: string} = {
      input: newMerch,
      modifyMerchandiseId: merchID1,
    };
    await putMerchandise(app, vars, userData.token!);
  });

  // test delete merchandise
  it('should delete a merchandise', async () => {
    await deleteMerchandise(app, merchID1, userData.token!);
  });

  // test delete the category
  it('should delete the category', async () => {
    await deleteCategory(app, categoryId, userData.token!);
  });

  // test delete user based on token
  it('should delete current user', async () => {
    await deleteUser(app, userData.token!);
  });
});
