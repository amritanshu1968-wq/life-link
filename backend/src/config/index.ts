import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'lifelink_emergency_super_secret_jwt_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  dotnetVerificationUrl: process.env.DOTNET_VERIFICATION_SERVICE_URL || 'http://localhost:5001',
  pythonAiUrl: process.env.PYTHON_AI_SERVICE_URL || 'http://localhost:8000',
};
