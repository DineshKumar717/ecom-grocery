import express from "express";
import { getUserOrders, getAllOrders, placeCodOrder, placeCodOrderStripe } from "../controllers/orderController.js";
import authUser from "../middlewares/authUser.js";
import authSeller from "../middlewares/authSeller.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeCodOrder);
orderRouter.get("/user/orders", authUser, getUserOrders);
orderRouter.get("/seller", authSeller, getAllOrders);
orderRouter.post("/stripe", authUser, placeCodOrderStripe);


export default orderRouter;
