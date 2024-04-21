import {GraphQLError} from 'graphql';
import {User, UserOutput} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';
import fetchData from '../../lib/fetchData';

export default {
  Query: {
    users: async (): Promise<UserOutput[]> => {
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
    ): Promise<UserOutput> => {
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
  ): Promise<{user: UserOutput} | {message: string}> => {
    // update user itself
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
      console.log('here', args.user, context);
      const userResponse = await fetchData<MessageResponse & {user: User}>(
        process.env.AUTH_URL + '/users/',
        options
      );
      userResponse.user.id = userResponse.user._id;
      return userResponse;
  },
//   deleteUser: async (
//       _parent: undefined,
//       _args: undefined,
//       context: MyContext,
//   ): Promise<UserResponse | {message: string}> => {
//       if (!context.userdata) {
//           throw new GraphQLError('User not authenticated', {
//             extensions: {
//               code: 'UNAUTHENTICATED',
//             },
//           });
//       }
//       const user = await userModel.findByIdAndDelete(context.userdata.user._id);
//       if (!user) {
//           return {message: 'User not deleted'};
//       }
//       return {message: 'User deleted', user};
//   },
//   updateUserAsAdmin: async (
//       _parent: undefined,
//       args: {user: UserInput, id: string},
//       context: MyContext,
//   ): Promise<UserResponse | {message: string}> => {
//       if (!context.userdata || context.userdata.user.role !== 'admin') {
//           throw new GraphQLError('User not authorized', {
//             extensions: {
//               code: 'UNAUTHORIZED',
//             },
//           });
//       }
//       const user = await userModel.findByIdAndUpdate(
//           args.id,
//           args.user,
//           {
//               new: true,
//           }
//       );
//       if (user) {
//           return {message: 'User updated by admin', user};
//       } else {
//           return {message: 'User not updated by admin'};
//       }
//   },
//   deleteUserAsAdmin: async (
//       _parent: undefined,
//       args: {id: string},
//       context: MyContext,
//   ): Promise<UserResponse | {message: string}> => {
//       console.log('context', context.userdata);
//       if (!context.userdata || context.userdata.user.role !== 'admin') {
//           throw new GraphQLError('User not authorized', {
//             extensions: {
//               code: 'UNAUTHORIZED',
//             },
//           });
//       }
//       const user = await userModel.findByIdAndDelete(args.id);
//       if (user) {
//           return {message: 'User deleted by admin', user};
//       } else {
//           return {message: 'User not deleted by admin'};
//       }
//   },
// },
  },
};
