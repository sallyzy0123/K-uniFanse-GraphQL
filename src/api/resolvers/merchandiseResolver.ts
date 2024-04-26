import {GraphQLError} from 'graphql';
import {Merchandise} from '../../types/DBTypes';
import merchandiseModel from '../models/merchandiseModel';
import {MyContext} from '../../types/MyContext';

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
        throw new Error('Category not found');
      }
      return merchandise;
    },
    merchandisesByCategory: async () => {},
    merchandisesByOwner: async () => {},
    merchandisesByArea: async () => {},
  },
  Mutation: {
    addMerchandise: async (
      _parent: undefined,
      args: {merchandise: Merchandise},
      context: MyContext,
    ): Promise<{message: string; merchandise?: Merchandise}> => {
      console.log('here1', context.userdata);
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
      console.log('here', args.merchandise);

      const merchandise = await merchandiseModel.create(args.merchandise);
      if (merchandise) {
        return {merchandise, message: 'Merchandise created.'};
      } else {
        return {message: 'Merchandise not created.'}
      }
    },
    modifyMerchandise: async () => {},
    deleteMerchandise: async () => {},
  },
};
