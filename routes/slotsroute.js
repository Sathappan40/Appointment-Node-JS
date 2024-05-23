import express from 'express'
import {getSlots} from '../controller/availableslotcontroller.js'
const router = express.Router();

router.route("/").get(getSlots)

export { router };
