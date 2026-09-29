import express from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { getUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";


const userRouter = express.Router();

userRouter.get("/test", (req, res) => {
  res.send("user router is working");
});

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser)
userRouter.route("/refreshToken").post(refreshAccessToken)
userRouter.route("/current-user").get(verifyJWT, getUser)


export default userRouter;