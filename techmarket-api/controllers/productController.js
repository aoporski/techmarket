const products = require("../data/products");

const getAllProducts = (req, res) => {
  res.json(products);
};

const getProductById = (req, res) => {
  const product = products.find((prod) => prod.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
};

const addNewProduct = (req, res) => {
  const {
    name,
    category,
    description,
    price,
    stockCount,
    brand,
    imageUrl,
    isAvailable,
  } = req.body;

  if (
    !name ||
    !category ||
    !description ||
    !price ||
    !stockCount ||
    !brand ||
    !imageUrl ||
    !isAvailable
  ) {
    return res.status(400, { message: "Fields not filled" });
  }

  const newProduct = {
    id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    name,
    category,
    description,
    price,
    stockCount,
    brand,
    imageUrl,
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

const changeProduct = (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex((p) => p.id === parseInt(id));

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products[productIndex] = { ...products[productIndex], ...req.body };
  res.json(products[productIndex]);
};

const deleteProduct = (req, res) => {
  const { id } = req.params;
  const productIndex = products.findIndex((p) => p.id === parseInt(id));

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products.splice(productIndex, 1);
  res.status(200).json({ message: "Product deleted successfully" });
};

module.exports = {
  getAllProducts,
  getProductById,
  addNewProduct,
  changeProduct,
  deleteProduct,
};
