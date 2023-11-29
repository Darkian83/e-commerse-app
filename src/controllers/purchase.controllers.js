const catchError = require("../utils/catchError");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Image = require("../models/Image");
const Cart = require("../models/Cart");

const getAll = catchError(async (req, res) => {
  const userId = req.user.id;
  const purchases = await Purchase.findAll({
    where: { userId: userId },

    include: [
      {
        model: Product,
        include: [Image],
      },
    ],
    where: { userId: req.user.id },
  });

  return res.json(purchases);
});

const create = catchError(async (req, res) => {
  const result = await Cart.findAll({
    where: { userId: req.user.id },
  });
  const purchases = result.map((cart) => {
    return {
      quantity: cart.quantity,
      productId: cart.productId,
      userId: req.user.id,
    };
  });
  await Purchase.bulkCreate(purchases);

  await Cart.destroy({
    where: { userId: req.user.id },
  });

  return res.json({ message: "Purchase completed" });
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await Purchase.destroy({ where: { id } });
  return res.sendStatus(204);
});

module.exports = {
  getAll,
  create,
  remove,
};
