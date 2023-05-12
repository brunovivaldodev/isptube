import { NextFunction, Request, Response } from "express";

export function progress_middleware(req : Request, res : Response, next : NextFunction){
    let progress = 0;
    const file_size = req.headers["content-length"];

    if(!file_size) {
        throw new Error("sdds")
    }
    
    // set event listener
    req.on("data", (chunk) => {
        progress += chunk.length;
        const percentage = (progress / parseInt(file_size)) * 100;
        
        console.log(percentage)
    });

    // invoke next middleware
    next();
}
