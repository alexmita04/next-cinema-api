# Next Cinema API

A concise **RESTful backend** built with **Node.js (Express)** and **MongoDB (Mongoose)** to power a cinema ticketing demo application.

This API features two core modules:

1. **User Module:** Allows users to **browse movies**, check **seat availability**, and **purchase tickets**.
2. **Admin Module:** Enables administrators to **manage cinema locations**, **movies**, and **screenings**.

## Dedicated Backend API

- This service powers the application's functionality. For the client-side implementation, please see the **Frontend Repository: [to be added]**
- **The API is live!**
  - Please note that as it's hosted on a free tier, there may be a brief delay while the server wakes up on your first request:
  - [**https://next-cinema-api.onrender.com**](https://next-cinema-api.onrender.com/)

## Table of Contents

- [Tech Stack](#tech-stack)
- [Installation and Local Configuration](#installation-and-local-configuration)
- [Endpoints](#endpoints)
- [Schemas](#schemas)
- [API End-to-End Testing (E2E)](#api-end-to-end-testing-e2e)
- [Contact](#contact)

## Tech Stack

### Core Technologies

- Node.js
- MongoDB Atlas
- Postman
- Docker
- JWT Token
- Stripe

### Dependencies

- Express.js
- Mongoose
- jsonwebtoken
- Stripe
- bcryptjs
- cookie-parser
- cors
- express-mongo-sanitize
- express-rate-limit
- helmet
- joi
- node-cron
- swagger-jsdoc
- swagger-ui-express

### Dev-dependencies

- dotenv
- jest
- morgan
- supertest

## Installation and Local Configuration

### Prerequisites

- Node and npm
- A MongoDB database
- `config.env` file

### config.env Schema

```env
PORT=
DB_USERNAME=
DB_PASSWORD=
DB_URI=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ADMIN_PASSWORD=
ADMIN_PUBLIC_PASSWORD=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Clone This Repo

**Option 1: Clone repo**

1. Clone the repository
2. Run `npm install`
3. Configure `config.env` file inside `src` directory
4. Run `npm run dev`

**Option 2: Docker deployment**

- Pull the image from Docker Hub: https://hub.docker.com/r/alexmita04/next-cinema-api

## Endpoints

You can explore the available endpoints through the following resources:

- **Postman Workspace:** https://www.postman.com/alexmita04/next-cinema-api-demo/collection/tuu8sta/next-cinema-api?action=share&creator=11284739
- **Swagger UI:** https://next-cinema-api.onrender.com/api-docs/ (Includes all endpoints, though some descriptions are currently pending completion.)

### Important Endpoints

- `POST /api/users/login` → Authenticate as a **user** or an **admin**.
- `GET /api/cinemas` → Retrieve information for **all cinemas**.
- `POST /api/tickets/create-checkout-session` → Initiate a **Stripe checkout session** for ticket purchases.
- `GET /api/users/reports/sales` → Access **sales reports** (Admin-only access).

## Schemas

### User Schema

_(check `./src/models/user.js`)_

- `username`: String
- `password`: String
- `refreshTokens`: Array
  - `refreshTokens.token`: String
  - `refreshTokens.createdAt`: Date
- `dateOfBirth`: Date
- `gender`: String
- `phoneNumber`: String
- `address`: String
- `isAdmin`: Boolean

### Auditorium Schema

_(check `./src/models/auditorium.js`)_

- `number`: Number
- `capacity`: Number
- `type`: String (enum: 'Standard', '4dx', 'IMAX')
- `seatLayout`: Object
  - `seatLayout.rows`: Number
  - `seatLayout.seatsPerRow`: Number
- `screenSize`: String
- `soundSystem`: String
- `projection`: String
- `createdAt`: Date
- `updatedAt`: Date

### Cinema Schema

_(check `./src/models/cinema.js`)_

- `name`: String
- `location`: String
- `admin`: ObjectId (ref: User)
- `auditoriums`: Array (ref: Auditorium)
- `openingHour`: Number
- `closingHour`: Number
- `email`: String
- `parking`: Boolean
- `timestamps`: Object
  - `timestamps.createdAt`: Date
  - `timestamps.updatedAt`: Date

### Movie Schema

_(check `./src/models/movie.js`)_

- `creator`: ObjectId (ref: Admin)
- `title`: String (required, unique)
- `description`: String (required)
- `slug`: String (required, unique)
- `duration`: Number (required, min: 0)
- `releaseDate`: Date (required)
- `genres`: Array of String (required, enum: Action, Comedy, Drama, Horror, SF, Fantasy, Thriller, Romance, Adventure, Animation, Documentary)
- `cast`: Array
  - `cast.name`: String (required)
  - `cast.characterName`: String (required)
- `director`: String (required)
- `production`: String (required)
- `distribution`: String (required)
- `coverImage`: String (required)
- `trailer`: String (required)
- `timestamps`: Object
  - `timestamps.createdAt`: Date
  - `timestamps.updatedAt`: Date

### Review Schema

_(check `./src/models/review.js`)_

- `author`: mongoose.Types.ObjectId (ref: User, required)
- `movie`: mongoose.Types.ObjectId (ref: Movie, required)
- `rating`: Number (min: 0, max: 5, required)
- `body`: String (required)
- `timestamps`: true
  - `timestamps.createdAt`: Date
  - `timestamps.updatedAt`: Date

### Screening Schema

_(check `./src/models/screening.js`)_

- `auditorium`: ObjectId (ref: Auditorium)
- `movie`: ObjectId (ref: Movie)
- `cinema`: ObjectId (ref: Cinema)
- `date`: Date
- `startTime`: Number
- `pricing`: Number
- `language`: String
- `subtitle`: String
- `createdBy`: ObjectId (ref: User)
- `timestamps`: Boolean

### Ticket Schema

_(check `./src/models/ticket.js`)_

- `screening`: ObjectId (ref: Screening)
- `customer`: ObjectId (ref: User)
- `seat`: Object
  - `seat.row`: Number
  - `seat.number`: Number
- `totalPrice`: Number
- `pricingCategory`: String (enum: standard, student)
- `createdAt`: Date
- `updatedAt`: Date

## API End-to-End Testing (E2E)

### Technology Stack

These E2E tests are built upon a powerful stack:

- **Jest**
- **Supertest**

Currently, E2E tests cover a **small but critical subset of endpoints**, primarily focusing on read operations (like fetching all Cinemas and Movies) and a write operation (creating a Movie).

For endpoints requiring authentication (like the `POST /api/movies` route), a **mocked authentication token** is generated and sent in the request header to simulate an authenticated admin user, allowing the test to verify the functionality protected by authorization.

All E2E test files are located in the repository at: `./src/__test__`

## Contact

- **Email:** alexmita04@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/alexandru-mita-ba74b2299/

## License

See [LICENSE](LICENSE)
