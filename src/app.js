import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import routes from './routes/index.routes.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === 'production' ? 100 : 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Demasiadas peticiones. Espera unos segundos e intenta nuevamente.',
  },
});

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}
app.use(express.json());
app.use(limiter);

app.use('/api', routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
