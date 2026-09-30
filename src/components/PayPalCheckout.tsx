"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";

export default function PayPalCheckout({
  productId,
  clientId,
}: {
  productId: string;
  clientId: string;
}) {
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

  if (paid) {
    return (
      <div className="mt-8 border border-green-200 bg-green-50 p-5">
        <p className="font-medium">Payment completed.</p>
        <p className="mt-1 text-sm">Thank you for your purchase.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {error && (
        <p className="mb-4 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <PayPalScriptProvider
        options={{
          clientId,
          currency: "USD",
          intent: "capture",
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            shape: "rect",
            label: "paypal",
          }}
          createOrder={async () => {
            setError("");

            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ productId }),
            });

            const data = await response.json();

            if (!response.ok || !data.id) {
              throw new Error(data.error || "Unable to create order");
            }

            return data.id;
          }}
          onApprove={async (data) => {
            const response = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: data.orderID,
                productId,
              }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
              setError(result.error || "Payment could not be confirmed");
              return;
            }

            setPaid(true);
          }}
          onError={(err) => {
            console.error(err);
            setError("PayPal checkout could not be started.");
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
