const express = require('express');
const app = express();

require('dotenv').config();

// connectDB
const connectDB = require('./database/connectdb');
//router
const authRouter = require('./routes/auth');
const stripeRouter = require('./routes/stripe');
const validateTokenRouter = require('./routes/validateToken')

//extra secuirity packages
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const cors = require('cors');

//secuirity middleware
app.use(cors({ origin: ['http://localhost:3000', 'https://asmn-grocery-store.netlify.app', 'https://asumansounds.com'], credentials: true }));

app.use(helmet())
app.use(xss())
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 4000, // limit each IP to 100 requests
    //don't exceed 100 requests in 15 minutes
  })
);

app.use(express.json());

//test route
app.get('/', (req, res) => {
  res.status(200).send(`<h1>Asuman Sounds App API</h1>`);
});

//routes
app.use('/auth', authRouter);
app.use('/stripe', stripeRouter);
app.use('/auth', validateTokenRouter)

const errorHandlerMiddleware = require('./error-middleware/error-handler');

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log('Server failed to start');
  }
};

start();
