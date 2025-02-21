import { useState, useEffect, useContext } from "react";
import {
  AiOutlineShoppingCart,
  AiOutlinePlus,
  AiOutlineMinus,
} from "react-icons/ai";
import { CartContext } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";

const PRICE_RANGES = [
  { label: "All", value: "" },
  { label: "0 - 250", value: "0-250" },
  { label: "251 - 450", value: "251-450" },
  { label: "451 - 850", value: "451-850" },
];

//Home
export default function Home() {
  const { cart, addToCart, incrementQuantity, decrementQuantity } =
    useContext(CartContext);

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [focusOn, setFocusOn] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value !== "") {
      setFocusOn(true);
    } else {
      setFocusOn(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (
      colorFilter &&
      product.color.toLowerCase() !== colorFilter.toLowerCase()
    ) {
      return false;
    }

    if (
      genderFilter &&
      product.gender.toLowerCase() !== genderFilter.toLowerCase()
    ) {
      return false;
    }

    if (typeFilter && product.type.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }

    if (priceFilter) {
      const [min, max] = priceFilter.split("-").map(Number);
      const price = product.price;
      if (price < min || price > max) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 shadow-md bg-gray-200">
        <h1 className="text-xl font-bold">TeeRex Store</h1>
        <button
          onClick={handleCartClick}
          className="relative text-3xl text-gray-700"
        >
          <AiOutlineShoppingCart />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </header>

      <div className="flex flex-1 pl-3">
        <aside className="hidden sm:block w-64 p-4 border-r border-gray-100">
          <h2 className="font-bold mb-2">Colour</h2>
          <ul className="mb-4 space-y-1">
            <li>
              <input
                type="radio"
                name="color"
                value=""
                checked={colorFilter === ""}
                onChange={(e) => setColorFilter(e.target.value)}
              />
              <span className="ml-2">All</span>
            </li>
            {["Red", "Blue", "Green", "Pink", "Black", "White"].map((col) => (
              <li key={col}>
                <input
                  type="radio"
                  name="color"
                  value={col}
                  checked={colorFilter === col}
                  onChange={(e) => setColorFilter(e.target.value)}
                />
                <span className="ml-2">{col}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-bold mb-2">Gender</h2>
          <ul className="mb-4 space-y-1">
            <li>
              <input
                type="radio"
                name="gender"
                value=""
                checked={genderFilter === ""}
                onChange={(e) => setGenderFilter(e.target.value)}
              />
              <span className="ml-2">All</span>
            </li>
            {["Men", "Women", "Unisex"].map((gen) => (
              <li key={gen}>
                <input
                  type="radio"
                  name="gender"
                  value={gen}
                  checked={genderFilter === gen}
                  onChange={(e) => setGenderFilter(e.target.value)}
                />
                <span className="ml-2">{gen}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-bold mb-2">Price</h2>
          <ul className="mb-4 space-y-1">
            {PRICE_RANGES.map((range) => (
              <li key={range.value}>
                <input
                  type="radio"
                  name="price"
                  value={range.value}
                  checked={priceFilter === range.value}
                  onChange={(e) => setPriceFilter(e.target.value)}
                />
                <span className="ml-2">{range.label}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-bold mb-2">Type</h2>
          <ul className="space-y-1">
            <li>
              <input
                type="radio"
                name="type"
                value=""
                checked={typeFilter === ""}
                onChange={(e) => setTypeFilter(e.target.value)}
              />
              <span className="ml-2">All</span>
            </li>
            {["Polo", "Hoodie", "Basic", "Round"].map((typ) => (
              <li key={typ}>
                <input
                  type="radio"
                  name="type"
                  value={typ}
                  checked={typeFilter === typ}
                  onChange={(e) => setTypeFilter(e.target.value)}
                />
                <span className="ml-2">{typ}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-10">
          {loading && <p className="text-center">Loading products...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="mb-4">
              <input //searchBar
                type="search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search for products..."
                className="border rounded-md border-gray-300 px-4 py-2 w-full"
              />
              {!focusOn && (
                <IoMdSearch className="absolute top-29 right-15" size={20} />
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {!loading &&
              !error &&
              (filteredProducts.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">
                  No products found.
                </p>
              ) : (
                filteredProducts.map((product) => {
                  const stock = product.quantity || 0;
                  const cartItem = cart.find((item) => item.id === product.id);
                  const isOutOfStock =
                    stock === 0 || (cartItem && cartItem.quantity >= stock);

                  return (
                    <div
                      key={product.id}
                      className="border-1 border-blue-100 bg-blue-100 rounded-lg p-4 flex flex-col hover:shadow-xl hover:scale-103  transition duration-300 ease-in-out"
                    >
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="mb-2 h-32 object-contain"
                      />
                      <h2 className="text-lg font-semibold">{product.name}</h2>
                      <p className="text-gray-600">Rs. {product.price}</p>
                      {cartItem ? (
                        <div className="flex items-center justify-end mt-auto">
                          <button
                            onClick={() => decrementQuantity(product.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            <AiOutlineMinus />
                          </button>
                          <span className="mx-2">{cartItem.quantity}</span>
                          <button
                            onClick={() => incrementQuantity(product)}
                            className={`bg-green-500 text-white px-2 py-1 rounded ${
                              cartItem.quantity >= stock
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={cartItem.quantity >= stock}
                          >
                            <AiOutlinePlus />
                          </button>
                        </div>
                      ) : isOutOfStock ? (
                        <button
                          className="bg-gray-300 text-white mt-auto px-4 py-2 rounded cursor-not-allowed"
                          disabled
                        >
                          Out of Stock
                        </button>
                      ) : (
                        <button
                          className="bg-blue-500 text-white mt-auto px-4 py-2 rounded"
                          onClick={() => addToCart({ ...product, stock })}
                        >
                          Add to cart
                        </button>
                      )}
                    </div>
                  );
                })
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}
