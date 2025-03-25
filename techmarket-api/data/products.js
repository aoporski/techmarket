const products = [
  {
    name: 'MacBook Pro 16"',
    categoryId: 1, // Laptopy
    description: "Laptop Apple z procesorem M1 Pro, 16GB RAM, 512GB SSD",
    price: 9999.99,
    stockCount: 15,
    brand: "Apple",
    imageUrl: "https://example.com/macbook.jpg",
    isAvailable: true,
    createdAt: "2023-01-15T14:30:00Z",
  },
  {
    name: "Dell XPS 15",
    categoryId: 1,
    description: "Ultrabook Dell XPS z procesorem Intel i9, 32GB RAM, 1TB SSD",
    price: 8499.99,
    stockCount: 10,
    brand: "Dell",
    imageUrl: "https://example.com/dell-xps.jpg",
    isAvailable: true,
    createdAt: "2023-02-01T10:00:00Z",
  },
  {
    name: "iPhone 14 Pro",
    categoryId: 2, // Smartfony
    description: "Flagowy smartfon Apple z 6.1-calowym ekranem OLED i A16 Bionic",
    price: 5999.99,
    stockCount: 20,
    brand: "Apple",
    imageUrl: "https://example.com/iphone14pro.jpg",
    isAvailable: true,
    createdAt: "2023-03-10T12:45:00Z",
  },
  {
    name: "Samsung Galaxy S23 Ultra",
    categoryId: 2,
    description: "Najpotężniejszy smartfon Samsunga z 200MP aparatem i Snapdragonem 8 Gen 2",
    price: 6299.99,
    stockCount: 18,
    brand: "Samsung",
    imageUrl: "https://example.com/galaxy-s23-ultra.jpg",
    isAvailable: true,
    createdAt: "2023-04-05T08:20:00Z",
  },
  {
    name: "Sony WH-1000XM5",
    categoryId: 3, // Audio
    description: "Bezprzewodowe słuchawki z redukcją szumów i 30-godzinną baterią",
    price: 1799.99,
    stockCount: 25,
    brand: "Sony",
    imageUrl: "https://example.com/sony-wh1000xm5.jpg",
    isAvailable: true,
    createdAt: "2023-05-20T16:15:00Z",
  },
  {
    name: "Apple Watch Series 8",
    categoryId: 4, // Smartwatche
    description: "Nowoczesny smartwatch Apple z funkcją EKG i monitorem snu",
    price: 2299.99,
    stockCount: 30,
    brand: "Apple",
    imageUrl: "https://example.com/apple-watch8.jpg",
    isAvailable: true,
    createdAt: "2023-06-12T09:50:00Z",
  },
  {
    name: "Logitech MX Master 3",
    categoryId: 5, // Akcesoria
    description: "Bezprzewodowa mysz komputerowa z ergonomicznym kształtem",
    price: 499.99,
    stockCount: 40,
    brand: "Logitech",
    imageUrl: "https://example.com/mx-master3.jpg",
    isAvailable: true,
    createdAt: "2023-07-08T11:30:00Z",
  },
  {
    name: "Razer BlackWidow V4",
    categoryId: 6, // Klawiatury
    description: "Mechaniczna klawiatura gamingowa z podświetleniem RGB",
    price: 699.99,
    stockCount: 35,
    brand: "Razer",
    imageUrl: "https://example.com/razer-blackwidow.jpg",
    isAvailable: true,
    createdAt: "2023-08-15T14:10:00Z",
  },
  {
    name: 'LG OLED C2 55"',
    categoryId: 7, // Telewizory
    description: "Telewizor OLED 4K HDR z systemem webOS i Dolby Vision",
    price: 6499.99,
    stockCount: 8,
    brand: "LG",
    imageUrl: "https://example.com/lg-oled-c2.jpg",
    isAvailable: true,
    createdAt: "2023-09-01T18:00:00Z",
  },
  {
    name: "PlayStation 5",
    categoryId: 8, // Konsole
    description: "Konsola nowej generacji od Sony z szybkim SSD i wsparciem dla gier 4K",
    price: 2999.99,
    stockCount: 12,
    brand: "Sony",
    imageUrl: "https://example.com/ps5.jpg",
    isAvailable: true,
    createdAt: "2023-10-20T13:40:00Z",
  },
];

module.exports = products;
