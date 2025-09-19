"use client";

import { useState, useEffect } from "react";
import styles from './esewa-payment.module.css';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DummyDataResponse } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";



interface EsewaConfig {
  tax_amount: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: number;
  product_delivery_charge: number;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

interface PaymentResponse {
  amount: string;
  esewaConfig: EsewaConfig;
}

export default function EsewaPayment() {
  const searchParams = useSearchParams();
const queryAmount = searchParams.get("amount") || "";

const [amount, setAmount] = useState(queryAmount);
const [productName, setProductName] = useState<string>("");
const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
  const fetchDummyData = async () => {
    try {
      const response = await fetch(`/api/dummy-data?method=esewa${queryAmount ? `&amount=${queryAmount}` : ""}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: DummyDataResponse = await response.json();
      // Always set transactionId (and productName if you want)
      setTransactionId(data.transactionId);
      // Only set amount if not present in query
      if (!queryAmount) setAmount(data.amount);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error fetching dummy data:", errorMessage);

      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Failed to load initial data. Please refresh the page.",
      });
    }
  };
  fetchDummyData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [queryAmount, toast]);


  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "esewa",
          amount,
          transactionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment initiation failed: ${response.statusText}`);
      }

      const paymentData: PaymentResponse = await response.json();
      toast({
        title: "Payment Initiated",
        description: "Redirecting to eSewa payment gateway...",
      });

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      const esewaPayload = {
        amount: paymentData.amount,
        tax_amount: paymentData.esewaConfig.tax_amount,
        total_amount: paymentData.esewaConfig.total_amount,
        transaction_uuid: paymentData.esewaConfig.transaction_uuid,
        product_code: paymentData.esewaConfig.product_code,
        product_service_charge: paymentData.esewaConfig.product_service_charge,
        product_delivery_charge:
          paymentData.esewaConfig.product_delivery_charge,
        success_url: paymentData.esewaConfig.success_url,
        failure_url: paymentData.esewaConfig.failure_url,
        signed_field_names: paymentData.esewaConfig.signed_field_names,
        signature: paymentData.esewaConfig.signature,
      };
      console.log({ esewaPayload });
      Object.entries(esewaPayload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Payment error:", errorMessage);
      setError("Payment initiation failed. Please try again.");
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Payment initiation failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.esewaRoot}>
  <div className={styles.esewaCard}>
    <CardHeader>
      <CardTitle className={styles.esewaTitle}>eSewa Payment</CardTitle>
      <CardDescription>Enter payment details for eSewa</CardDescription>
    </CardHeader>
        <form onSubmit={handlePayment}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (NPR)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                readOnly
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                step="0.01"
                placeholder="Enter amount"
              />
            </div>
            {/*}
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                placeholder="Enter product name"
                maxLength={100}
              />
            </div>
            */}
            
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                value={transactionId}
                readOnly
                onChange={(e) => setTransactionId(e.target.value)}
                required
                placeholder="Enter transaction ID"
                maxLength={50}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !amount || !transactionId}
            >
              {isLoading ? "Processing..." : "Pay with eSewa"}
            </Button>
          </CardFooter>
        </form>
      </div>
    </div>
  );
}
