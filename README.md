
# K-uniFanse

K-uniFanse is a React app aiming to create a more accessible and inclusive space for K-pop fans in Finland to connect. This app offers an online community to safely trade and exchange their favorite idol merch.
K-uniFanse is implemented using React, Node.js, GraphQL, MongoDB, webSocket, and TypeScript.

## Why is it useful?
The project is useful for exchanging idol merchandise.

## Target Users
K-pop fans in Finland

## Features
- user authentication
- users can add, modify, and delete their idol merchandise
- users can edit their info and delete their account

## Implementation
- Frontend: React, Bootstrap -> [React](https://github.com/sallyzy0123/K-uniFanse-Vite)
- Backend: Node.js, Socket.io, GraphQL API -> [Auth server](https://github.com/sallyzy0123/K-uniFanse-auth), [Socket server](https://github.com/sallyzy0123/K-uniFanse-socket), [Upload server](https://github.com/sallyzy0123/K-uniFanse-upload), [GraphQL server](https://github.com/sallyzy0123/K-uniFanse-GraphQL)
- Database: MongoDB
- Deployment: Azure
- Written with TypeScript


## Demo video
[![Watch the video](https://img.youtube.com/vi/cCELiXopt0U/hqdefault.jpg)](https://www.youtube.com/watch?v=cCELiXopt0U)
[![Watch the video](https://img.youtube.com/vi/uX1UhON1-CY/hqdefault.jpg)](https://www.youtube.com/watch?v=uX1UhON1-CY)

## Test Link
[Frontend](https://sallyzy0123.github.io/K-uniFanse-Vite/)

[Backend (sandbox)](https://yingzh-kunifanse-graphql.azurewebsites.net/graphql)

## Test steps
1. [Frontend](https://sallyzy0123.github.io/K-uniFanse-Vite/)
1. Register a new account
1. Login with your new account
1. Navigate to the profile page
1. Edit your username by clicking the 'Edit Account' button
1. Add new merchandise by clicking the 'Add new merchandise" button
1. Browse other merchandise
1. Choose the merchandise that you posted
1. Edit your merchandise
1. Delete your merchandise
1. Navigate to the profile page
1. Logout
1. Login again
1. Navigate to the profile page
1. Delete your account by clicking the 'delete account' button

## Installation
Follow these steps to set up the K-uniFanse App on your local machine:
1. **Clone Repositories**

   ```bash
   git clone https://github.com/sallyzy0123/K-uniFanse-Vite
   git clone https://github.com/sallyzy0123/K-uniFanse-GraphQL
   git clone https://github.com/sallyzy0123/K-uniFanse-upload
   git clone https://github.com/sallyzy0123/K-uniFanse-socket
   git clone https://github.com/sallyzy0123/K-uniFanse-auth

2. **Set up the environment variable in servers and client**
Create the .env file in each repository and fill in the variables below.

**Vite**
```
NODE_ENV=development
VITE_SOCKET_URL=http://localhost:3003
```
**GraphQL**
```
PORT=3000
DATABASE_URL=
AUTH_URL=http://localhost:3001/api/v1
JWT_SECRET=
SOCKET_URL=http://localhost:3003
UPLOAD_URL=http://localhost:3002/api/v1
```
**upload**
```
NODE_ENV=development
PORT=3002
JWT_SECRET=
AUTH_URL=http://localhost:3001/api/v1
```
**socket**
```
ESLINT_USE_FLAT_CONFIG=false
NODE_ENV=development
PORT=3003
DATABASE_URL=
```
**auth**
```
NODE_ENV=development
PORT=3001
DATABASE_URL=
JWT_SECRET=
```
3. **Create with the database**

Create the MongoDB database in Atlas and fill the DATABASE_URL into the .env file above.

4. **Install the dependencies in each repositories**
```
npm install
```
5. **Run the app in each repositories**
```
npm run dev
```


## Trello board
[Trello](https://trello.com/b/xT6cAZoI/k-unifanse): project idea, user stories, and product backlog

## Feedback form

[Google Form](https://docs.google.com/forms/d/e/1FAIpQLSfQ5OjEnifVNt04u0_sLRPvsaiVoPiP1Hggkxv9MqeuX-uXcw/viewform?usp=sf_link)
