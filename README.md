---

## ✨ Key Features

- 🔒 **Secure Authentication & Authorization**:  
  - **JWT-based authentication** for user login and registration.  
  - Password reset and email confirmation for enhanced security.  

- 🔍 **Advanced Product Browsing**:  
  - **Search, filtering, sorting, and pagination** for efficient product discovery.  
  - **Star rating system** for user feedback and product ratings.  

- 🛒 **Core E-Commerce Functionalities**:  
  - **Add-to-cart** and **wishlist** for a seamless shopping experience.  
  - **Discount coupon codes** for promotional offers.  

- 💳 **Payment Integration**:  
  - Supports **cash-on-delivery** for flexible transactions.  
  - **Stripe-powered credit card payments** for secure online payments.  

- 🖼️ **Image Management**:  
  - Enables **image uploads** and **processing** for product displays.  

- 🗄️ **Scalable Database**:  
  - Utilized **MongoDB** with advanced **Mongoose queries** to manage complex data relationships.  

- 🚀 **Deployment**:  
  - Deployed on **Vercel** for high availability, scalability, and seamless integration with frontend systems.  

---

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (cloud-based)  
- **Authentication**: JWT  
- **Payment Gateway**: Stripe  
- **Image Processing**: Multer, Sharp  
- **Deployment**: Vercel  

---

## 🚀 Installation

1. Clone the repository:  
   ```bash
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
🌐 API Endpoints
Auth:

/api/auth/login

/api/auth/register

/api/auth/forgot-password

Products:

/api/products

/api/products/search

/api/products/filter

Orders:

/api/orders

/api/orders/:id

Cart:

/api/cart

/api/cart/:id

Wishlist:

/api/wishlist

/api/wishlist/:id

Payments:

/api/payments/create-payment-intent

🚀 Deployment
The application is deployed on Vercel for high availability and scalability. You can access the live API at:
