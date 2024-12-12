import cors from "cors";

class CorsMiddleware {
  static coreOptions: cors.CorsOptions = {
    origin: function (origin, callback) {
      if (!origin) callback(null, true);

      const allowedOrigins = ["http://localhost:5173"];

      if (origin && allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Credentials",
    ],
  };
}

export { CorsMiddleware };
