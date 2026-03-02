import express from 'express';
import initSwagger from './src/common/swagger/init.swagger.js';
import sequelize from './src/common/sequelize/connect.sequelize.js';  // Sequelize setup for database connection
import rootRoutes from './src/routes/rootRoutes.js';  // Import the root routes
import cors from 'cors';
import { handlerError, globalErrorBoundary, requestTimeout } from './src/common/helpers/error.helper.js';


const app = express();  // Initialize the Express app
const PORT = process.env.PORT || 3000;

app.use(cors());
// Middleware
app.use(express.json());
app.use(requestTimeout);  // Middleware to parse JSON bodies

// Initialize Swagger
initSwagger(app);

// Mount the root routes at /api
app.use('/api', rootRoutes);
app.use(handlerError);
globalErrorBoundary(app);

// Start the server only after syncing with the database
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch(err => console.error('Database connection failed:', err));

export default app;
