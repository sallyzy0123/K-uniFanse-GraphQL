require('dotenv').config();
import express, {Request, Response} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {notFound, errorHandler} from './middlewares';
import {MessageResponse} from './types/MessageTypes';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import typeDefs from './api/schemas/index';
import resolvers from './api/resolvers/index';
import {MyContext} from './types/MyContext';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { createRateLimitRule } from 'graphql-rate-limit';
import {applyMiddleware} from 'graphql-middleware';
import {shield} from 'graphql-shield';
import authenticate from './lib/authenticate';
import {constraintDirectiveTypeDefs} from 'graphql-constraint-directive';

const app = express();

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }),
);

(async () => {
  try {
    const rateLimitRule = createRateLimitRule({
      identifyContext: (ctx) => {
        // console.log(ctx);
        return ctx.userdata?._id ? ctx.userdate.id : ctx.id;
      },
    });

    const permissions = shield({
      Mutation: {
        login: rateLimitRule({window: '10s', max: 5}),
      },
    }, {allowExternalErrors: true})

    const executableSchema = makeExecutableSchema({
      typeDefs: [constraintDirectiveTypeDefs, typeDefs],
      resolvers,
    });

    const schema = applyMiddleware(executableSchema, permissions);

    const server = new ApolloServer<MyContext>({
      schema,
      introspection: true,
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault({
              embed: true as false,
            })
          : ApolloServerPluginLandingPageLocalDefault(),
      ],
      includeStacktraceInErrorResponses: false,
    });

    await server.start();

    app.get('/', (_req: Request, res: Response<MessageResponse>) => {
      res.json({
        message: 'API location: graphql',
      });
    });

    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(server, {
        context: async ({req}) => authenticate(req),
      }),
    );

    app.use(notFound);
    app.use(errorHandler);

  } catch (error) {
    console.error((error as Error).message);
  }
})();

export default app;
