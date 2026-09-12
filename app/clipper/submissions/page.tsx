"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

type Submission = {
  id: string;
  clipping_campaign_id: string;
  clipper_id: string;
  title: string;
  platform: string | null;
  file_url: string | null;
  file_name: string | null;
  notes: string | null;
  views: number | null;
  status: "Pending" | "Approved" | "Rejected";
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
};

type Campaign = {
  id: string;
  title: string;
};

type SubmissionWithCampaign = Submission & {
  campaignName: string;
};

export default function ClipperSubmissionsPage() {
  const [submissions, setSubmissions] = useState<
    SubmissionWithCampaign[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("You must be signed in to view your submissions.");
        setLoading(false);
        return;
      }

      const { data, error: submissionError } = await supabase
        .from("submissions")
        .select(
          `
          id,
          clipping_campaign_id,
          clipper_id,
          title,
          platform,
          file_url,
          file_name,
          notes,
          views,
          status,
          rejection_reason,
          created_at,
          updated_at
        `
        )
        .eq("clipper_id", user.id)
        .order("created_at", { ascending: false });

      if (submissionError) {
        console.error(submissionError);
        setError(submissionError.message);
        setLoading(false);
        return;
      }

      const submissionRows = (data ?? []) as Submission[];

      if (submissionRows.length === 0) {
        setSubmissions([]);
        setLoading(false);
        return;
      }

      const campaignIds = [
        ...new Set(
          submissionRows.map(
            (submission) => submission.clipping_campaign_id
          )
        ),
      ];

      const { data: campaigns, error: campaignError } =
        await supabase
          .from("clipping_campaigns")
          .select("id, title")
          .in("id", campaignIds);

      if (campaignError) {
        console.error(campaignError);
      }

      const campaignMap = new Map<string, string>();

      ((campaigns ?? []) as Campaign[]).forEach((campaign) => {
        campaignMap.set(campaign.id, campaign.title);
      });

      const combined: SubmissionWithCampaign[] = [];

      for (const submission of submissionRows) {
        let playableUrl = submission.file_url;

        if (submission.file_url) {
          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from("submissions")
              .createSignedUrl(submission.file_url, 60 * 60);

          if (signedUrlError) {
            console.error(
              "SUBMISSION SIGNED URL ERROR:",
              signedUrlError
            );
          } else if (signedUrlData?.signedUrl) {
            playableUrl = signedUrlData.signedUrl;
          }
        }

        combined.push({
          ...submission,
          file_url: playableUrl,
          campaignName:
            campaignMap.get(submission.clipping_campaign_id) ??
            "Campaign",
        });
      }

      setSubmissions(combined);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading submissions.");
    } finally {
      setLoading(false);
    }
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

            <span className="font-semibold">PoliForge</span>
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
            Clipper workspace
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            My submissions
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Track the clips you've submitted and see whether each one
            has been approved or rejected.
          </p>
        </section>

        {loading ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.015] p-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />

            <p className="mt-5 text-sm text-white/40">
              Loading submissions...
            </p>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
            <h2 className="font-semibold">
              Unable to load submissions
            </h2>

            <p className="mt-3 text-sm text-red-300">
              {error}
            </p>

            <button
              onClick={loadSubmissions}
              className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Try again
            </button>
          </div>
        ) : submissions.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.015] px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl">
              ✂
            </div>

            <h2 className="mt-6 text-lg font-semibold">
              No submissions yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/30">
              Your submitted clips will appear here once you send one
              to a campaign.
            </p>

            <Link
              href="/clipper/dashboard"
              className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/80"
            >
              Discover campaigns →
            </Link>
          </div>
        ) : (
          <section className="mt-8 space-y-5">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function SubmissionCard({
  submission,
}: {
  submission: SubmissionWithCampaign;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
      <div className="flex flex-col gap-6 p-6 sm:p-7 lg:flex-row">
        <div className="flex h-32 w-full shrink-0 items-center justify-center rounded-2xl bg-black sm:w-52">
          {submission.file_url ? (
            <video
              controls
              preload="metadata"
              className="h-full w-full rounded-2xl object-contain"
              src={submission.file_url}
            />
          ) : (
            <span className="text-2xl">🎥</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs text-white/25">
                {submission.campaignName}
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                {submission.title}
              </h2>
            </div>

            <StatusBadge status={submission.status} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {submission.platform && (
              <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40">
                {submission.platform}
              </span>
            )}

            <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40">
              {submission.views ?? 0} views
            </span>

            <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40">
              {new Date(
                submission.created_at
              ).toLocaleDateString()}
            </span>
          </div>

          {submission.notes && (
            <p className="mt-4 text-sm leading-6 text-white/30">
              {submission.notes}
            </p>
          )}

          {submission.status === "Rejected" &&
            submission.rejection_reason && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-xs uppercase tracking-wider text-red-300/60">
                  Rejection reason
                </p>

                <p className="mt-2 text-sm text-red-300">
                  {submission.rejection_reason}
                </p>
              </div>
            )}
        </div>
      </div>
    </article>
  );
}

function StatusBadge({
  status,
}: {
  status: Submission["status"];
}) {
  if (status === "Approved") {
    return (
      <span className="inline-flex w-fit rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1.5 text-xs font-medium text-green-300">
        Approved
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex w-fit rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-300">
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex w-fit rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1.5 text-xs font-medium text-yellow-300">
      Pending
    </span>
  );
}

