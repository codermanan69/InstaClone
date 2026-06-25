const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "../public")));

app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "https://instaclone-mrnn.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const userRouter = require("./routes/user.routes");

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();

    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;