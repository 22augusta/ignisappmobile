/**
 * Logger utility for the application
 * In production, this can be configured to send logs to a remote service
 */

const isDevelopment = __DEV__;

export const logger = {
  info: (message, ...args) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },

  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },

  error: (message, ...args) => {
    // Always log errors, even in production
    console.error(`[ERROR] ${message}`, ...args);
    
    // In production, you could send errors to a logging service
    // Example: Sentry.captureException(new Error(message));
  },

  debug: (message, ...args) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};

export default logger;
