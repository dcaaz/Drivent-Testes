import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getHotelId } from "@/controllers/hotels-controller";

const hotelsRouter = Router();

hotelsRouter.all("/*", authenticateToken);
hotelsRouter.get("/", getHotels);
hotelsRouter.get("/:hotelId", getHotelId);

export { hotelsRouter };
