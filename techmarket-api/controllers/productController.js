const Product = require("../models/productModel");

const getAllProducts = async (req, res) => {
  try {
    const filters = {
      sortBy: req.query.sortBy,
      isAvailable: req.query.isAvailable,
    };

    const products = await Product.getAllProducts(filters);
    res.json(products);
  } catch (error) {
    console.error("Błąd pobierania produktów:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Produkt nie znaleziony" });
    }

    res.json(product);
  } catch (error) {
    console.error("Błąd pobierania produktu:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const addNewProduct = async (req, res) => {
  try {
    console.log("Received product data:", req.body);

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

    if (!name || !category || !description || price === undefined || stockCount === undefined || !brand || !imageUrl) {
      return res.status(400).json({ message: "Pola nie są wypełnione poprawnie" });
    }

    const newProduct = await Product.addNewProduct({
      name,
      category,
      description,
      price: parseFloat(price),
      stockCount: parseInt(stockCount),
      brand,
      imageUrl,
      isAvailable: isAvailable ?? true,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Błąd dodawania produktu:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const changeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.changeProduct(id, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ message: "Produkt nie znaleziony" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Błąd aktualizacji produktu:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.deleteProduct(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Produkt nie znaleziony" });
    }

    res.status(200).json({ message: "Produkt usunięty", deletedProduct });
  } catch (error) {
    console.error("Błąd usuwania produktu:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addNewProduct,
  changeProduct,
  deleteProduct,
};
