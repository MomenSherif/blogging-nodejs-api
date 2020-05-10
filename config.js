const requiredEnvVariables = [
  'JWT_SECRET_KEY',
  'MONGODB_URL',
  'CLOUD_NAME',
  'API_KEY',
  'API_SECRET',
];

const missingEnvVariables = requiredEnvVariables.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVariables.length) {
  throw new Error(`⚠ Missing environment variables ${missingEnvVariables}`);
}

module.exports = {
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  port: process.env.PORT || 3000,
  mongoDBUrl: process.env.MONGODB_URL,
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
};
