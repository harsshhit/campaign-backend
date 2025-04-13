const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://outflo.vercel.app', 'https://www.outflo.app'] // Add your production frontend URLs
    : ['http://localhost:5173', 'http://localhost:3000'], // Development URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default corsOptions;
