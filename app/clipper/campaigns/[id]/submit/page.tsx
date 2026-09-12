"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";

type Campaign = {
  id: string;
  title: string;
  reward: number;
  status: string;
};

export default function SubmitClipPage() {
  const params = useParams();
  const router = useRouter();

  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      const { data, error: campaignError } =
        await supabase
          .from("clipping_campaigns")
          .select("id, title, reward, status")
          .eq("id", campaignId)
          .maybeSingle();

      if (campaignError) {
        throw new Error(campaignError.message);
      }

      if (!data) {
        throw new Error("Campaign not found.");
      }

      setCampaign(data as Campaign);
    } catch (err) {
      console.error("CAMPAIGN LOAD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load campaign."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setError("");
    setSuccess("");

    if (selectedFile) {
      console.log("SUBMISSION FILE:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
    }
  }

  async function submitClip(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a clip title.");
      return;
    }

    if (!file) {
      setError("Please select your clip video.");
      return;
    }

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      return;
    }

    if (!campaignId) {
      setError("Campaign ID is missing.");
      return;
    }

    setUploading(true);

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

      /*
       * Verify that the clipping campaign exists.
       */
      const { data: clippingCampaign, error: campaignError } =
        await supabase
          .from("clipping_campaigns")
          .select("id, title, reward, status")
          .eq("id", campaignId)
          .maybeSingle();

      if (campaignError) {
        throw new Error(campaignError.message);
      }

      if (!clippingCampaign) {
        throw new Error("Campaign not found.");
      }

      if (clippingCampaign.status !== "active") {
        throw new Error(
          "This campaign is not currently accepting submissions."
        );
      }

      /*
       * Create a safe filename.
       */
      const safeFileName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .replace(/-+/g, "-");

      /*
       * Storage path:
       *
       * user.id / clippingCampaign.id / timestamp-file
       */
      const filePath =
        `${user.id}/${campaignId}/${Date.now()}-${safeFileName}`;

      console.log("SUBMISSION STORAGE PATH:", filePath);

      setSuccess("Uploading your clip...");

      /*
       * Upload to private submissions bucket.
       */
      const { error: uploadError } =
        await supabase.storage
          .from("submissions")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || "video/mp4",
          });

      if (uploadError) {
        console.error(
          "SUBMISSION STORAGE ERROR:",
          uploadError
        );

        throw new Error(
          "Unable to upload clip: " +
          uploadError.message
        );
      }

      setSuccess("Saving your submission...");

      /*
       * Save submission in database.
       */
      const submissionData = {
        id: crypto.randomUUID(),
        clipping_campaign_id: campaignId,
        clipper_id: user.id,
        title: title.trim(),
        platform,
        file_url: filePath,
        file_name: file.name,
        notes: notes.trim() || null,
        views: 0,
        status: "Pending",
      };

      console.log(
        "SUBMISSION DATA:",
        submissionData
      );

      const {
        data: submission,
        error: databaseError,
      } = await supabase
        .from("submissions")
        .insert(submissionData)
        .select()
        .single();

      if (databaseError) {
        console.error(
          "SUBMISSION DATABASE ERROR:",
          databaseError
        );

        /*
         * Remove uploaded file if database
         * insertion fails.
         */
        await supabase.storage
          .from("submissions")
          .remove([filePath]);

        throw new Error(
          "Unable to save submission: " +
          databaseError.message
        );
      }

      console.log(
        "SUBMISSION CREATED:",
        submission
      );

      setSuccess(
        "Clip submitted successfully!"
      );

      setTitle("");
      setPlatform("TikTok");
      setNotes("");
      setFile(null);

      const input = document.getElementById(
        "clip-file"
      ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }

      setTimeout(() => {
        router.push("/clipper/submissions");
      }, 1200);
    } catch (err) {
      console.error("SUBMIT ERROR:", err);

      setSuccess("");

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting your clip."
      );
    } finally {
      setUploading(false);
    }
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

  if (error && !campaign) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="mx-auto max-w-2xl px-5 py-16">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
            <h1 className="text-xl font-semibold">
              Unable to load campaign
            </h1>

            <p className="mt-3 text-sm text-red-300">
              {error}
            </p>

            <Link
              href="/clipper/dashboard"
              className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
            >
              Back to dashboard
            </Link>
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
            href={`/clipper/campaigns/${campaignId}`}
            className="text-sm text-white/40 transition hover:text-white"
          >
            ← Campaign
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-white/30">
            Submit your clip
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            {campaign?.title}
          </h1>

          <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60">
            Reward:{" "}
            <span className="ml-1 font-semibold text-white">
              KSh{" "}
              {Number(
                campaign?.reward ?? 0
              ).toLocaleString()}
            </span>
          </div>
        </div>

        <form
          onSubmit={submitClip}
          className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10"
        >
          <div className="space-y-7">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Clip title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Best moment from the speech"
                disabled={uploading}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 outline-none transition placeholder:text-white/20 focus:border-white/30 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Platform
              </label>

              <select
                value={platform}
                onChange={(event) =>
                  setPlatform(event.target.value)
                }
                disabled={uploading}
                className="w-full rounded-xl border border-white/10 bg-[#101010] px-4 py-3.5 outline-none focus:border-white/30"
              >
                <option value="TikTok">
                  TikTok
                </option>

                <option value="Instagram">
                  Instagram
                </option>

                <option value="YouTube">
                  YouTube
                </option>

                <option value="Facebook">
                  Facebook
                </option>

                <option value="X">
                  X
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Clip video
              </label>

              <label
                htmlFor="clip-file"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center transition hover:border-white/30 hover:bg-white/[0.04]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                  ↑
                </div>

                <p className="mt-5 text-sm font-medium">
                  {file
                    ? file.name
                    : "Choose your clip"}
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
                  id="clip-file"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Notes
              </label>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Optional notes for the campaign owner..."
                rows={5}
                disabled={uploading}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 outline-none transition placeholder:text-white/20 focus:border-white/30 disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-4 text-sm text-red-300">
                <p className="font-medium">
                  Submission failed
                </p>

                <p className="mt-1 break-words text-red-300/80">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-4 text-sm text-green-300">
                {success}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href={`/clipper/campaigns/${campaignId}`}
                className="rounded-xl border border-white/10 px-6 py-3.5 text-center text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  uploading ||
                  !file ||
                  !title.trim()
                }
                className="flex-1 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Submitting..."
                  : "Submit clip →"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
