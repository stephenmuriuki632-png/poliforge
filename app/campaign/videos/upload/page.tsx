"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { supabase } from "../../../../lib/supabase";
import * as tus from "tus-js-client";

type Campaign = {
  id: string;
  name: string;
  description: string | null;
  status: string;
};

type BunnyUploadData = {
  videoId: string;
  libraryId: string;
  authorizationSignature: string;
  expirationTime: number;
};

export default function VideoUploadPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    setLoadingCampaigns(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error("You must be signed in.");
      }

      const { data, error: campaignError } =
        await supabase
          .from("campaigns")
          .select("id, name, description, status")
          .eq("owner_id", user.id)
          .order("created_at", {
            ascending: false,
          });

      if (campaignError) {
        throw new Error(campaignError.message);
      }

      const campaignList = (data ?? []) as Campaign[];

      setCampaigns(campaignList);

      if (campaignList.length > 0) {
        setCampaignId(campaignList[0].id);
      }
    } catch (err) {
      console.error("LOAD CAMPAIGNS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load campaigns."
      );
    } finally {
      setLoadingCampaigns(false);
    }
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setError("");
    setMessage("");
    setProgress(0);

    if (selectedFile) {
      console.log("SELECTED FILE:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
    }
  }

  async function getBunnyUploadAuthorization(
    selectedCampaignId: string,
    videoTitle: string
  ): Promise<BunnyUploadData> {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    if (!session?.access_token) {
      throw new Error(
        "Your session has expired. Please sign in again."
      );
    }

    const response = await fetch(
      "/api/bunny/upload",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          campaignId: selectedCampaignId,
          title: videoTitle,
        }),
      }
    );

    const responseText = await response.text();

    console.log(
      "BUNNY AUTH HTTP STATUS:",
      response.status
    );

    console.log(
      "BUNNY AUTH RESPONSE:",
      responseText
    );

    let data: any = {};

    if (!responseText.trim()) {
      throw new Error(
        `Upload authorization returned an empty response (HTTP ${response.status}).`
      );
    }

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("BUNNY AUTH RAW RESPONSE:", responseText);
      console.error("BUNNY AUTH JSON PARSE ERROR:", parseError);

      throw new Error(
        `Upload authorization returned invalid JSON. HTTP ${response.status}. Response: ${responseText}`
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
          `Upload authorization failed (${response.status}).`
      );
    }

    if (!data?.videoId) {
      throw new Error(
        "Bunny authorization did not return a video ID."
      );
    }

    if (!data?.libraryId) {
      throw new Error(
        "Bunny authorization did not return a library ID."
      );
    }

    if (!data?.authorizationSignature) {
      throw new Error(
        "Bunny authorization signature is missing."
      );
    }

    if (!data?.expirationTime) {
      throw new Error(
        "Bunny authorization expiration time is missing."
      );
    }

    return {
      videoId: data.videoId,
      libraryId: data.libraryId,
      authorizationSignature:
        data.authorizationSignature,
      expirationTime: Number(
        data.expirationTime
      ),
    };
  }

  async function uploadToBunny(
    selectedFile: File,
    bunnyData: BunnyUploadData
  ) {
    return new Promise<void>(
      (resolve, reject) => {
        const upload = new tus.Upload(
          selectedFile,
          {
            endpoint:
              "https://video.bunnycdn.com/tusupload",

            retryDelays: [
              0,
              3000,
              5000,
              10000,
              20000,
            ],

            headers: {
              AuthorizationSignature:
                bunnyData.authorizationSignature,

              AuthorizationExpire:
                String(
                  bunnyData.expirationTime
                ),

              VideoId: bunnyData.videoId,

              LibraryId: bunnyData.libraryId,
            },

            metadata: {
              filetype:
                selectedFile.type ||
                "video/mp4",

              filename:
                selectedFile.name,
            },

            chunkSize:
              5 * 1024 * 1024,

            onError(uploadError) {
              console.error(
                "BUNNY TUS ERROR:",
                uploadError
              );

              reject(
                new Error(
                  uploadError.message ||
                    "Bunny video upload failed."
                )
              );
            },

            onProgress(
              bytesUploaded,
              bytesTotal
            ) {
              const percentage =
                bytesTotal > 0
                  ? Math.round(
                      (bytesUploaded /
                        bytesTotal) *
                        100
                    )
                  : 0;

              setProgress(percentage);

              setMessage(
                `Uploading video... ${percentage}%`
              );
            },

            onSuccess() {
              console.log(
                "BUNNY UPLOAD COMPLETE:",
                upload.url
              );

              resolve();
            },
          }
        );

        upload.start();
      }
    );
  }

  async function saveVideoRecord(
    selectedCampaignId: string,
    selectedFile: File,
    bunnyVideoId: string
  ) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!user) {
      throw new Error(
        "You must be signed in."
      );
    }

    const filePath =
      `${user.id}/${selectedCampaignId}/${bunnyVideoId}`;

    const cdnHostname =
      process.env
        .NEXT_PUBLIC_BUNNY_CDN_HOSTNAME;

    const fileUrl = cdnHostname
      ? `https://${cdnHostname}/${bunnyVideoId}/playlist.m3u8`
      : null;

    const videoData = {
      campaign_id:
        selectedCampaignId,

      owner_id: user.id,

      title: title.trim(),

      description:
        description.trim() || null,

      file_path: filePath,

      file_url: fileUrl,

      file_name:
        selectedFile.name,

      file_size:
        selectedFile.size,

      mime_type:
        selectedFile.type ||
        "video/mp4",

      status: "ready",
    };

    console.log(
      "VIDEO DATABASE DATA:",
      videoData
    );

    const {
      data: video,
      error: databaseError,
    } = await supabase
      .from("videos")
      .insert(videoData)
      .select()
      .single();

    if (databaseError) {
      console.error(
        "VIDEO DATABASE ERROR:",
        databaseError
      );

      throw new Error(
        "Unable to save video information: " +
          databaseError.message
      );
    }

    console.log(
      "VIDEO RECORD CREATED:",
      video
    );

    return video;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    setProgress(0);

    if (!title.trim()) {
      setError(
        "Please enter a video title."
      );
      return;
    }

    if (!campaignId) {
      setError(
        "Please select a campaign."
      );
      return;
    }

    if (!file) {
      setError(
        "Please select a video file."
      );
      return;
    }

    if (!file.type.startsWith("video/")) {
      setError(
        "Please select a valid video file."
      );
      return;
    }

    setUploading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(
          userError.message
        );
      }

      if (!user) {
        throw new Error(
          "You must be signed in."
        );
      }

      setMessage(
        "Checking campaign..."
      );

      const {
        data: campaign,
        error: campaignError,
      } = await supabase
        .from("campaigns")
        .select(
          "id, name, owner_id"
        )
        .eq("id", campaignId)
        .maybeSingle();

      if (campaignError) {
        throw new Error(
          campaignError.message
        );
      }

      if (!campaign) {
        throw new Error(
          "Campaign not found."
        );
      }

      if (
        campaign.owner_id !==
        user.id
      ) {
        throw new Error(
          "This campaign belongs to another account."
        );
      }

      setMessage(
        "Preparing secure Bunny upload..."
      );

      const bunnyData =
        await getBunnyUploadAuthorization(
          campaignId,
          title.trim()
        );

      console.log(
        "BUNNY VIDEO ID:",
        bunnyData.videoId
      );

      await uploadToBunny(
        file,
        bunnyData
      );

      setMessage(
        "Saving video information..."
      );

      await saveVideoRecord(
        campaignId,
        file,
        bunnyData.videoId
      );

      setProgress(100);

      setMessage(
        "Video uploaded successfully!"
      );

      setTitle("");
      setDescription("");
      setFile(null);

      const input =
        document.getElementById(
          "video-file"
        ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }

      setTimeout(() => {
        window.location.href =
          "/campaign/dashboard";
      }, 1500);
    } catch (err) {
      console.error(
        "VIDEO UPLOAD ERROR:",
        err
      );

      setMessage("");
      setProgress(0);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while uploading the video."
      );
    } finally {
      setUploading(false);
    }
  }

  if (loadingCampaigns) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />

            <p className="mt-5 text-sm text-white/40">
              Loading campaigns...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/campaign/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white font-bold text-black">
              P
            </div>

            <span className="font-semibold">
              PoliForge
            </span>
          </Link>

          <Link
            href="/campaign/dashboard"
            className="text-sm text-white/40 transition hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-white/30">
            Campaign content
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Upload campaign video
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
            Upload a long-form campaign
            video for your clippers.
          </p>
        </div>

        {campaigns.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8">
            <h2 className="text-xl font-semibold">
              No campaigns yet
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">
              Create a campaign before
              uploading videos.
            </p>

            <Link
              href="/campaign/dashboard"
              className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Back to dashboard
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10"
          >
            <div className="space-y-7">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Campaign
                </label>

                <select
                  value={campaignId}
                  onChange={(event) =>
                    setCampaignId(
                      event.target.value
                    )
                  }
                  disabled={uploading}
                  className="w-full rounded-xl border border-white/10 bg-[#101010] px-4 py-3.5 outline-none focus:border-white/30 disabled:opacity-50"
                >
                  {campaigns.map(
                    (campaign) => (
                      <option
                        key={campaign.id}
                        value={campaign.id}
                      >
                        {campaign.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Video title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Full campaign speech"
                  disabled={uploading}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 outline-none placeholder:text-white/20 focus:border-white/30 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Tell clippers what this video contains..."
                  rows={5}
                  disabled={uploading}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 outline-none placeholder:text-white/20 focus:border-white/30 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Video file
                </label>

                <label
                  htmlFor="video-file"
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center transition hover:border-white/30 hover:bg-white/[0.04] ${
                    uploading
                      ? "pointer-events-none opacity-60"
                      : ""
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                    ↑
                  </div>

                  <p className="mt-5 text-sm font-medium">
                    {file
                      ? file.name
                      : "Choose your video"}
                  </p>

                  <p className="mt-2 text-xs text-white/30">
                    MP4, MOV or another video format
                  </p>

                  {file && (
                    <p className="mt-3 text-xs text-white/40">
                      {(
                        file.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  )}

                  <input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {uploading && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">
                      Upload progress
                    </span>

                    <span className="font-semibold">
                      {progress}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-white/35">
                    {message ||
                      "Uploading securely to Bunny..."}
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-4 text-sm text-red-300">
                  <p className="font-medium">
                    Upload failed
                  </p>

                  <p className="mt-1 break-words text-red-300/80">
                    {error}
                  </p>
                </div>
              )}

              {message &&
                !uploading &&
                !error && (
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-4 text-sm text-green-300">
                    {message}
                  </div>
                )}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Link
                  href="/campaign/dashboard"
                  className="rounded-xl border border-white/10 px-6 py-3.5 text-center text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={
                    uploading ||
                    !file ||
                    !title.trim() ||
                    !campaignId
                  }
                  className="flex-1 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading
                    ? `Uploading ${progress}%...`
                    : "Upload video →"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
