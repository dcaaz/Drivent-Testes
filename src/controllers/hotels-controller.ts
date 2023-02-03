import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
//import do hotel service

export async function getHotels(req: AuthenticatedRequest, res: Response){
    const { userId } = req;

    try{

    } catch(error){
        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
          }
      
          if (error.name === 'UnauthorizedError') {
            return res.sendStatus(httpStatus.UNAUTHORIZED);
          }
      
          return res.sendStatus(httpStatus.BAD_REQUEST);
    }

}