import {GraphQLError} from 'graphql';
import {User, UserWithoutPasswordRole} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';
import fetchData from '../../lib/fetchData';

export default {
  Query: {
    users: async (): Promise<UserWithoutPasswordRole[]> => {
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
    ): Promise<UserWithoutPasswordRole> => {
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
      const response = {
        message: 'Token is valid',
        user: context.userdata,
      };
      return response;
    },
  },
  Mutation: {
    register: async (
      _parent: undefined,
      args: {user: Omit<User, 'role'>},
    ): Promise<{user: UserWithoutPasswordRole; message: string}> => {
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
    ): Promise<{user: UserWithoutPasswordRole; message: string; token: string}> => {
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

      const loginResponse = await fetchData<MessageResponse & {token: string; user: UserWithoutPasswordRole}>(
        process.env.AUTH_URL + '/auth/login',
        options,
      );
      loginResponse.user.id = loginResponse.user._id;

      return loginResponse;
    },
  },
};
