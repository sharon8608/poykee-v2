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

  if (!response.ok) {
    throw new Error(`PayPal authentication failed: ${response.status}`);
  }

  return (await response.json()).access_token;
}

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Missing product" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const { data: product, error } = await supabase
      .from("products")
      .select("id,title,price,inventory,published")
      .eq("id", productId)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product.published || product.inventory <= 0) {
      return NextResponse.json({ error: "Product unavailable" }, { status: 409 });
    }

    const token = await getPayPalToken();

    const response = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: product.id,
            description: product.title.slice(0, 127),
            amount: {
              currency_code: "USD",
              value: Number(product.price).toFixed(2),
            },
          },
        ],
      }),
      cache: "no-store",
    });

    const order = await response.json();

    if (!response.ok) {
      console.error("PayPal create order:", order);
      return NextResponse.json(
        { error: "Could not create PayPal order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    const message =
      error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: "Checkout error",
        details: message,
      },
      { status: 500 }
    );
  }
}
