const Basket = require('../models/basketModel');

const addToBasket = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    const [item, created] = await Basket.findOrCreate({
      where: { user_id, product_id },
      defaults: { quantity }
    });

    if (quantity < 1) return res.status(400).json({ error: 'Ilość musi być większa od 0' });

    if (!created) {
      item.quantity += quantity;
      await item.save();
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Błąd dodawania do koszyka', details: err });
  }
};

const getBasket = async (req, res) => {
  const { user_id } = req.params;

  try {
    const items = await Basket.findAll({ where: { user_id } });
    res.status(200).json(items);
  } catch (err) {
    res.status(400).json({ error: 'Nie mogę pobrać koszyka', details: err });
  }
};

const updateQuantity = async (req, res) => {
  const { user_id, product_id } = req.params;
  const { quantity } = req.body;
    
  try {
    const item = await Basket.findOne({ where: { user_id, product_id } });

    if (quantity < 1) return res.status(400).json({ error: 'Ilość musi być większa od 0' });
    if (!item) return res.status(404).json({ error: 'Produkt nie znaleziony' });

    item.quantity = quantity;
    await item.save();

    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Błąd aktualizacji ilości', details: err });
  }
};

const removeFromBasket = async (req, res) => {
    const { user_id, product_id } = req.params;
  
    try {
      const deletedCount = await Basket.destroy({ where: { user_id, product_id } });
  
      if (deletedCount === 0) {
        return res.status(404).json({ error: 'Produkt nie znaleziony w koszyku 😢' });
      }
  
      res.status(204).send(); // 🧼 usunięte
    } catch (err) {
      res.status(500).json({ error: 'Błąd podczas usuwania produktu 😵', details: err });
    }
  };
  

module.exports = { addToBasket, getBasket, updateQuantity, removeFromBasket };