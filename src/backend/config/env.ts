import "server-only";

interface Config {
  node_env : string
  databaseUrl: string;
  // jwtSecret: string;
  // adminEmail: string;
  // adminPassword: string;
}

const loadConfig = (): Config => {
  const databaseUrl = process.env.MONGODB_URI;
  const jwtSecret = process.env.JWT_SECRET;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const node_env = process.env.NODE_ENV;

  if(!node_env || node_env.length === 0){
    throw new Error("Node enviormental is missing");
  }

  if (!databaseUrl || databaseUrl.length === 0) {
    throw new Error("MONGODB_URI is missing");
  }

  // if (!jwtSecret || jwtSecret.length < 32) {
  //   throw new Error("JWT_SECRET must be at least 32 characters");
  // }

  // if (!adminEmail?.trim() || !adminPassword?.trim()) {
  //   throw new Error("Admin credentials are missing");
  // }

  return {
    databaseUrl,
    // jwtSecret,
    // adminEmail,
    // adminPassword,
    node_env
  };
};

export const env = loadConfig();