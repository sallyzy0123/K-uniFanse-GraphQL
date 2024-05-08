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

console.log('start the app');

(async () => {
  console.log('start the async inside');
  try {
    console.log('after helmet before ratelimitrule');

    const rateLimitRule = createRateLimitRule({
      identifyContext: (ctx) => {
        // console.log(ctx);
        return ctx.userdata?._id ? ctx.userdate.id : ctx.id;
      },
    });

    console.log('after rateLimitRule before permissions');

    const permissions = shield({
      Mutation: {
        login: rateLimitRule({window: '10s', max: 5}),
      },
    }, {allowExternalErrors: true})

    console.log('after permissions before executableSchema');

    const executableSchema = makeExecutableSchema({
      typeDefs: [constraintDirectiveTypeDefs, typeDefs],
      resolvers,
    });

    console.log('after executableSchema before schema');

    const schema = applyMiddleware(executableSchema, permissions);

    console.log('after schema before server');

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

    console.log('after server before server.start');

    await server.start();

    console.log('after server.start before get use');

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

    console.log('after graphql use before notfound errorhandler');

    app.use(notFound);
    app.use(errorHandler);

    console.log('after notfound errorhandler');

  } catch (error) {
    console.error((error as Error).message);
  }
})();

console.log('after app async function');

export default app;
