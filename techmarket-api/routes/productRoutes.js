const express = require("express");
const {
  getAllProducts,
  getProductById,
  addNewProduct,
  changeProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.post("/", addNewProduct);

router.put("/:id", changeProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
