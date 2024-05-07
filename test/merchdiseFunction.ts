import request from 'supertest';
import {MerchandiseResponse, UploadResponse} from '../src/types/MessageTypes';
import {Application} from 'express';
import {Merchandise, MerchandiseTest} from '../src/types/DBTypes';

const postFile = (
  url: string | Application,
  token: string,
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('merch', 'test/Album.png')
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const uploadMessageResponse = response.body;
          expect(uploadMessageResponse).toHaveProperty('message');
          expect(uploadMessageResponse).toHaveProperty('data');
          expect(uploadMessageResponse.data).toHaveProperty('filename');
          expect(uploadMessageResponse.data).toHaveProperty('location');
          expect(uploadMessageResponse.data.location).toHaveProperty(
            'coordinates',
          );
          expect(uploadMessageResponse.data.location).toHaveProperty('type');
          resolve(uploadMessageResponse);
        }
      });
  });
};

const postMerchandise = (
  url: string | Application,
  vars: {merchandise: MerchandiseTest},
  token: string,
): Promise<MerchandiseResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation AddMerchandise($merchandise: MerchandiseInput!) {
          addMerchandise(merchandise: $merchandise) {
            merchandise {
              id
              merchandise_name
              price
              description
              filename
              category {
                id
                category_name
              }
              owner {
                id
                user_name
                email
              }
            }
            message
          }
        }`,
        variables: vars,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const merchandise = vars.merchandise;
          const newMerchResponse: MerchandiseResponse = response.body.data.addMerchandise;
          const newMerchandise: MerchandiseTest = newMerchResponse.merchandise;
          expect(newMerchandise).toHaveProperty('id');
          expect(newMerchandise.merchandise_name).toBe(merchandise.merchandise_name);
          expect(newMerchandise.price).toBe(merchandise.price);
          expect(newMerchandise.description).toBe(merchandise.description);
          expect(newMerchandise.filename).toBe(merchandise.filename);
          expect(newMerchandise.category).toHaveProperty('category_name');
          expect(newMerchandise.owner).toHaveProperty('user_name');
          resolve(newMerchResponse);
        }
      });
  });
};

const getMerchandises = (url: string | Application): Promise<Merchandise[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Merchandises {
          merchandises {
            id
            merchandise_name
            price
            description
            filename
            category {
              id
              category_name
            }
            owner {
              id
              user_name
              email
            }
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const merchandises: Merchandise[] = response.body.data.merchandises;
          expect(merchandises).toBeInstanceOf(Array);
          merchandises.forEach((merch: Merchandise) => {
            expect(merch).toHaveProperty('id');
            expect(merch).toHaveProperty('merchandise_name');
            expect(merch).toHaveProperty('price');
            expect(merch).toHaveProperty('filename');
            expect(merch.category).toHaveProperty('category_name');
            expect(merch).toHaveProperty('owner');
            expect(merch.owner).toHaveProperty('email');
            expect(merch.owner).toHaveProperty('id');
            expect(merch.owner).toHaveProperty('user_name');
          });
          resolve(merchandises);
        }
      });
  });
};

const getSingleMerchandise = (
  url: string | Application,
  id: string,
): Promise<Merchandise> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `query Merchandise($merchandiseId: ID!) {
          merchandise(id: $merchandiseId) {
            id
            merchandise_name
            price
            description
            filename
            category {
              id
              category_name
            }
            owner {
              id
              user_name
              email
            }
          }
        }`,
        variables: {
          merchandiseId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const merchandise = response.body.data.merchandise;
          expect(merchandise).toHaveProperty('id');
          expect(merchandise).toHaveProperty('merchandise_name');
          expect(merchandise).toHaveProperty('price');
          expect(merchandise).toHaveProperty('filename');
          expect(merchandise).toHaveProperty('description');
          expect(merchandise).toHaveProperty('owner');
          expect(merchandise.owner).toHaveProperty('email');
          expect(merchandise.owner).toHaveProperty('id');
          expect(merchandise.owner).toHaveProperty('user_name');
          expect(merchandise).toHaveProperty('category');
          expect(merchandise.category).toHaveProperty('category_name');
          resolve(merchandise);
        }
      });
  });
};

const getMerchByOwner = (
  url: string | Application,
  token: string,
): Promise<MerchandiseTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `query MerchandisesByOwner {
          merchandisesByOwner {
            id
            merchandise_name
            price
            description
            filename
            category {
              id
              category_name
            }
            owner {
              id
              user_name
              email
            }
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const merchandises = response.body.data.merchandisesByOwner;
          merchandises.forEach((merch: Merchandise) => {
            expect(merch).toHaveProperty('id');
            expect(merch).toHaveProperty('merchandise_name');
            expect(merch).toHaveProperty('price');
            expect(merch).toHaveProperty('filename');
            expect(merch).toHaveProperty('description');
            expect(merch).toHaveProperty('owner');
            expect(merch.owner).toHaveProperty('email');
            expect(merch.owner).toHaveProperty('id');
            expect(merch.owner).toHaveProperty('user_name');
            expect(merch).toHaveProperty('category');
            expect(merch.category).toHaveProperty('category_name');
          });
          resolve(merchandises);
        }
      });
  });
};

const putMerchandise = (
  url: string | Application,
  vars: {input: MerchandiseTest; modifyMerchandiseId: string},
  token: string,
): Promise<Merchandise> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($input: MerchandiseModify!, $modifyMerchandiseId: ID!) {
          modifyMerchandise(input: $input, id: $modifyMerchandiseId) {
            merchandise {
              id
              merchandise_name
              price
              description
              filename
              category {
                id
                category_name
              }
              owner {
                id
                user_name
                email
              }
            }
            message
          }
        }`,
        variables: vars,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const updatedMerch = response.body.data.modifyMerchandise;
          expect(updatedMerch).toHaveProperty('message');
          expect(updatedMerch.merchandise.id).toBe(vars.modifyMerchandiseId);
          expect(updatedMerch.merchandise).toHaveProperty('price');
          resolve(updatedMerch.merchandise);
        }
      });
  });
};

const deleteMerchandise = (
  url: string | Application,
  id: string,
  token: string,
): Promise<MerchandiseResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation DeleteMerchandise($deleteMerchandiseId: ID!) {
          deleteMerchandise(id: $deleteMerchandiseId) {
            merchandise {
              id
              merchandise_name
              price
              description
              filename
              category {
                id
                category_name
              }
              owner {
                id
                user_name
                email
              }
            }
            message
          }
        }`,
        variables: {
          deleteMerchandiseId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const deletedMerchandise = response.body.data.deleteMerchandise;
          expect(deletedMerchandise).toHaveProperty('message');
          expect(deletedMerchandise.merchandise.id).toBe(id);
          resolve(deletedMerchandise);
        }
      });
  });
};

export {postFile, postMerchandise, getMerchandises, getSingleMerchandise, getMerchByOwner, putMerchandise, deleteMerchandise};
