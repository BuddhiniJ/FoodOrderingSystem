README.txt - Deployment Guide for Restaurant Management System
==============================================================

This document guides you through deploying the Restaurant Management System, which consists of multiple backend microservices and a React (Vite) frontend.

----------------------------------------------------
PROJECT STRUCTURE
----------------------------------------------------
- client/                    => React (Vite) frontend
- user-service/             => User microservice (Node.js/Express)
- restaurant-service/       => Restaurant microservice
- order-service/            => Order microservice
- delivery-service/         => Delivery microservice
- payment-service/          => Payment microservice
- notification-service/     => Notification microservice
- .env                      => Shared environment configs

----------------------------------------------------
PREREQUISITES
----------------------------------------------------
- Node.js v16 or higher
- npm or yarn
- MongoDB (local or cloud)
- Optional: Docker & Docker Compose
- Optional: PM2 (for production process management)

----------------------------------------------------
STEP 1 - SETUP ENVIRONMENT VARIABLES
----------------------------------------------------
A. In each backend service folder (e.g., restaurant-service/.env):

PORT=5003
MONGO_URI=mongodb://localhost:27017/restaurantdb

B. In `client/.env`:

VITE_USER_SERVICE_URL=http://localhost:5001/api
VITE_RESTAURANT_SERVICE_URL=http://localhost:5003/api
VITE_ORDER_SERVICE_URL=http://localhost:5004/api
VITE_DELIVERY_SERVICE_URL=http://localhost:5005/api
VITE_PAYMENT_SERVICE_URL=http://localhost:5006/api
VITE_NOTIFICATION_SERVICE_URL=http://localhost:5007/api

Update these with your production URLs before deploying live.

----------------------------------------------------
STEP 2 - INSTALL DEPENDENCIES
----------------------------------------------------
In each service and client directory, run:

npm install

Repeat for:
- client/
- user-service/
- restaurant-service/
- order-service/
- delivery-service/
- payment-service/
- notification-service/

----------------------------------------------------
STEP 3 - RUN LOCALLY FOR TESTING
----------------------------------------------------
Start MongoDB server.

Then, for each backend service:

cd service-name/
npm run dev

Start the frontend:

cd client/
npm run dev

Open the frontend in your browser and verify all services work.

----------------------------------------------------
STEP 4 - DEPLOY BACKEND SERVICES
----------------------------------------------------
OPTION 1: Deploy with PM2 (for VPS like Ubuntu)
-----------------------------------------------
Install PM2 globally:

npm install -g pm2

Then, for each backend service:

cd service-name/
pm2 start index.js --name service-name

OPTION 2: Deploy with Docker
----------------------------
1. Create Dockerfile in each backend folder.
2. Optionally create a docker-compose.yml to manage all containers.
3. Run:

docker-compose up --build

OPTION 3: Deploy to Render, Railway, Heroku, etc.
-------------------------------------------------
Push each service to its own repo and deploy using their platform-specific steps.

----------------------------------------------------
STEP 5 - DEPLOY FRONTEND (VITE REACT)
----------------------------------------------------
1. Build the app:

cd client/
npm run build

2. Serve with `serve` (for local testing or custom VPS):

npm install -g serve
serve -s dist

3. Or deploy the `dist/` folder to:
- Netlify
- Vercel
- Firebase Hosting
- Nginx (for VPS)

IMPORTANT: Make sure to update all VITE_ environment variables to point to the deployed backend URLs before running `npm run build`.

----------------------------------------------------
STEP 6 - NGINX REVERSE PROXY (Optional VPS)
----------------------------------------------------
Example config to serve frontend and proxy APIs:

