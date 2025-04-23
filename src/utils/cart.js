export const getCart = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  };
  
  export const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };
  
  export const addToCart = (item) => {
    const cart = getCart();
    const index = cart.findIndex((i) => i.id === item.id);
  
    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
  
    saveCart(cart);
  };
  
  export const getCartItemCount = () => {
    const cart = getCart();
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };
  
  export const removeFromCart = (id) => {
    const cart = getCart().filter((item) => item.id !== id);
    saveCart(cart);
  };
  
  export const clearCart = () => {
    localStorage.removeItem("cart");
  };
  