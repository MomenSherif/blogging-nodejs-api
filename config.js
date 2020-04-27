const requiredEnvVariables = ['JWT_SECRET_KEY', 'MONGODB_URL'];

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
};
