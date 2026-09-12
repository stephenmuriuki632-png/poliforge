"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { supabase } from "../../../../lib/supabase";

type Campaign = {
  id: string;
  campaign_id: string;
  title: string;
  description: string | null;
  reward: number;
  status: string;
  deadline: string | null;
};

type Video = {
  id: string;
  campaign_id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_url: string | null;
  status: string;
  created_at: string;
};

type BunnyVideoPlayerProps = {
  src: string;
};

function BunnyVideoPlayer({ src }: BunnyVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playerError, setPlayerError] = useState("");

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !src) {
      return;
    }

    setPlayerError("");

    /*
     * Safari/iOS and browsers with native HLS support.
     */
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;

      return () => {
        video.removeAttribute("src");
        video.load();
      };
    }

    /*
     * Chrome, Android and other browsers use hls.js.
     */
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("BUNNY HLS ERROR:", data);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn(
                "HLS network error. Attempting recovery..."
              );
              hls.startLoad();
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn(
                "HLS media error. Attempting recovery..."
              );
              hls.recoverMediaError();
              break;

            default:
              setPlayerError(
                "Unable to play this video right now."
              );
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    }

    setPlayerError(
      "This browser does not support HLS video playback."
    );
  }, [src]);

  return (
    <div className="relative aspect-video overflow-hidden bg-black">
      <video
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full bg-black object-contain"
      />

      {playerError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 px-6 text-center">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-300">
              !
            </div>

            <p className="mt-4 text-sm text-white/60">
              {playerError}
            </p>

            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
            >
              Open video
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClipperCampaignPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] =
    useState<Campaign | null>(null);

  const [videos, setVideos] = useState<Video[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (campaignId) {
      loadCampaign();
    }
  }, [campaignId]);

  async function loadCampaign() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(authError.message);
      }

      if (!user) {
        throw new Error("You must be signed in.");
      }

      /*
       * Load the clipping campaign.
       */
      const {
        data: clippingCampaign,
        error: clippingError,
      } = await supabase
        .from("clipping_campaigns")
        .select(
          "id, campaign_id, title, description, reward, status, deadline"
        )
        .eq("id", campaignId)
        .maybeSingle();

      if (clippingError) {
        throw new Error(clippingError.message);
      }

      if (!clippingCampaign) {
        throw new Error(
          "Clipping campaign not found."
        );
      }

      setCampaign(
        clippingCampaign as Campaign
      );

      /*
       * Videos belong to the parent campaign.
       */
      const parentCampaignId =
        clippingCampaign.campaign_id;

      const {
        data: videoData,
        error: videoError,
      } = await supabase
        .from("videos")
        .select(
          "id, campaign_id, title, description, file_path, file_url, status, created_at"
        )
        .eq(
          "campaign_id",
          parentCampaignId
        )
        .eq("status", "ready")
        .order("created_at", {
          ascending: false,
        });

      if (videoError) {
        throw new Error(videoError.message);
      }

      const rows =
        (videoData ?? []) as Video[];

      setVideos(rows);
    } catch (err) {
      console.error(
        "CAMPAIGN LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading the campaign."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(
    date: string | null
  ) {
    if (!date) {
      return "No deadline";
    }

    return new Date(
      date
    ).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />

            <p className="mt-5 text-sm text-white/40">
              Loading campaign...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <header className="border-b border-white/10">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
            <Link
              href="/clipper/dashboard"
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
              href="/clipper/dashboard"
              className="text-sm text-white/40 transition hover:text-white"
            >
              ← Dashboard
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
            <h1 className="text-xl font-semibold">
              Unable to load campaign
            </h1>

            <p className="mt-3 text-sm leading-6 text-red-300">
              {error}
            </p>

            <button
              onClick={loadCampaign}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Try again
            </button>
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
            href="/clipper/dashboard"
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
            href="/clipper/dashboard"
            className="text-sm text-white/40 transition hover:text-white"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-white/25">
            Clipping campaign
          </p>

          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {campaign?.title}
              </h1>

              {campaign?.description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
                  {campaign.description}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 sm:min-w-40">
              <p className="text-xs text-white/30">
                Reward
              </p>

              <p className="mt-1 text-2xl font-semibold">
                KSh{" "}
                {Number(
                  campaign?.reward ?? 0
                ).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/50">
              {campaign?.status}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/50">
              Deadline:{" "}
              {formatDate(
                campaign?.deadline ?? null
              )}
            </span>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Source videos
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Watch the campaign footage and
              create your short-form clips.
            </p>
          </div>

          {videos.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-10 text-center">
              <p className="text-white/50">
                No source videos are available yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {videos.map((video) => {
                const videoUrl =
                  video.file_url;

                return (
                  <article
                    key={video.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]"
                  >
                    {videoUrl ? (
                      <BunnyVideoPlayer
                        src={videoUrl}
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-black px-6 text-center">
                        <div>
                          <p className="text-sm text-white/50">
                            Video unavailable
                          </p>

                          <p className="mt-2 text-xs text-white/25">
                            This video does not have
                            a Bunny URL yet.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {video.title}
                          </h3>

                          {video.description && (
                            <p className="mt-2 text-sm leading-6 text-white/40">
                              {video.description}
                            </p>
                          )}
                        </div>

                        {videoUrl && (
                          <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
                          >
                            Open video ↗
                          </a>
                        )}
                      </div>

                      <div className="mt-5 border-t border-white/5 pt-4">
                        <p className="text-xs text-white/25">
                          Uploaded{" "}
                          {new Date(
                            video.created_at
                          ).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
