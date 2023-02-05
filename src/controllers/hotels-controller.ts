import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import hotelService from "@/services/hotels-service";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try {
        const hotels = await hotelService.findALL(userId);
        return res.send(hotels);
        
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }

        if (error.name === 'UnauthorizedError') {
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }

        return res.sendStatus(httpStatus.BAD_REQUEST);
    }

}

export async function getHotelId(req: AuthenticatedRequest, res: Response) {
    const id = Number(req.params.hotelId);
  
    try {
      const hotel = await hotelService.findFirst(id);
      res.status(200).send(hotel);
      return;
    } catch (error) {
      if (error.name === 'NotFoundError') {
        res.sendStatus(httpStatus.NOT_FOUND);
        return;
      }
  
      res.sendStatus(httpStatus.BAD_REQUEST);
      return;
    }
  }