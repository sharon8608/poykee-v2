import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PAYPAL_BASE = "https://api-m.sandbox.paypal.com";

async function getPayPalToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) throw new Error("PayPal authentication failed");

  return (await response.json()).access_token;
}

export async function POST(request: Request) {
  try {
    const { orderId, productId } = await request.json();

    if (!orderId || !productId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const token = await getPayPalToken();

    const response = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const capture = await response.json();

    if (!response.ok || capture.status !== "COMPLETED") {
      console.error("PayPal capture:", capture);
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Verify that PayPal's order is actually for this product.
    const referenceId = capture.purchase_units?.[0]?.reference_id;

    if (referenceId !== productId) {
      return NextResponse.json({ error: "Product mismatch" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const { error } = await supabase
      .from("products")
      .update({
        inventory: 0,
        published: false,
      })
      .eq("id", productId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      orderId: capture.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Capture error" }, { status: 500 });
  }
}
