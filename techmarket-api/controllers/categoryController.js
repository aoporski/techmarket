const Category = require("../models/categoryModel");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Błąd pobierania kategorii:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Nieprawidłowe ID kategorii" });
    }

    const category = await Category.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: "Kategoria nie znaleziona" });
    }

    res.json(category);
  } catch (error) {
    console.error("Błąd pobierania kategorii:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const addNewCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nazwa jest wymagana" });
    }

    const newCategory = await Category.addNewCategory({ name, description });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Błąd dodawania kategorii:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const changeCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Nieprawidłowe ID kategorii" });
    }

    const { name, description } = req.body;
    const updated = await Category.changeCategory(id, { name, description });

    if (!updated) {
      return res.status(404).json({ message: "Kategoria nie znaleziona" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Błąd aktualizacji kategorii:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Nieprawidłowe ID kategorii" });
    }

    const deleted = await Category.deleteCategory(id);

    if (!deleted) {
      return res.status(404).json({ message: "Kategoria nie znaleziona" });
    }

    res.json({ message: "Kategoria usunięta", deleted });
  } catch (error) {
    console.error("Błąd usuwania kategorii:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  addNewCategory,
  changeCategory,
  deleteCategory,
};


// const Category = require("../models/categoryModel");

// const getAllCategories = async (req, res) => {
//   try {
//     const categories = await Category.getAllCategories();
//     res.json(categories);
//   } catch (error) {
//     console.error("Błąd pobierania kategorii:", error);
//     res.status(500).json({ message: "Błąd serwera" });
//   }
// };

// const getCategoryById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const category = await Category.getCategoryById(id);

//     if (!category) {
//       return res.status(404).json({ message: "Kategoria nie znaleziona" });
//     }

//     res.json(category);
//   } catch (error) {
//     console.error("Błąd pobierania kategorii:", error);
//     res.status(500).json({ message: "Błąd serwera" });
//   }
// };

// const addNewCategory = async (req, res) => {
//   try {
//     const { name, description } = req.body;

//     if (!name) {
//       return res.status(400).json({ message: "Nazwa jest wymagana" });
//     }

//     const newCategory = await Category.addNewCategory({ name, description });
//     res.status(201).json(newCategory);
//   } catch (error) {
//     console.error("Błąd dodawania kategorii:", error);
//     res.status(500).json({ message: "Błąd serwera" });
//   }
// };

// const changeCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description } = req.body;

//     const updated = await Category.changeCategory(id, { name, description });

//     if (!updated) {
//       return res.status(404).json({ message: "Kategoria nie znaleziona" });
//     }

//     res.json(updated);
//   } catch (error) {
//     console.error("Błąd aktualizacji kategorii:", error);
//     res.status(500).json({ message: "Błąd serwera" });
//   }
// };

// const deleteCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Category.deleteCategory(id);

//     if (!deleted) {
//       return res.status(404).json({ message: "Kategoria nie znaleziona" });
//     }

//     res.json({ message: "Kategoria usunięta", deleted });
//   } catch (error) {
//     console.error("Błąd usuwania kategorii:", error);
//     res.status(500).json({ message: "Błąd serwera" });
//   }
// };

// module.exports = {
//   getAllCategories,
//   getCategoryById,
//   addNewCategory,
//   changeCategory,
//   deleteCategory,
// };
