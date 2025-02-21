
import { createContext, useState, useMemo } from "react";


export const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
       
        if (existingItem.quantity >= product.stock) {
          alert("Cannot add more. Out of stock!");
          return prevCart;
        }
        
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
      
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };


  const incrementQuantity = (product) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === product.id) {
          if (item.quantity >= product.stock) {
            alert("Cannot add more. Out of stock!");
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decrementQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.reduce((acc, item) => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
         } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const value = {
    cart,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
