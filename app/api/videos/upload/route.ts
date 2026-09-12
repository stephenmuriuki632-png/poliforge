import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const BUNNY_LIBRARY_ID = process.env.BUNNY_VIDEO_LIBRARY_ID!;
const BUNNY_API_KEY = process.env.BUNNY_VIDEO_API_KEY!;
const BUNNY_CDN_HOSTNAME = process.env.BUNNY_CDN_HOSTNAME!;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing authorization." },
        { status: 401 }
      );
    }

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const campaignId = formData.get("campaignId");
    const title = formData.get("title");
    const description = formData.get("description");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Video file is required." },
        { status: 400 }
      );
    }

    if (typeof campaignId !== "string" || !campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required." },
        { status: 400 }
      );
    }

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Video title is required." },
        { status: 400 }
      );
    }

    if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY || !BUNNY_CDN_HOSTNAME) {
      return NextResponse.json(
        { error: "Bunny configuration is missing." },
        { status: 500 }
      );
    }

    /*
     * Verify campaign ownership.
     */
    const { data: campaign, error: campaignError } =
      await supabase
        .from("campaigns")
        .select("id, owner_id")
        .eq("id", campaignId)
        .maybeSingle();

    if (campaignError) {
      return NextResponse.json(
        { error: campaignError.message },
        { status: 500 }
      );
    }

    if (!campaign || campaign.owner_id !== user.id) {
      return NextResponse.json(
        { error: "You do not have access to this campaign." },
        { status: 403 }
      );
    }

    /*
     * Create Bunny video.
     */
    const bunnyCreateResponse = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          AccessKey: BUNNY_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
        }),
      }
    );

    const bunnyVideo = await bunnyCreateResponse.json();

    if (!bunnyCreateResponse.ok) {
      console.error("BUNNY CREATE ERROR:", bunnyVideo);

      return NextResponse.json(
        {
          error:
            bunnyVideo?.message ||
            "Unable to create Bunny video.",
        },
        { status: 500 }
      );
    }

    const bunnyVideoId = bunnyVideo.guid;

    if (!bunnyVideoId) {
      return NextResponse.json(
        { error: "Bunny did not return a video ID." },
        { status: 500 }
      );
    }

    /*
     * Upload the actual file to Bunny.
     */
    const fileBuffer = await file.arrayBuffer();

    const bunnyUploadResponse = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${bunnyVideoId}`,
      {
        method: "PUT",
        headers: {
          AccessKey: BUNNY_API_KEY,
          "Content-Type": file.type || "application/octet-stream",
        },
        body: fileBuffer,
      }
    );

    if (!bunnyUploadResponse.ok) {
      const bunnyUploadError = await bunnyUploadResponse.text();

      console.error(
        "BUNNY UPLOAD ERROR:",
        bunnyUploadError
      );

      return NextResponse.json(
        { error: "Unable to upload video to Bunny." },
        { status: 500 }
      );
    }

    /*
     * Save Bunny information in Supabase.
     */
    const filePath =
      `${user.id}/${campaignId}/${bunnyVideoId}`;

    const playbackUrl =
      `https://${BUNNY_CDN_HOSTNAME}/${bunnyVideoId}/playlist.m3u8`;

    const videoData = {
      campaign_id: campaignId,
      owner_id: user.id,
      title: title.trim(),
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      file_path: filePath,
      file_url: playbackUrl,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type || "video/mp4",
      status: "ready",
    };

    const { data: video, error: databaseError } =
      await supabase
        .from("videos")
        .insert(videoData)
        .select()
        .single();

    if (databaseError) {
      console.error(
        "DATABASE INSERT ERROR:",
        databaseError
      );

      return NextResponse.json(
        { error: databaseError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      video,
      bunnyVideoId,
      playbackUrl,
    });
  } catch (error) {
    console.error("VIDEO UPLOAD API ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
