// this function will take already existing cartItems and the newItem and first find if newItem already existed, if yes then it will loop through all the items and add quantity + 1 for the match item and return item if not match, if the item not exist then it return a items array with quantity : 1
// we always create a new array becuase we want react to re-render the updated item quantity
const addItemToCart = (cartItems, cartItemToAdd) => {
  const existingCartItem = cartItems.find(cartItem => cartItem.id === cartItemToAdd.id)
  if (existingCartItem) {
    return cartItems.map(cartItem => {
      return cartItem.id === cartItemToAdd.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
    })
  }

  return [...cartItems, { ...cartItemToAdd, quantity: 1 }]
}

export {
  addItemToCart
}
