import express from 'express'
import cors from 'cors'
import sequelize from 'sequelize'

import {router as settingRoute} from './routes/setting_route.js'
import {router as slotsRoute} from './routes/slotsroute.js'
import {router as bookingRoute} from './routes/booking_route.js'
import {router as deleteRoute} from './routes/delete_route.js'
import {router as authenticateRoute} from './routes/authentication_route.js'

const app =express()
app.use(cors());
app.use(express.json());

app.use("/setting", settingRoute);
app.use("/slots", slotsRoute);
app.use("/", bookingRoute);
app.use("/", deleteRoute);
app.use("/authenticate", authenticateRoute);

app.listen(process.env.PORT, () => {
    console.log("Server Running on port", process.env.PORT);
});