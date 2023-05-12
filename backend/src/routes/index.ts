import { Router } from "express"
import mideaRoutes from "./mideas.router" 


const routes = Router()


routes.use("/mideas",mideaRoutes)



export default routes