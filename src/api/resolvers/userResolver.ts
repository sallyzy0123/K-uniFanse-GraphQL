import {GraphQLError} from 'graphql';
import {Merchandise, User, UserOutput} from '../../types/DBTypes';
import {LoginResponse, MessageResponse} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';
import fetchData from '../../lib/fetchData';
import {UserResponse} from '../../types/MessageTypes';
import merchandiseModel from '../models/merchandiseModel';

export default {
  Merchandise: {
    owner: async (parent: Merchandise): Promise<User> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const user = await fetchData<User>(
        process.env.AUTH_URL + '/users/' + parent.owner,
      );
      user.id = user._id;
      return user;
    },
  },
  Query: {
    users: async (): Promise<User[]> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const users = await fetchData<User[]>(process.env.AUTH_URL + '/users');
      users.forEach((user) => {
        user.id = user._id;
      });
      return users;
    },
    user: async (
      _parent: undefined, args: {id: string}
    ): Promise<User> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const user = await fetchData<User>(
        process.env.AUTH_URL + '/users/' + args.id,
      );
      user.id = user._id;
      return user;
    },
    checkToken: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ) => {
      if (context.userdata) {
        context.userdata.user.id = context.userdata?.user._id;
      }

      const response = {
        message: 'Token is valid',
        token: context.userdata?.token,
        user: context.userdata?.user,
      };
      return response;
    },
  },
  Mutation: {
    register: async (
      _parent: undefined,
      args: {user: Omit<User, 'role'>},
    ): Promise<{user: UserOutput; message: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.user),
      };

      const registerResponse = await fetchData<MessageResponse & {data: User}>(
        process.env.AUTH_URL + '/users',
        options,
      );

      return {user: registerResponse.data, message: registerResponse.message};
    },
    login: async (
      _parent: undefined,
      args: {credentials: {username: string; password: string}},
    ): Promise<{user: UserOutput; message: string; token: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.credentials),
      };

      const loginResponse = await fetchData<MessageResponse & {token: string; user: UserOutput}>(
        process.env.AUTH_URL + '/auth/login',
        options,
      );
      loginResponse.user.id = loginResponse.user._id;

      return loginResponse;
    },
    updateUser: async (
      _parent: undefined,
      args: {user: Omit<User, 'role'>},
      context: MyContext,
  ): Promise<UserResponse> => {
      if (!context.userdata) {
          throw new GraphQLError('User not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          });
      }
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.userdata.token,
        },
        body: JSON.stringify(args.user),
      };
      const userResponse = await fetchData<UserResponse>(
        process.env.AUTH_URL + '/users/',
        options
      );
      userResponse.user.id = userResponse.user._id;
      return userResponse;
    },
    deleteUser: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
  ) => {
      if (!context.userdata) {
          throw new GraphQLError('User not authenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
            },
          });
      }

      // delete the merchandise of the user
      const merchandiseFilter = { owner: context.userdata.user._id};
      await merchandiseModel.deleteMany(merchandiseFilter);

      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + context.userdata.token,
        },
      };

      const userResponse = await fetchData<UserResponse>(
        process.env.AUTH_URL + '/users',
        options,
      );
      userResponse.user.id = userResponse.user._id;
      return userResponse;
    },
  },
};
