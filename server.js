import express from "express";
import bootcamps from "./routes/bootcamps.js";
import courses from './routes/courses.js'
import auth from './routes/auth.js'
import logger from "./middleware/logger.js";
import connectDB from "./db.js";
import colors from "colors";
import errorHandler from "./middleware/error.js";
import path from "path";
import url from "url";

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

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Mounitng router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use('/api/v1/auth',auth);

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
