import express from 'express'
import {deleteBooking, fetchSlots} from '../controller/deletecontroller.js'
const router = express.Router();

router.route("/delete").delete(deleteBooking)
router.route("/fetch").get(fetchSlots)

export { router };