const express = require("express");
const router = express.Router();

const {
    checkConnection,
    getAllChecks,
    deleteCheck
} = require("../controller/networkController");

router.get("/", getAllChecks);

router.post("/check", checkConnection);

router.delete("/:id", deleteCheck);

module.exports = router;