import {Application} from "express";
import {User, UserTest} from "../src/types/DBTypes";
import {LoginResponse, UserResponse} from "../src/types/MessageTypes";
import request from 'supertest';
import randomstring from 'randomstring';

const  postUser = (
  url: string | Application,
  user: UserTest,
): Promise<UserResponse> => {
  return new Promise((resolve, reject) => {
      request(url)
          .post('/graphql')
          .set('Content-Type', 'application/json')
          .send({
            query: `mutation Register($user: UserInput!) {
              register(user: $user) {
                user {
                  id
                  user_name
                  email
                }
                message
              }
            }`,
            variables: {
              user: {
                user_name: user.user_name,
                email: user.email,
                password: user.password,
              },
            },
          })
          .expect(200, (err, response) => {
            if (err) {
            reject(err);
          } else {
            const userData: UserResponse = response.body.data.register;
            expect(userData.message).toBe('User added');
            expect(userData).toHaveProperty('user');
            expect(userData.user).toHaveProperty('id');
            expect(userData.user.user_name).toBe(user.user_name);
            expect(userData.user.email).toBe(user.email);
            resolve(response.body.data.register);
          }
    });
  })
};

const getUsers = (url: string | Application): Promise<User[]> => {
  return new Promise((resolve, reject) => {
      request(url)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send({
        query: '{users{id user_name email}}',
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users: User[] = response.body.data.users;
          expect(users).toBeInstanceOf(Array);
          expect(users[0]).toHaveProperty('id');
          expect(users[0]).toHaveProperty('email');
          expect(users[0]).toHaveProperty('user_name');
          resolve(response.body.data.users);
        }
      }
    )
  })
};

const getSingleUser = (
  url: string | Application,
  id: string,
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query User($userId: ID!) {
          user(id: $userId) {
            id
            user_name
            email
          }
        }`,
        variables: {
          userId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = response.body.data.user;
          expect(user.id).toBe(id);
          expect(user).toHaveProperty('user_name');
          expect(user).toHaveProperty('email');
          resolve(response.body.data.user);
        }
      });
  });
};

const loginUser = (
  url: string | Application,
  vars: {credentials: {username: string; password: string}},
): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Login($credentials: Credentials!) {
          login(credentials: $credentials) {
            token
            user {
              id
              user_name
              email
            }
            message
          }
        }`,
        variables: vars,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const user = vars.credentials;
          console.log('login response', response.body);
          const userData = response.body.data.login;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('token');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.email).toBe(user.username);
          resolve(response.body.data.login);
        }
      });
  });
};

const putUser = (url: string | Application, token: string) => {
  return new Promise((resolve, reject) => {
    const newValue = 'Test Loser ' + randomstring.generate(7);
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation UpdateUser($user: UserModifyInput!) {
          updateUser(user: $user) {
            user {
              id
              user_name
              email
            }
            message
          }
        }`,
        variables: {
          user: {
            user_name: newValue,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.updateUser;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          expect(userData.user).toHaveProperty('id');
          expect(userData.user.user_name).toBe(newValue);
          resolve(response.body.data.updateUser);
        }
      });
  });
};

const deleteUser = (
  url: string | Application,
  token: string,
): Promise<UserResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteUser {
          deleteUser {
            user {
              id
              user_name
              email
            }
            message
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const userData = response.body.data.deleteUser;
          expect(userData).toHaveProperty('message');
          expect(userData).toHaveProperty('user');
          resolve(userData);
        }
      });
  });
};


export {getUsers, postUser, getSingleUser, loginUser, putUser, deleteUser};
