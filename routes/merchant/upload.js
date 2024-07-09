const { uploadS3Api } = require("../../controllers/merchant/upload");
const { validate } = require("../../helper/helper");
const { verifyAuth } = require("../../middleware/auth");

const router = require("express").Router();

// router.post("/upload",verifyAuth, uploadS3Api);
router.post("/upload", verifyAuth, uploadS3Api);

module.exports = router;
