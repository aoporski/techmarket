const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Błąd pobierania użytkowników:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    res.json(user);
  } catch (error) {
    console.error("Błąd pobierania użytkownika:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const addNewUser = async (req, res) => {
  try {
    const { username, email, password_hash, first_name, last_name } = req.body;

    if (!username || !email || !password_hash) {
      return res.status(400).json({ message: "Brakuje wymaganych pól" });
    }

    const newUser = await User.addNewUser({
      username,
      email,
      passwordHash: password_hash,
      firstName: first_name,
      lastName: last_name,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Błąd dodawania użytkownika:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const changeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.changeUser(id, req.body);

    if (!updatedUser) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Błąd aktualizacji użytkownika:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.deleteUser(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    res.json({ message: "Użytkownik usunięty", deletedUser });
  } catch (error) {
    console.error("Błąd usuwania użytkownika:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addNewUser,
  changeUser,
  deleteUser,
};
