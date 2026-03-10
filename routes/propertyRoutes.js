const express = require("express")

const router = express.Router()

const {

registerProperty,
transferOwnership,
getProperty,
getHistory

} = require("../controllers/propertyController")

router.post("/register",registerProperty)

router.post("/transfer",transferOwnership)

router.get("/:id",getProperty)

router.get("/history/:id",getHistory)

module.exports = router