"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const method = searchParams.get("method");

  useEffect(() => {
    async function processPaymentSuccess() {
      console.log("Payment success page loaded with method:", method);
      
      const purchasedItems = JSON.parse(localStorage.getItem("purchasedItems") || "[]");
      console.log("Purchased items from localStorage:", purchasedItems);
      
      if (purchasedItems.length === 0) {
        console.log("No items in localStorage, skipping transaction save");
        return;
      }

      // Wait for auth to be ready
      let user = auth.currentUser;
      if (!user) {
        console.log("Waiting for user authentication...");
        await new Promise((resolve) => {
          const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
              user = authUser;
              unsubscribe();
              resolve(authUser);
            }
          });
          // Timeout after 5 seconds
          setTimeout(() => {
            unsubscribe();
            resolve(null);
          }, 5000);
        });
      }

      if (!user) {
        console.error("No user authenticated, cannot save transaction");
        return;
      }

      console.log("Processing transaction for user:", user.uid);

      try {
        // Get user info
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;

        // Calculate total
        const totalAmount = purchasedItems.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        );

        // Save transaction to Firestore
        const transactionData = {
          userId: user.uid,
          username: userData?.username || "Unknown",
          userEmail: userData?.email || user.email || "Unknown",
          items: purchasedItems.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
          totalAmount: totalAmount,
          paymentMethod: method || "unknown",
          status: "completed",
          timestamp: serverTimestamp(),
          date: new Date().toLocaleString(),
        };

        console.log("Saving transaction:", transactionData);
        await addDoc(collection(db, "transactions"), transactionData);
        console.log("Transaction saved successfully");

        // Update inventory quantities
        console.log("Updating inventory quantities...");
        for (const item of purchasedItems) {
          const itemRef = doc(db, "items", item.id);
          const itemSnap = await getDoc(itemRef);
          if (itemSnap.exists()) {
            const currentQuantity = itemSnap.data().quantity || 0;
            const newQuantity = Math.max(0, currentQuantity - item.quantity);
            console.log(`Updating ${item.name}: ${currentQuantity} -> ${newQuantity}`);
            await updateDoc(itemRef, { quantity: newQuantity });
          }
        }
        console.log("Inventory updated successfully");

        // Clear localStorage after successful save
        localStorage.removeItem("purchasedItems");
        console.log("localStorage cleared");
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    }

    if (method) {
      processPaymentSuccess();
    }
  }, [method]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
          </div>
          <CardTitle className="text-center text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                Thank you for your payment. Your transaction has been completed
                successfully.
              </p>
              {method && (
                <p className="text-sm text-gray-500 overflow-hidden text-ellipsis">
                  Payment method:{" "}
                  <span className="font-semibold">{method}</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" asChild className="w-full">
            <Link href="/Dashboard/UserDashboard">Return to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
