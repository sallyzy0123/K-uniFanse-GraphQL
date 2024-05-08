import path from 'path';
import {loadFilesSync} from '@graphql-tools/load-files';
import {mergeTypeDefs} from '@graphql-tools/merge';

const typesArray = loadFilesSync('./*/', {
  extensions: ['graphql'],
});
const typeDefs = mergeTypeDefs(typesArray);

export default typeDefs;
