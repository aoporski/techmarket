const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  addNewCategory,
  changeCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", addNewCategory);
router.put("/:id", changeCategory);
router.delete("/:id", deleteCategory);

module.exports = router;