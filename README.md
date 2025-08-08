# Stock Tracker Application

This is a full-stack application for tracking stock prices, with user authentication powered by a Node.js backend and a React frontend. Users can sign up, log in, and search for real-time stock information.

## Features

* [cite_start]**User Authentication**: Secure signup and login using `jsonwebtoken` for JWTs and `bcryptjs` for password hashing[cite: 2, 7, 9]. [cite_start]Passwords are and stored securely in a MongoDB database using `bcryptjs`[cite: 7].
* [cite_start]**MongoDB Database**: User data is stored in a MongoDB database, with `mongoose` serving as the ODM (Object Data Modeling) library[cite: 6].
* [cite_start]**RESTful API**: The backend is built with `Express.js`, providing API endpoints for user signup and login[cite: 1, 8, 10].
* **Dynamic Stock Display**: Users can search for stock information by symbol to view current price, daily change, and exchange.
* **Responsive UI**: The client-side interface is built with React and custom CSS, designed to be responsive across devices.

---

## Technologies Used

### Frontend
* **React with Vite**: The application uses React for the user interface and Vite for a fast development environment.
* **Custom CSS**: Styling is handled with custom CSS files for components like `Auth.css` and `StockCard.css`.
* **`axios`**: This library is used for making API calls to fetch stock data.
* **Yahoo Finance RapidAPI**: The application uses this API to get real-time stock data.

### Backend
* [cite_start]**Node.js and Express.js**: The backend server is built with Node.js and the Express.js framework[cite: 1, 3].
* [cite_start]**MongoDB with Mongoose**: User data is stored in a MongoDB database, with Mongoose as the ODM[cite: 4, 6].
* [cite_start]**`bcryptjs`**: This library is used for password hashing to store them securely[cite: 1, 7].
* [cite_start]**`jsonwebtoken`**: This library is used to generate a JWT for authentication upon successful signup or login[cite: 2, 9, 11].
* [cite_start]**`cors`**: This middleware is used to enable Cross-Origin Resource Sharing for the frontend[cite: 3, 4].

---

## Prerequisites

* [cite_start]**Node.js** and **npm** installed on your machine[cite: 13, 15].
* [cite_start]A running instance of **MongoDB** (or a MongoDB Atlas account)[cite: 4, 5].

---

## Installation and Setup

### 1. Backend Setup

The backend server is built with Node.js and Express.

1.  **Navigate to the backend directory**:
    ```bash
    # Assuming you have a backend folder with server.cjs
    cd path/to/your/backend/folder
    ```

2.  **Install dependencies**:
    ```bash
    npm install express mongoose bcryptjs jsonwebtoken cors
    ```

3.  **Configure the server**:
    * Open `server.cjs`.
    * [cite_start]Replace `MONGODB_URI` with your MongoDB connection string (e.g., `mongodb://localhost:27017/stocktrackerdb` for local, or your Atlas URI)[cite: 5, 16].
    * [cite_start]Replace `JWT_SECRET` with a strong, random secret key[cite: 5, 16].

4.  **Start the backend server**:
    ```bash
    node server.cjs
    ```
    [cite_start]The server will start on `http://localhost:5000`[cite: 3, 12].

---

### 2. Frontend Setup

The frontend is a React application created with Vite.

1.  **Navigate to the frontend directory**:
    ```bash
    cd path/to/your/frontend/folder
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up the API key**:
    * Create a `.env.local` file in the root of your frontend directory.
    * Add your RapidAPI key to this file:
        ```
        https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote
        ```

4.  **Start the frontend development server**:
    ```bash
    npm run dev
    ```
    The React application will be available at `http://localhost:5173` (or another port if 5173 is in use).

---

## API Endpoints

* `POST /api/auth/signup`: Registers a new user. [cite_start]Expects a JSON body with `email` and `password`[cite: 8].
* `POST /api/auth/login`: Authenticates a user. [cite_start]Expects a JSON body with `email` and `password`[cite: 10].

---

## Project Structure

* `server.cjs`: The Node.js and Express backend server, including MongoDB connection and authentication routes.
* `src/`: Contains the React frontend application.
    * `App.jsx`: Main application component, handling authentication flow and stock search.
    * `main.jsx`: Entry point for the React application.
    * `index.css`: Global CSS styles and variables.
    * `App.css`: Styles specific to the `App` component.
    * `components/`: Directory for reusable React components.
        * `Auth.jsx`: Component for user signup and login forms.
        * `Auth.css`: Styles for the `Auth` component.
        * `StockCard.jsx`: Component to display detailed stock information.
        * `StockCard.css`: Styles for the `StockCard` component.
