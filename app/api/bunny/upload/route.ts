import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const runtime = "nodejs";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const BUNNY_LIBRARY_ID =
  process.env.BUNNY_VIDEO_LIBRARY_ID!;

const BUNNY_API_KEY =
  process.env.BUNNY_VIDEO_API_KEY!;

export async function POST(request: Request) {
  try {
    console.log("=== BUNNY ROUTE START ===");

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error(
        "Supabase environment variables are missing."
      );
    }

    if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
      throw new Error(
        "Bunny environment variables are missing."
      );
    }

    const authorization =
      request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        { error: "Missing authorization." },
        { status: 401 }
      );
    }

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_KEY,
      {
        global: {
          headers: {
            Authorization: authorization,
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (authError || !user) {
      console.error("AUTH ERROR:", authError);

      return NextResponse.json(
        {
          error:
            authError?.message ||
            "You must be signed in.",
        },
        { status: 401 }
      );
    }

    console.log("AUTH USER:", user.id);

    const body = await request.json();

    const campaignId = body?.campaignId;
    const title = body?.title;

    if (!campaignId || !title?.trim()) {
      return NextResponse.json(
        {
          error:
            "Campaign ID and title are required.",
        },
        { status: 400 }
      );
    }

    const {
      data: campaign,
      error: campaignError,
    } =
      await supabase
        .from("campaigns")
        .select("id, owner_id")
        .eq("id", campaignId)
        .maybeSingle();

    if (campaignError) {
      console.error(
        "CAMPAIGN ERROR:",
        campaignError
      );

      return NextResponse.json(
        {
          error: campaignError.message,
        },
        { status: 500 }
      );
    }

    if (!campaign) {
      return NextResponse.json(
        {
          error: "Campaign not found.",
        },
        { status: 404 }
      );
    }

    if (campaign.owner_id !== user.id) {
      return NextResponse.json(
        {
          error:
            "You do not own this campaign.",
        },
        { status: 403 }
      );
    }

    console.log(
      "Creating Bunny video..."
    );

    const bunnyResponse = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          AccessKey: BUNNY_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
        }),
      }
    );

    const bunnyText =
      await bunnyResponse.text();

    console.log(
      "BUNNY STATUS:",
      bunnyResponse.status
    );

    console.log(
      "BUNNY RESPONSE:",
      bunnyText
    );

    let bunnyData: any = null;

    if (bunnyText.trim()) {
      try {
        bunnyData = JSON.parse(bunnyText);
      } catch {
        console.error(
          "Bunny returned non-JSON response."
        );
      }
    }

    if (!bunnyResponse.ok) {
      return NextResponse.json(
        {
          error:
            bunnyData?.message ||
            bunnyData?.error ||
            bunnyText ||
            `Bunny returned HTTP ${bunnyResponse.status}.`,
        },
        { status: 502 }
      );
    }

    if (!bunnyData?.guid) {
      return NextResponse.json(
        {
          error:
            "Bunny did not return a video ID.",
          response: bunnyText,
        },
        { status: 502 }
      );
    }

    const videoId = bunnyData.guid;

    const expirationTime =
      Math.floor(Date.now() / 1000) + 3600;

    const signatureString =
      BUNNY_LIBRARY_ID +
      BUNNY_API_KEY +
      expirationTime +
      videoId;

    const authorizationSignature =
      crypto
        .createHash("sha256")
        .update(signatureString)
        .digest("hex");

    console.log(
      "Bunny authorization created successfully."
    );

    return NextResponse.json({
      success: true,
      libraryId: BUNNY_LIBRARY_ID,
      videoId,
      authorizationSignature,
      expirationTime,
    });
  } catch (error) {
    console.error(
      "=== BUNNY ROUTE CRASH ==="
    );

    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
