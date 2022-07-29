const express = require("express");
const Restaurant = require("../models/restaurant");
const { createUserJwt } = require("../utils/tokens");
const security = require("../middleware/security");
const router = express.Router();

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    let { id } = res.locals.user;
    const restaurant = await Restaurant.listRests(id);
    return res.status(201).json({ restaurant: restaurant });
  } catch (err) {
    next(err);
  }
});

router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    let { id } = res.locals.user;

    const restaurant = req.body;
    const restaurants = await Restaurant.PostRests(restaurant, id);
    return res.status(201).json({ restaurant: restaurants });
  } catch (err) {
    next(err);
  }
});

router.put(
  "/restaurant/:id",
  security.requireAuthenticatedUser,
  async (req, res, next) => {
    try {
      let { id } = res.locals.user;
      const restaurant = req.body;
      const restaurants = await Restaurant.PostRests(restaurant, id);
      return res.status(201).json({ restaurant: restaurants });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
