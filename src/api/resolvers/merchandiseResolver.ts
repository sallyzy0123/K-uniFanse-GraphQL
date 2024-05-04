import {GraphQLError} from 'graphql';
import {Merchandise} from '../../types/DBTypes';
import merchandiseModel from '../models/merchandiseModel';
import {MyContext} from '../../types/MyContext';
// import {io, Socket} from 'socket.io-client';
// import {ClientToServerEvents, ServerToClientEvents} from '../../types/Socket';

// if (!process.env.SOCKET_URL) {
//   throw new Error('SOCKET_URL not defined');
// }

// // socket io client
// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
//   process.env.SOCKET_URL,
// );

export default {
  Query: {
    merchandises: async (): Promise<Merchandise[]> => {
      return await merchandiseModel.find();
    },
    merchandise: async (
      _parent: undefined,
      args: {id: string},
    )=> {
      const merchandise = await merchandiseModel.findById(args.id);
      if (!merchandise) {
        throw new Error('Merchandise not found');
      }
      return merchandise;
    },
    merchandisesByCategory: async () => {},
    merchandisesByOwner: async () => {},
  },
  Mutation: {
    addMerchandise: async (
      _parent: undefined,
      args: {merchandise: Merchandise},
      context: MyContext,
    ): Promise<{message: string; merchandise?: Merchandise}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
      // get owner from context
      args.merchandise = {
        ...args.merchandise,
        owner: context.userdata.user._id,
      }

      const merchandise = await merchandiseModel.create(args.merchandise);
      if (merchandise) {
        return {merchandise, message: 'Merchandise created.'};
      } else {
        return {message: 'Merchandise not created.'}
      }
    },
    modifyMerchandise: async (
      _parent: undefined,
      args: {
        id: string;
        input: Pick<Merchandise, 'merchandise_name' | 'price' | 'description' | 'category'>},
      context: MyContext,
    ) => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }
      const merchandise = await merchandiseModel.findByIdAndUpdate(
        args.id,
        args.input,
        {new: true},
      );
      if (merchandise) {
        return {message: 'Merchandise updated', merchandise};
      } else {
        return {message: 'Merchandise not updated'};
      }
    },
    deleteMerchandise: async () => {},
  },
};
