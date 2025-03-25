const express = require("express");
const {
  getAllUsers,
  getUserById,
  addNewUser,
  changeUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", addNewUser);
router.put("/:id", changeUser);
router.delete("/:id", deleteUser);

module.exports = router;
