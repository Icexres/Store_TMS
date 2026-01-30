import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Transaction } from '@/lib/types';

type Props = {
  role: "admin" | "user";
};

const TransactionHistory: React.FC<Props> = ({ role }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchTransactions() {
      if (!currentUserId) return;
      
      try {
        let q;
        if (role === "admin") {
          // Admin sees all transactions
          q = query(collection(db, "transactions"), orderBy("timestamp", "desc"));
        } else {
          // User sees only their transactions
          q = query(
            collection(db, "transactions"),
            where("userId", "==", currentUserId),
            orderBy("timestamp", "desc")
          );
        }
        
        const querySnapshot = await getDocs(q);
        const transactionsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];
        
        setTransactions(transactionsList);
      } catch (err) {
        console.error("Error fetching transactions: ", err);
      }
      setLoading(false);
    }
    
    if (currentUserId) {
      fetchTransactions();
    }
  }, [role, currentUserId]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div>Loading transaction history...</div>;

  if (transactions.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <p className="text-gray-400">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      <table className="min-w-full bg-black border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Transaction ID</th>
            <th className="py-2 px-4 border">Date</th>
            {role === "admin" && <th className="py-2 px-4 border">User</th>}
            <th className="py-2 px-4 border">Total Amount</th>
            <th className="py-2 px-4 border">Payment Method</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Items</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <tr className="hover:bg-gray-800">
                <td className="py-2 px-4 border text-xs">{transaction.id}</td>
                <td className="py-2 px-4 border">{transaction.date}</td>
                {role === "admin" && (
                  <td className="py-2 px-4 border">
                    <div>{transaction.username}</div>
                    <div className="text-xs text-gray-400">{transaction.userEmail}</div>
                  </td>
                )}
                <td className="py-2 px-4 border font-bold">Rs.{transaction.totalAmount}</td>
                <td className="py-2 px-4 border capitalize">{transaction.paymentMethod}</td>
                <td className="py-2 px-4 border">
                  <span className={`px-2 py-1 rounded text-xs ${
                    transaction.status === 'completed' ? 'bg-green-600' :
                    transaction.status === 'pending' ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => toggleExpand(transaction.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                  >
                    {expandedId === transaction.id ? 'Hide' : 'View'}
                  </button>
                </td>
              </tr>
              {expandedId === transaction.id && (
                <tr>
                  <td colSpan={role === "admin" ? 7 : 6} className="py-2 px-4 border bg-gray-900">
                    <div className="p-4">
                      <h4 className="font-bold mb-2">Items Purchased:</h4>
                      <table className="w-full">
                        <thead>
                          <tr className="text-left">
                            <th className="pr-4">Item Name</th>
                            <th className="pr-4">Price</th>
                            <th className="pr-4">Quantity</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transaction.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="pr-4">{item.name}</td>
                              <td className="pr-4">Rs.{item.price}</td>
                              <td className="pr-4">{item.quantity}</td>
                              <td>Rs.{item.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
