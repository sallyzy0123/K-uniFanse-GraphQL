import {GraphQLError} from 'graphql';

const fetchData = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (!response.ok) {
      throw new GraphQLError(json.message, {
        extensions: {
          code: response.statusText,
        },
      });
    }
    return json;
  } catch (error) {
    throw new GraphQLError((error as GraphQLError).message, {
      extensions: {
        code:
          (error as GraphQLError).extensions?.code || 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};

export default fetchData;
