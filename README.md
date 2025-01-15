E-Commerce RESTful API
A scalable and robust backend API designed for an E-Commerce platform, built using Node.js, Express.js, and MongoDB. This API supports both mobile and web applications, providing a seamless shopping experience with advanced features and secure transactions.

Features
User Authentication & Authorization: Secure user login, registration, and role-based access control using JWT (JSON Web Tokens).

Advanced Product Browsing: Integrated search, filtering, sorting, and pagination for efficient product discovery.

Star Rating System: Allows users to rate products and view average ratings.

Discount Coupons: Supports discount codes for promotional offers.

Shopping Cart & Wishlist: Core functionalities like add-to-cart and add-to-wishlist for a smooth shopping experience.

Payment Integration: Supports cash-on-delivery and Stripe-powered credit card payments for secure transactions.

Image Upload & Processing: Enables users and admins to upload and process multiple product images.

Complex Data Management: Advanced Mongoose queries and efficient handling of relationships between database collections.

Technologies Used
Backend: Node.js, Express.js

Database: MongoDB (cloud-based)

Authentication: JWT

Payment Gateway: Stripe

Image Processing: Multer, Sharp

Deployment: Vercel

Key Achievements
Designed and developed a scalable RESTful API for an E-Commerce platform.

Optimized database operations for improved performance and efficiency.

Deployed the application on Vercel, ensuring high availability and scalability.

Enabled seamless integration with frontend systems for a smooth user experience.

Installation
Clone the repository:

bash
Copy
git clone https://github.com/your-username/ecommerce-api.git
Install dependencies:

bash
Copy
npm install
Set up environment variables:

Create a .env file and add your credentials:

Copy
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
Run the server:

bash
Copy
npm start
API Endpoints
Auth: /api/auth/login, /api/auth/register, /api/auth/forgot-password

Products: /api/products, /api/products/search, /api/products/filter

Orders: /api/orders, /api/orders/:id

Cart: /api/cart, /api/cart/:id

Wishlist: /api/wishlist, /api/wishlist/:id

Payments: /api/payments/create-payment-intent

Deployment
The application is deployed on Vercel for high availability and scalability. You can access the live API at:
Live API URL

