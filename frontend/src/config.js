// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api'
  },
  production: {
    API_BASE_URL: 'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--96435430.local-credentialless.webcontainer-api.io/api'
  }
};

// Determine environment
const isDevelopment = import.meta.env.DEV;
const currentConfig = isDevelopment ? config.development : config.production;

export const API_BASE_URL = import.meta.env.VITE_API_URL || currentConfig.API_BASE_URL; 