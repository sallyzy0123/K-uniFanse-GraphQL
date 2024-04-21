require('dotenv').config();
import express, {Request, Response} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {notFound, errorHandler, authenticate} from './middlewares';
import {MessageResponse} from './types/MessageTypes';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import typeDefs from './api/schemas/index';
import resolvers from './api/resolvers/index';
import {MyContext} from './types/MyContext';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {
  constraintDirectiveTypeDefs,
  createApollo4QueryValidationPlugin,
} from 'graphql-constraint-directive/apollo4';
import { createRateLimitRule } from 'graphql-rate-limit';
import {applyMiddleware} from 'graphql-middleware';
import {shield} from 'graphql-shield';

const app = express();

(async () => {
  try {
    app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: false,
      }),
    );

    const rateLimitRule = createRateLimitRule({
      identifyContext: (ctx) => {
        // console.log(ctx);
        return ctx.userdata?._id ? ctx.userdate.id : ctx.id;
      },
    });

    const permissions = shield({
      Mutation: {
        login: rateLimitRule({window: '10s', max: 5}),
        addAnimal: rateLimitRule({window: '10s', max: 1}),
      }
    })

    app.get('/', (_req: Request, res: Response<MessageResponse>) => {
      res.send({message: 'Server is running'});
    });

    const executableSchema = makeExecutableSchema({
      typeDefs: [constraintDirectiveTypeDefs, typeDefs],
      resolvers,
    });

    const schema = applyMiddleware(executableSchema, permissions);

    const plugins = [createApollo4QueryValidationPlugin()];

    const server = new ApolloServer<MyContext>({
      schema,
      plugins,
    });

    await server.start();

    app.use(
      '/graphql',
      cors(),
      express.json(),
      authenticate,
      expressMiddleware(server, {
        context: ({res}) => res.locals.user,
      }),
    );

    app.use(notFound);
    app.use(errorHandler);
  } catch (error) {
    console.error((error as Error).message);
  }
})();

export default app;
