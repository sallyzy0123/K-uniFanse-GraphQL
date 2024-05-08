import app from './app';
import mongoConnect from './lib/db';

const port = process.env.PORT || 3000;
console.log('starting server');
console.log('port: ', port);
(async () => {
  console.log('inside async function');
  try {
    await mongoConnect();
    console.log('after mongoConnect');
    app.listen(port, () => {
      /* eslint-disable no-console */
      console.log(`Listening: http://localhost:${port}`);
      /* eslint-enable no-console */
    });
    console.log('after app.listen');
  } catch (error) {
    console.log('Server error', (error as Error).message);
  }
  console.log('after catch block');
})();

console.log('after async function');
