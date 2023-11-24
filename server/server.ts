import express from "express";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import http from "http";
import { setupDb } from "./setup/db";

// middlewares
import { notFound, errorHandler } from "./middlewares/error.middleware";

// import routes
import AuthRoutes from "./routes/auth.routes";
import ItemRoutes from "./routes/item.routes";

setupDb(process.env.NODE_ENV);

const app = express();

// morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// body parser
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 *
 * Routes
 *
 */
app.use("/api/auth", AuthRoutes);
app.use("/api/items", ItemRoutes);

// error middlewares
app.use(notFound);
app.use(errorHandler);

const HttpServer = http.createServer(app);
const port = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  HttpServer.listen(port, () => {
    console.log(`Express is listening at http://localhost:${port}`);
    console.log(`Node Environment: ${process.env.NODE_ENV}`);
  });
}

export default HttpServer;
