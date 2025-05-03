const dotenv = require('dotenv');
const path = require('path');

// Load env variables from the server directory
dotenv.config({ path: path.join(__dirname, '.env') });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://Amay_123:Goya_123@cluster0.rtjmh1f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  JWT_SECRET: process.env.JWT_SECRET || 'secret123456789',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d'
};