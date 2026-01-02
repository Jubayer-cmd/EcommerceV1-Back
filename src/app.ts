import cookieParser from 'cookie-parser';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import router from './app/routes/router';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';

const app: Application = express();

//  apply to all requests
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Add security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.header(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    );
    return res.status(200).json({});
  }
  next();
});

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  }),
);

app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//limit request
app.use(limiter);

app.use(morgan('dev'));

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
);

//routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Ecom is Running! 🏇');
});
//global error handler
app.use(globalErrorHandler);
//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
