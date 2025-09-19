import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number; // available quantity in DB
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number; // quantity selected for checkout
  maxQuantity: number; // available quantity in DB
};

const Transaction = () => {
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]); // array of objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => { 
    async function fetchItems() {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const itemsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          price: Number(doc.data().price),
          quantity: Number(doc.data().quantity),
        }));
        setAvailableItems(itemsList);
      } catch (err) {
        alert("Error fetching items: " + err);
      }
      setLoading(false);
    }
    fetchItems();
  }, []);

  const addToCart = (item: Item) => {
    setCart([...cart, { ...item, quantity: 1, maxQuantity: item.quantity }]);
    setError("");
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    setError("");
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(cart =>
      cart.map(item =>
        item.id === id
          ? {
              ...item,
              quantity:
                quantity > item.maxQuantity
                  ? item.maxQuantity
                  : Math.max(1, quantity),
            }
          : item
      )
    );
    // Show error if exceeded
    const cartItem = cart.find(item => item.id === id);
    if (cartItem && quantity > cartItem.maxQuantity) {
      setError(`Cannot exceed available quantity (${cartItem.maxQuantity}) for ${cartItem.name}`);
    } else {
      setError("");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <div>Loading items...</div>;

  return (
    <div className="w-[800px] p-4 bg-black rounded shadow">
      <h2 className="text-xl font-bold mb-4">Transaction / Checkout</h2>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Available Items</h3>
        <ul>
          {availableItems.map(item => (
            <li key={item.id} className="flex justify-between items-center mb-2">
              <span>
                {item.name} - Rs.{item.price} (Available: {item.quantity})
              </span>
              <button
                onClick={() => addToCart(item)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
                disabled={cart.some(cartItem => cartItem.id === item.id)}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Selected for Checkout</h3>
        {cart.length === 0 ? (
          <p>No items selected.</p>
        ) : (
          <table className="min-w-full bg-black border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Price</th>
                <th className="py-2 px-4 border">Quantity</th>
                <th className="py-2 px-4 border">Total</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border">{item.name}</td>
                  <td className="py-2 px-4 border">Rs.{item.price}</td>
                  <td className="py-2 px-4 border">
                    <input
                      type="number"
                      min={1}
                      max={item.maxQuantity}
                      value={item.quantity}
                      onChange={e => updateQuantity(item.id, Number(e.target.value))}
                      className="w-16 p-1 border rounded"
                    />
                    <span className="ml-2 text-xs text-gray-400">
                      / {item.maxQuantity} available
                    </span>
                  </td>
                  <td className="py-2 px-4 border">Rs.{item.price * item.quantity}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="mt-4 font-bold">Total: Rs.{total}</div>
        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => window.location.href = `/payment-method?amount=${total}`}
          disabled={cart.length === 0}
        >
          Payment Methods
        </button>
        {/* Add a checkout button and logic here if needed */}
      </div>
    </div>
  );
};

export default Transaction;
