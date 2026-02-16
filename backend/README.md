Backend README - consult-backend

1) Install dependencies
   cd backend
   npm install

2) Create .env from .env.example and set MONGODB_URI and keys

3) Start MongoDB (local) or via Docker
   docker run -d --name mongo -p 27017:27017 -v mongo-data:/data/db mongo:6

4) Start server
   npm run dev

API endpoints
- POST /api/second-opinion  (multipart/form-data with documents[])
- POST /api/consultation/book
- POST /api/payment/order
- POST /api/payment/verify
- Admin: POST /api/admin/login -> get token
- Admin protected: GET /api/admin/second-opinions

Notes
- Configure Twilio credentials for WhatsApp in .env
- Configure Razorpay keys to create real test orders
- Frontend should create orders via /api/payment/order then use Razorpay checkout and call /api/payment/verify with signature
