import { env } from '../config/env.js';

export const errorMiddleware = (err, _req, res, _next) => {
  const isZodError = err.name === 'ZodError';
  const statusCode = isZodError ? 400 : err.statusCode || 500;
  const message = isZodError
    ? err.errors.map((error) => error.message).join(', ')
    : err.isOperational
      ? err.message
      : 'Error interno del servidor';

  if (env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    ok: false,
    message,
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
