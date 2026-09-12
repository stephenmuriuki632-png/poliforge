import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function normalizePhone(phone: string) {
  const value = phone.trim().replace(/\s+/g, "");

  if (/^07\d{8}$/.test(value)) {
    return `254${value.slice(1)}`;
  }

  if (/^01\d{8}$/.test(value)) {
    return `254${value.slice(1)}`;
  }

  if (/^254\d{9}$/.test(value)) {
    return value;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to deposit funds." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const amount = Number(body.amount);
    const phone = normalizePhone(String(body.phone || ""));

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Enter a valid deposit amount." },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Enter a valid Kenyan M-Pesa number." },
        { status: 400 }
      );
    }

    const shortcode = process.env.MPESA_SHORTCODE || "174379";
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;

    if (!passkey || !callbackUrl) {
      return NextResponse.json(
        { error: "M-Pesa server configuration is incomplete." },
        { status: 500 }
      );
    }

    // Find or create the campaign owner's wallet.
    let { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("id, balance")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (walletError) {
      console.error("Wallet lookup error:", walletError);

      return NextResponse.json(
        { error: "Unable to access your wallet." },
        { status: 500 }
      );
    }

    if (!wallet) {
      const { data: createdWallet, error: createWalletError } =
        await supabase
          .from("wallets")
          .insert({
            owner_id: user.id,
            balance: 0,
          })
          .select("id, balance")
          .single();

      if (createWalletError) {
        console.error("Wallet creation error:", createWalletError);

        return NextResponse.json(
          { error: "Unable to create your wallet." },
          { status: 500 }
        );
      }

      wallet = createdWallet;
    }

    const authString = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenResponse = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${authString}`,
        },
        cache: "no-store",
      }
    );

    const tokenText = await tokenResponse.text();

    if (!tokenResponse.ok) {
      console.error("Daraja OAuth error:", tokenText);

      return NextResponse.json(
        { error: "Unable to authenticate with M-Pesa." },
        { status: 502 }
      );
    }

    let tokenData: { access_token?: string };

    try {
      tokenData = JSON.parse(tokenText);
    } catch {
      return NextResponse.json(
        { error: "Invalid M-Pesa authentication response." },
        { status: 502 }
      );
    }

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: "M-Pesa access token was not returned." },
        { status: 502 }
      );
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/\D/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${shortcode}${passkey}${timestamp}`
    ).toString("base64");

    const stkResponse = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(amount),
          PartyA: phone,
          PartyB: shortcode,
          PhoneNumber: phone,
          CallBackURL: callbackUrl,
          AccountReference: "PoliForge",
          TransactionDesc: "PoliForge wallet deposit",
        }),
      }
    );

    const stkText = await stkResponse.text();

    let stkData: {
      ResponseCode?: string;
      ResponseDescription?: string;
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      CustomerMessage?: string;
    };

    try {
      stkData = JSON.parse(stkText);
    } catch {
      console.error("Invalid STK response:", stkText);

      return NextResponse.json(
        { error: "Invalid M-Pesa response." },
        { status: 502 }
      );
    }

    if (
      !stkResponse.ok ||
      stkData.ResponseCode !== "0" ||
      !stkData.CheckoutRequestID
    ) {
      console.error("STK push failed:", stkData);

      return NextResponse.json(
        {
          error:
            stkData.CustomerMessage ||
            stkData.ResponseDescription ||
            "Unable to start M-Pesa payment.",
        },
        { status: 400 }
      );
    }

    // Save the payment as pending.
    const { error: transactionError } = await supabase
      .from("wallet_transactions")
      .insert({
        wallet_id: wallet.id,
        submission_id: stkData.CheckoutRequestID,
        type: "deposit",
        amount: Math.round(amount),
        status: "Pending",
        description: "M-Pesa wallet deposit",
      });

    if (transactionError) {
      console.error("Pending transaction error:", transactionError);

      return NextResponse.json(
        {
          error:
            "M-Pesa request was accepted, but the pending transaction could not be recorded.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        stkData.CustomerMessage ||
        "M-Pesa payment request sent to your phone.",
      checkoutRequestId: stkData.CheckoutRequestID,
    });
  } catch (error) {
    console.error("STK push error:", error);

    return NextResponse.json(
      { error: "Unable to start M-Pesa payment." },
      { status: 500 }
    );
  }
}
