import { useContext } from "react";
import { CartContext } from "../context/cartContext";
import { HiOutlineTrash, HiPlus, HiMinus } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function ShoppingCart() {
  const {
    cart,
    removeFromCart,
    totalPrice,
    incrementQuantity,
    decrementQuantity,
  } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCloseCart = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-100 shadow-lg">
        <h2 className="text-2xl font-bold">Your Cart</h2>
        <button onClick={handleCloseCart} className="text-gray-600 text-2xl">
          &times;
        </button>
      </div>

      {/* Main Content */}
      <div className="flex justify-between flex-1 flex-col md:flex-row">
        {/* Left: Product Cards */}
        <div className="p-4 overflow-auto">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 m-5 lg:grid-cols-4 gap-5">
              {cart.map((item) => {
                const stock = item.stock || 0;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col items-center border rounded-lg border-none shadow p-4 hover:shadow-xl hover:scale-103 hover:bg-green-100 transition duration-300 ease-in-out bg-white"
                  >
                    <img
                      src={item.imageURL}
                      alt={item.name}
                      className="w-full h-36 object-contain rounded"
                    />

                    <div className="w-full text-center mt-4">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">Rs. {item.price}</p>
                    </div>

                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="bg-gray-300 p-1 rounded hover:bg-gray-400 transition duration-300"
                      >
                        <HiMinus size={20} />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item)}
                        className={`bg-gray-300 p-1 rounded hover:bg-gray-400 transition duration-300 ${
                          item.quantity >= stock
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={item.quantity >= stock}
                      >
                        <HiPlus size={20} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 mt-2 hover:text-red-800 transition duration-300"
                    >
                      <HiOutlineTrash
                        size={25}
                        className="font-medium bg-white border-none rounded-full"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="w-full md:w-1/3 p-4 mt-10 border-t mr-10 md:border-t-0 md:border-l rounded-lg border-gray-200 bg-white">
          <h3 className="text-xl font-bold mb-4">Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold">Rs. {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Shipping:</span>
              <span className="font-semibold">Rs. 0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Tax:</span>
              <span className="font-semibold">Rs. 0</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold">
                Rs. {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
          <button className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition duration-300">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
