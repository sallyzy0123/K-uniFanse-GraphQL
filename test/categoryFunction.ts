import request from 'supertest';
import {Application} from 'express';
import {CategoryTest} from '../src/types/DBTypes';

const postCategory = (
  url: string | Application,
  vars: {category: CategoryTest},
): Promise<CategoryTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation AddCategory($category: CategoryInput!) {
          addCategory(category: $category) {
            message
            category {
              id
              category_name
            }
          }
        }`,
        variables: vars,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const category = vars.category;
          const newCategory = response.body.data.addCategory;
          expect(newCategory).toHaveProperty('message');
          expect(newCategory.category).toHaveProperty('id');
          expect(newCategory.category.category_name).toBe(category.category_name);
          resolve(newCategory.category);
        }
      });
  });
};

const deleteCategory = (
  url: string | Application,
  id: string,
  token: string,
): Promise<CategoryTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteCategory($deleteCategoryId: ID!) {
          deleteCategory(id: $deleteCategoryId) {
            message
            category {
              id
              category_name
            }
          }
        }`,
        variables: {
          deleteCategoryId: id,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const deletedCategory = response.body.data.deleteCategory;
          expect(deletedCategory).toHaveProperty('message');
          expect(deletedCategory.category.id).toBe(id);
          resolve(deletedCategory);
        }
      });
  });
};

export {postCategory, deleteCategory};
