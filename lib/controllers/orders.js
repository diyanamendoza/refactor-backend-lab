const { Router } = require('express');
const { getById, updateById } = require('../models/Order');
const Order = require('../models/Order');

module.exports = Router()
  .post('/', async (req, res) => {
    const order = await Order.insert({
      product: req.body.product,
      quantity: req.body.quantity
    })
    res.send(order)
  })

  .get('/:id', async (req, res) => {
    const { id } = req.params
    const order = await Order.getById(id)
    res.send(order)
  })

  .get('/', async (req, res) => {
    const orders = await Order.getAll()
    res.send(orders)
  })

  .patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const existingOrder = await getById(id)

      if (!existingOrder) {
        const error = new Error(`Order ${id} not found`);
        error.status = 404;
        throw error;
      }

      const product = req.body.product ?? existingOrder.product;
      const quantity = req.body.quantity ?? existingOrder.quantity;
      const order = await updateById(id, { product, quantity })

      res.json(order);
    } catch (error) {
      next(error);
    }
  })

  .delete('/:id', async (req, res) => {
    const { id } = req.params;

    const order = await Order.deleteById(id)
    res.send(order)
  });
