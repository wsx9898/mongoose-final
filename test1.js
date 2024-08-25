exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { productData: { ...i.productId._doc }, quantity: i.quantity };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart(); // Assuming you have a clearCart method in User model
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};