/**
 * Environment configuration
 * Handles different API endpoints based on deployment context
 */

// Determine API URL based on environment
const getApiUrl = (): string => {
  const nodeEnv = process.env.NODE_ENV || "development";

  // Use environment variable if provided (priority 1: explicit env var)
  // When using tunnel with local API, set: export REACT_APP_API_URL="http://YOUR_MACHINE_IP:3000"
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // For production, use deployed backend
  // if (nodeEnv === "production") {
  //   return "https://api.ajudae.com/api";
  // }

  // For local development, use localhost
  return "http://localhost:3000";
};

export const API_BASE_URL = getApiUrl();

export const ENV = {
  API_URL: API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  DEBUG: process.env.DEBUG === "true",
} as const;

export default ENV;
