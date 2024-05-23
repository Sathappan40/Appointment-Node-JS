import express from 'express'
import {createBooking, getActive, getHistory} from '../controller/bookingcontroller.js'
const router = express.Router();

router.route("/history").get(getHistory)
router.route("/active").get(getActive)
router.route("/booking").post(createBooking)

export { router };