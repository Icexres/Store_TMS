import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Additems = () => {
  const [name, setName] = useState('');
  const [desc,setDesc]=useState('');
  const [quantity, setQuantity] = useState('');
  const [addedDate, setAddedDate] = useState('');
  const [price, setPrice] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await addDoc(collection(db, "items"), {
        name,
        description: desc,
        quantity: Number(quantity),
        addedDate,
        price: Number(price)
      });
      setSuccess('Item added successfully!');
      setName('');
      setDesc('');
      setQuantity('');
      setAddedDate('');
      setPrice('');
    } catch (err: any) {
      setError('Failed to add item: ' + err.message);
    }
  };

  return (
    <div className="max-w-md p-4 bg-black rounded shadow">
      <h2 className="text-xl font-bold mb-4">ADD ITEM</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="date"
          placeholder="Added Date"
          value={addedDate}
          onChange={e => setAddedDate(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Item</button>
      </form>
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

export default Additems;