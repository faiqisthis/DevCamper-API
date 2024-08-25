import express from "express";
import bootcamps from "./routes/bootcamps.js";
import courses from "./routes/courses.js";
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import reviews from "./routes/reviews.js";
import logger from "./middleware/logger.js";
import connectDB from "./db.js";
import colors from "colors";
import errorHandler from "./middleware/error.js";
import path from "path";
import url from "url";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from  "cors";


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Loading Environment Variables
const PORT = process.env.PORT;
//Making Express App
const app = express();

//Logger Middleware
app.use(logger);

//Connecting to Database
connectDB();

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Cookie Parser
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Sanitize data
app.use(mongoSanitize());

//Set Security Headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

//Prevent hhtp param pollution
app.use(hpp());

//CORS
app.use(cors())

//Mounitng router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

//Check for Errors
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`.yellow.inverse);
});

//To handle database unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`);
  server.close(() => process.exit(1));
});
