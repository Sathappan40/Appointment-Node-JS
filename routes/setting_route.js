import express from 'express'
import {createSetting} from '../controller/settingcontroller.js'
import {authenticateToken} from '../controller/authenticationcontroller.js'
const router = express.Router();

router.route("/").post(authenticateToken, createSetting)

export { router };