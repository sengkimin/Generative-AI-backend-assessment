import { askQuery } from './src/controllers/chat.controller';

import express from 'express';
const app = express();
import routes from './src/routes/api';
import auth from "./src/routes/auth"
import { AppDataSource } from './src/config/data-source';
import { DataSource } from 'typeorm';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swagger';
import chat from './src/routes/chat'
import cert from './src/routes/cert'
import cors from "cors";
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, 
	limit: 200, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
  message:"Now limited,please try again later"
})

app.use(limiter)

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true })) // for form data
var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// Swagger setup
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes setup
app.use('/api/auth', auth)
app.use('/api/chat', chat)
app.use('/api/certificate', cert)




// Start server
const PORT = process.env.PORT || 3000

  AppDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log(error));

export const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource);
      else reject("Failed to create connection with database");
    }, delay);
  });
};

export default app;
