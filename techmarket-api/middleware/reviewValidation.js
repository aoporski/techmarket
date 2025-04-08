const validate = requrire("express-validator");
const { Review } = require("../models/reviewModel");
const { Product } = require("../models/productModel");
const { User } = require("../models/userModel");


const reviewValidation = [
    validate("product_id")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid Product ID")
        .custom(async (value) => {
            const product = await Product.findById(value);
            if (!product) {
                throw new Error("Product not found");
            }
        }),
    validate("user_id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID")
        .custom(async (value) => {
            const user = await User.findById(value);
            if (!user) {
                throw new Error("User not found");
            }
        }),
    validate("rating")
        .notEmpty()
        .withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be an integer between 1 and 5"),
    validate("title")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 100 })
        .withMessage("Title must be less than 100 characters"),
    validate("content")
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ max: 200 })
        .withMessage("Content must be less than 200 characters"),
    validate("pros")
        .notEmpty()
        .withMessage("Pros are required")
        .isArray({ min: 1 })
        .withMessage("Pros must be an array with at least one item"),
    validate("cons")
        .notEmpty()
        .withMessage("Cons are required")
        .isArray({ min: 1 })
        .withMessage("Cons must be an array with at least one item"),
    validate("verified_purchase")
        .isBoolean()
        .withMessage("Verified purchase must be a boolean"),
    validate("likes")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Likes must be a non-negative integer"),
    validate("dislikes")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Dislikes must be a non-negative integer"),
    validate("helpful")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Helpful must be a non-negative integer"),
]
