import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';

import CustomError from './classes/CustomError';
import {ErrorResponse} from './types/MessageTypes';
import {UserWithoutPassword} from './types/DBTypes';
import {MyContext} from './types/MyContext';

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  // console.log(err);
  const statusCode = err.status !== 200 ? err.status || 500 : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!process.env.JWT_SECRET) {
      next(new CustomError('JWT secret not set', 500));
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.locals.user = {};
      return next();
    }

    // we are using a bearer token
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.locals.user = {};
      return next();
    }

    const tokenContent = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as UserWithoutPassword;

    // optionally check if the user is still in the database

    const context: MyContext = {userdata: tokenContent};
    res.locals.user = context;

    next();
  } catch (error) {
    res.locals.user = {};
    next();
  }
};

export {notFound, errorHandler, authenticate};
