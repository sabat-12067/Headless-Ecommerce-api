const Cart = require('../models/cart');

const addItemToCart = (req, res) => {
    const { cartItemInfo, userId } = req.body;
    try {
        Cart.create({
            cartItemInfo, userId
        }, (err, cartItem) => {
            if (err) {
             console.log(err);
                res.status(500).json({
                    message: 'Error occured while creating cart',
                });
            } else {
                res.status(201).json({
                    message: 'Your cart has been updated successfully!',
                    cart: cartItem
                });
            }
            console.log('addToItemToCart function called');
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error occured while adding item to cart',
        });

    }
   };

   const getAllCartItems = (req, res) => {
    const { userId } = req.body;
    //console.log(userId);
    try {
        Cart.find({ userId }, (err, cartItems) => {
            if (err) {
                res.status(500).json({
                    message: 'Error occured while getting cart items',
                });
            } else {
                res.status(200).json({
                    message: 'Cart items retrieved successfully!',
                    cart: cartItems,
                    numberOfItems: cartItems.length
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error occured while getting cart items',
        });
    }
   };


   const deleteItemFromCart = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
       
     const deletedCartItem = await Cart.findOneAndDelete({ _id: id, userId });
       
     if (!deletedCartItem) {
            res.status(404).json({
                message: 'Cart item not found',
            });
        } else {
            res.status(200).json({
                message: 'Cart item deleted successfully!',
                cart: deletedCartItem
            });
        }

    } catch (err) {
        res.status(500).json({
            message: 'Error occured while deleting cart item',
        });
    }
   };



// const cart = async (req, res) => {
//   try {

//     const cart = await Cart.findOne({ user: req.user._id });
//     if (!cart) {
//       return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No cart found' });
//     }

//     res.status(StatusCodes.OK).json(cart);
//   } catch (error) {
//     next(error);
//   }

module.exports = {
 addItemToCart,
 deleteItemFromCart,
 getAllCartItems
}