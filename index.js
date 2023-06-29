require("dotenv").config();
const express = require("express");
const mongodb = require("./db");
// const cors = require("cors");
const clientUrl = process.env.CLIENT_URL;
const PORT = process.env.PORT || 5000;

// --------------------------------------------------------------
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetUp = require("./passpor");

// --------------------------------------------------------------
const app = express();

// app.use(
//   cors({
//     origin: "https://snack-box.netlify.app",
//     credentials: true,
//   })
// );

app.use(cookieParser());

// ----------------------------------------------------------------------
app.use(
  // cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
  cookieSession({
    name: "session",
    keys: ["lama"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// passportSetUp(passport); // Assuming passportSetUp is a function that configures your passport strategies

// app.use(
//   cors({
//     origin: clientUrl,
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", `${clientUrl}`);
//   // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin,X-Requested-With,Content-Type,Accept"
//   );
//   next();
// });
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", `${clientUrl}`);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "origin, content-type, accept, x-requested-with"
  );
  res.setHeader("Access-Control-Max-Age", "3600");
  next();
});

mongodb();

app.use(express.static("public"));
app.use(express.json());
app.use("/api", require("./routes/createUser"));
app.use("/api", require("./routes/loginUser"));
app.use("/api", require("./routes/displayData"));
app.use("/api", require("./routes/orderData"));
app.use("/auth", require("./routes/authroute"));
// app.use("/api", require("./controllers/auth"));
// app.use(authRouter);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(5000, function () {
  console.log(`server started at port ${PORT}`);
});
