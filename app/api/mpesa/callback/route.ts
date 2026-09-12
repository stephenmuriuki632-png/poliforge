import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function getMetadataValue(
  items: Array<{ Name?: string; Value?: string | number }> | undefined,
  name: string
) {
  const item = items?.find((entry) => entry.Name === name);
  return item?.Value;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("===== M-PESA CALLBACK =====");
    console.log(JSON.stringify(data, null, 2));
    console.log("===========================");

    const stkCallback = data?.Body?.stkCallback;

    if (!stkCallback) {
      return NextResponse.json(
        {
          ResultCode: 1,
          ResultDesc: "Invalid callback structure",
        },
        { status: 400 }
      );
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = Number(stkCallback.ResultCode);
    const resultDesc = String(stkCallback.ResultDesc || "");

    if (!checkoutRequestId) {
      return NextResponse.json(
        {
          ResultCode: 1,
          ResultDesc: "Missing CheckoutRequestID",
        },
        { status: 400 }
      );
    }

    const items = stkCallback.CallbackMetadata?.Item;

    const amount = Number(getMetadataValue(items, "Amount") || 0);
    const receiptNumber = String(
      getMetadataValue(items, "MpesaReceiptNumber") || ""
    );
    const phone = String(
      getMetadataValue(items, "PhoneNumber") || ""
    );

    const { data: result, error } = await supabase.rpc(
      "complete_mpesa_deposit",
      {
        p_checkout_request_id: checkoutRequestId,
        p_receipt_number: receiptNumber,
        p_amount: amount,
        p_phone: phone,
        p_result_code: resultCode,
        p_result_desc: resultDesc,
      }
    );

    if (error) {
      console.error("M-Pesa wallet RPC error:", error);

      return NextResponse.json(
        {
          ResultCode: 1,
          ResultDesc: "Unable to process callback",
        },
        { status: 500 }
      );
    }

    console.log("Wallet deposit result:", result);

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Callback received successfully",
    });
  } catch (error) {
    console.error("M-Pesa callback error:", error);

    return NextResponse.json(
      {
        ResultCode: 1,
        ResultDesc: "Invalid callback",
      },
      { status: 400 }
    );
  }
}
