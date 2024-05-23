import express from 'express'
import {createAuthentication, fetchAuthentication} from '../controller/authenticationcontroller.js'
const router = express.Router();

router.route("/").post(createAuthentication)
router.route("/login").post(fetchAuthentication)


export { router };