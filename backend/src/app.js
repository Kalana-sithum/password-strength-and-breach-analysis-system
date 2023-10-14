import express from "express";
import RateLimiterMemory from "rate-limiter-flexible/lib/RateLimiterMemory.js";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "./utils/logger";
import helmet from "helmet";
import "dotenv/config";
import routes from "./api/routes";
import responseHandler from "./utils/response.handler";
import { connect } from "./utils/database.connection";

const app = express();
const PORT = process.env.PORT || "8090";

const rateLimiter = new RateLimiterMemory({
  points: 10, // maximum number of requests allowed
  duration: 1, // time frame in seconds
});

// Register Rate Limiter Middleware
app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Too Many Requests");
    });
});

// set the request size limit to 1 MB
app.use(bodyParser.json({ limit: '1mb' }));

// Register Middleware Chain
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,PUT,POST,DELETE",
  })
);
// Add Content-Security-Policy header
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self'", "default-src 'none'", "script-src 'self'", "style-src 'self'", " img-src 'self'");
  next();
});

// Add X-Frame-Options header
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Inject Response Handler
app.use((req, res, next) => {
  req.handleResponse = responseHandler;
  next();
});

//Handle Root API Call
app.get("/", (req, res, next) => {
  res.send(
    "<title>Password strength and Breach Analysis System</title><h1>Welcome to Password strength and Breach Analysis System</h1>"
  );
  next();
});

//Start the Server
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  connect();
  routes(app);
});
