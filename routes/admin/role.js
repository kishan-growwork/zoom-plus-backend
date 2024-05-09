const { body, param } = require("express-validator");
const {
  getRoles,
  getRoleById,
  createRole,
} = require("../../controllers/admin/role");
const { validate } = require("../../helper/helper");

const router = require("express").Router();

router.get("/roles", getRoles);
router.get("/roles/:id", validate([param("id").exists()]), getRoleById);
router.post("/role", validate([body("name").isLength({ min: 2 })]), createRole);

module.exports = router;
