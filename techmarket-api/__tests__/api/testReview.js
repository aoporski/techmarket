const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

const User = require("../../models/userSchema");
const Product = require("../../models/productSchema");
const Review = require("../../models/reviewSchema");

describe("MongoDB Reviews API", () => {
  let userId, productId;

  beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await Review.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    const user = await User.create({
      username: "tester",
      email: "test@example.com",
      passwordHash: "hashedpassword123",
      first_name: "Jan",
      last_name: "Kowalski",
    });

    const product = await Product.create({
      name: "Laptop",
      description: "Mocny laptop do pracy",
      price: 4999.99,
      stock_count: 15,
      brand: "TechBrand",
      image_url: "https://example.com/laptop.png",
      is_available: true,
      category_id: new mongoose.Types.ObjectId(),
    });

    userId = user._id;
    productId = product._id;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("POST /api/reviews - powinno dodać recenzję", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .send({
        product_id: productId,
        user_id: userId,
        rating: 5,
        title: "Rewelacyjny sprzęt",
        content: "Świetna wydajność i solidna obudowa",
        pros: ["Wydajność", "Obudowa"],
        cons: ["Cena"],
        verified_purchase: true,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.rating).toBe(5);
  });

  it("GET /api/reviews/product/:productId - powinno zwrócić recenzje produktu", async () => {
    await Review.create({
      product_id: productId,
      user_id: userId,
      rating: 4,
      title: "Dobry sprzęt",
      content: "Jest OK, ale głośny wiatrak",
      pros: ["Dobra jakość"],
      cons: ["Hałas"],
      verified_purchase: true,
      likes: 1,
    });

    const res = await request(app).get(`/api/reviews/product/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.reviews.length).toBe(1);
  });

  it("GET /api/reviews/search?q=dobry - powinno znaleźć po tekście", async () => {
    await Review.create({
      product_id: productId,
      user_id: userId,
      rating: 3,
      title: "Dobry produkt",
      content: "Polecam serdecznie!",
      pros: ["Wygląd"],
      cons: ["Cena"],
      verified_purchase: false,
    });

    const res = await request(app).get("/api/reviews/search?q=dobry");
    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBe(1);
  });

  it("POST /api/reviews/:id/vote - powinno zwiększyć liczbę pomocnych głosów", async () => {
    const review = await Review.create({
      product_id: productId,
      user_id: userId,
      rating: 5,
      title: "Mega sprzęt",
      content: "Szybki i elegancki",
      pros: ["Design", "Prędkość"],
      cons: [],
      verified_purchase: true,
    });

    const res = await request(app).post(`/api/reviews/${review._id}/vote`);
    expect(res.statusCode).toBe(200);
    expect(res.body.updatedHelpfulVotes || res.body.updatedLikes).toBe(1);
  });
});
