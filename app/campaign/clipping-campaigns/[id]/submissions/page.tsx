"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";

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

type ClippingCampaign = {
  id: string;
  campaign_id: string;
  title: string;
  description: string | null;
  reward: number;
  status: string;
  deadline: string | null;
};

export default function CampaignSubmissionsPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] =
    useState<ClippingCampaign | null>(null);

  const [submissions, setSubmissions] =
    useState<Submission[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  useEffect(() => {
    if (campaignId) {
      loadPage();
    }
  }, [campaignId]);

  async function loadPage() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("You must be signed in.");
      }

      const { data: clippingCampaign, error: campaignError } =
        await supabase
          .from("clipping_campaigns")
          .select(
            "id, campaign_id, title, description, reward, status, deadline"
          )
          .eq("id", campaignId)
          .maybeSingle();

      if (campaignError) {
        throw new Error(campaignError.message);
      }

      if (!clippingCampaign) {
        throw new Error("Clipping campaign not found.");
      }

      /*
       * Verify that the clipping campaign belongs
       * to a campaign owned by the current user.
       */
      const { data: parentCampaign, error: ownerError } =
        await supabase
          .from("campaigns")
          .select("id")
          .eq("id", clippingCampaign.campaign_id)
          .eq("owner_id", user.id)
          .maybeSingle();

      if (ownerError) {
        throw new Error(ownerError.message);
      }

      if (!parentCampaign) {
        throw new Error(
          "You do not have permission to view these submissions."
        );
      }

      const { data: submissionData, error: submissionError } =
        await supabase
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
          .eq("clipping_campaign_id", campaignId)
          .order("created_at", { ascending: false });

      if (submissionError) {
        throw new Error(submissionError.message);
      }

      setCampaign(clippingCampaign as ClippingCampaign);
      setSubmissions(
        (submissionData ?? []) as Submission[]
      );
    } catch (err) {
      console.error(
        "CAMPAIGN SUBMISSIONS LOAD ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load submissions."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateSubmissionStatus(
    submissionId: string,
    status: "Approved" | "Rejected"
  ) {
    setActionLoading(submissionId);
    setError("");

    try {
      let rejectionReason: string | null = null;

      if (status === "Rejected") {
        const reason = window.prompt(
          "Why are you rejecting this submission?"
        );

        if (reason === null) {
          setActionLoading(null);
          return;
        }

        rejectionReason =
          reason.trim() || "Submission did not meet the campaign requirements.";
      }

      if (status === "Approved") {
        const { data: payoutResult, error: payoutError } =
          await supabase.rpc(
            "approve_submission_with_payout",
            {
              p_submission_id: submissionId,
            }
          );

        if (payoutError) {
          throw new Error(payoutError.message);
        }

        if (!payoutResult?.success) {
          throw new Error(
            payoutResult?.message ||
              "Unable to approve submission."
          );
        }
      } else {
        const { data: updatedSubmission, error: updateError } =
          await supabase
            .from("submissions")
            .update({
              status,
              rejection_reason: rejectionReason,
              updated_at: new Date().toISOString(),
            })
            .eq("id", submissionId)
            .eq("clipping_campaign_id", campaignId)
            .select()
            .single();

        if (updateError) {
          throw new Error(updateError.message);
        }

        setSubmissions((current) =>
          current.map((submission) =>
            submission.id === submissionId
              ? (updatedSubmission as Submission)
              : submission
          )
        );

        return;
      }

      await loadPage();
    } catch (err) {
      console.error(
        "SUBMISSION STATUS UPDATE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update submission."
      );
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />

            <p className="mt-5 text-sm text-white/40">
              Loading submissions...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !campaign) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <Link
            href="/campaign/dashboard"
            className="text-sm text-white/40 hover:text-white"
          >
            ← Dashboard
          </Link>

          <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
            <h1 className="text-xl font-semibold">
              Unable to load submissions
            </h1>

            <p className="mt-3 text-sm text-red-300">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const pendingCount = submissions.filter(
    (submission) => submission.status === "Pending"
  ).length;

  const approvedCount = submissions.filter(
    (submission) => submission.status === "Approved"
  ).length;

  const rejectedCount = submissions.filter(
    (submission) => submission.status === "Rejected"
  ).length;

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

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/30">
            Submission review
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {campaign?.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Review clips submitted by clippers for this campaign.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <Stat
            label="Total submissions"
            value={submissions.length}
          />

          <Stat
            label="Pending"
            value={pendingCount}
          />

          <Stat
            label="Approved"
            value={approvedCount}
          />

          <Stat
            label="Rejected"
            value={rejectedCount}
          />
        </div>

        {submissions.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-white/10 px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl">
              ✂
            </div>

            <h2 className="mt-6 text-lg font-semibold">
              No submissions yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/30">
              Submitted clips will appear here when clippers
              send their work.
            </p>
          </div>
        ) : (
          <section className="mt-10 space-y-5">
            {submissions.map((submission) => (
              <article
                key={submission.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]"
              >
                <div className="grid gap-6 p-5 lg:grid-cols-[320px_1fr] lg:p-6">
                  <div className="overflow-hidden rounded-2xl bg-black">
                    {submission.file_url ? (
                      <video
                        controls
                        preload="metadata"
                        className="aspect-video h-full w-full object-contain"
                        src={submission.file_url}
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center text-3xl">
                        🎥
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs text-white/25">
                          {submission.platform ||
                            "Platform not specified"}
                        </p>

                        <h2 className="mt-1 text-xl font-semibold">
                          {submission.title}
                        </h2>

                        <p className="mt-2 text-xs text-white/25">
                          Submitted{" "}
                          {new Date(
                            submission.created_at
                          ).toLocaleString()}
                        </p>
                      </div>

                      <StatusBadge
                        status={submission.status}
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40">
                        Reward: ${campaign?.reward ?? 0}
                      </span>

                      <span className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40">
                        {submission.views ?? 0} views
                      </span>

                      {submission.file_name && (
                        <span className="max-w-full truncate rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/40">
                          {submission.file_name}
                        </span>
                      )}
                    </div>

                    {submission.notes && (
                      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                        <p className="text-xs uppercase tracking-wider text-white/25">
                          Clipper notes
                        </p>

                        <p className="mt-2 text-sm leading-6 text-white/40">
                          {submission.notes}
                        </p>
                      </div>
                    )}

                    {submission.status === "Rejected" &&
                      submission.rejection_reason && (
                        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                          <p className="text-xs uppercase tracking-wider text-red-300/60">
                            Rejection reason
                          </p>

                          <p className="mt-2 text-sm text-red-300">
                            {submission.rejection_reason}
                          </p>
                        </div>
                      )}

                    {submission.status === "Pending" && (
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          disabled={
                            actionLoading === submission.id
                          }
                          onClick={() =>
                            updateSubmissionStatus(
                              submission.id,
                              "Rejected"
                            )
                          }
                          className="rounded-xl border border-red-500/20 px-5 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {actionLoading === submission.id
                            ? "Updating..."
                            : "Reject"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionLoading === submission.id
                          }
                          onClick={() =>
                            updateSubmissionStatus(
                              submission.id,
                              "Approved"
                            )
                          }
                          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {actionLoading === submission.id
                            ? "Updating..."
                            : "Approve"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-white/40">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold">
        {value}
      </p>
    </div>
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
