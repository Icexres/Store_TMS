import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs,doc, updateDoc, deleteDoc } from 'firebase/firestore';

type Item = {
  id: string;
  name?: string;
  description?: string;
  quantity?: number;
  addedDate?: string;
  price?: number;
};

type Props = {
  role: "admin" | "user";
};

const ViewItems: React.FC<Props> = ({ role }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editID, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Item>>({});

  useEffect(() => {
    async function fetchItems() {
      try {
        const querySnapshot = await getDocs(collection(db, "items"));
        const itemsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(itemsList);
      } catch (err) {
        console.error("Error fetching items: ", err);
      }
      setLoading(false);
    }
    fetchItems();
  }, []);

  const handleEditClick = (item: Item) => {
    setEditId(item.id);
    setEditData({
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      description: item.description,
    });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({
      ...editData, // copies previous values
      [e.target.name]: e.target.value, //updates the field based on [name] attribute on each input field edit is first done in local variable through which it is updatede in firebasse 
    });
  };

  const handleEditSave = async (id: string) => { //local edits are then made into firebase
    try {
      await updateDoc(doc(db, "items", id), {
        quantity: Number(editData.quantity),
        price: Number(editData.price),
        name: editData.name,
        description: editData.description,
      });
      setItems(items => //state is updated to reflect changes without needing to refetch from firebase
        items.map(item =>
          item.id === id ? { 
            ...item,
            quantity: Number(editData.quantity), 
            price: Number(editData.price), 
            name: editData.name, 
            description: editData.description } : item
        )
      );
      setEditId(null);
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  }

  const handleDelete = async (id: string) => {
  try {
    await deleteDoc(doc(db, "items", id));
    setItems(items => items.filter(item => item.id !== id));
  } catch (error) {
    console.error("Error deleting item: ", error);
  }
};

  if (loading) return <div>Loading items...</div>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Items List</h2>
      <table className="min-w-full bg-black border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Quantity</th>
            <th className="py-2 px-4 border">Added Date</th>
            <th className="py-2 px-4 border">Price</th>
            {role === "admin" && <th className="py-2 px-4 border">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item: Item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border">{editID === item.id ?(
                <input
                  type="text"
                  name="name"
                  value={editData.name ?? ""}
                  onChange={handleEditChange}
                  className='w-16'
                />
              ) : (
                item.name
              )}
              </td>
              <td className="py-2 px-4 border">{editID === item.id ?(
                <input
                  type="text"
                  name="description"
                  value={editData.description ?? ""}
                  onChange={handleEditChange}
                  className='w-16'
                />
              ) : (
                item.description
              )}
              </td>
              <td className="py-2 px-4 border">
                {editID === item.id ? (
                  <input
                    type="number"
                    name="quantity"
                    value={editData.quantity ?? ""}
                    onChange={handleEditChange}
                    className="w-16"
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td className="py-2 px-4 border">{item.addedDate}</td>
              <td className="py-2 px-4 border">
                {editID === item.id ? (
                  <input
                    type="number"
                    name="price"
                    value={editData.price ?? ""}
                    onChange={handleEditChange}
                    className="w-16"
                  />
                ) : (
                  item.price
                )}
              </td>
              {role === "admin" && (
                <td className="py-2 px-4 border">
                  {editID === item.id ? (
                    <>
                      <button
                        onClick={() => handleEditSave(item.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (<>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-2 py-1 ml-1 rounded"
                    >
                      Delete
                    </button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewItems;