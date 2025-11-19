const router = require("express").Router();
const { authenticate, authorize, ensureStoreOwner } = require("../middlewares/auth");
const { validate } = require("../middlewares/validation");
const { ratingSchema } = require("../validators/rating");
const ratingController = require("../controllers/ratingController");

// submit or update rating (normal users)
router.post(
  "/stores/:id/rating",
  authenticate,
  validate(ratingSchema),
  ratingController.submitOrUpdateRating
);

// get store ratings (public)
router.get(
  "/stores/:id/ratings",
  ratingController.getStoreRatings
);

// get logged in user's rating for store
router.get(
  "/stores/:id/my-rating",
  authenticate,
  ratingController.getMyRatingForStore
);

// owner-only: list raters + avg rating for a store (owner or admin)
router.get(
  "/owner/stores/:id/ratings",
  authenticate,
  ensureStoreOwner,   // only owner or admin allowed
  ratingController.ownerStoreRatings
);

module.exports = router;
