{/* Reward system */}
<div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-7">
  <p className="text-sm font-medium">
    Clipper rewards
  </p>

  <p className="mt-2 text-xs leading-5 text-white/30">
    Set both the reward for an approved clip and the additional
    reward based on verified views.
  </p>

  <div className="mt-6 grid gap-5 sm:grid-cols-2">
    <div>
      <label className="text-sm font-medium">
        Approval reward
      </label>

      <div className="mt-3 flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
        <span className="px-4 text-sm text-white/30">
          KES
        </span>

        <input
          type="number"
          min="0"
          placeholder="100"
          className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-white/20"
        />
      </div>

      <p className="mt-2 text-xs text-white/20">
        Paid when the campaign owner approves the clip.
      </p>
    </div>

    <div>
      <label className="text-sm font-medium">
        View reward
      </label>

      <div className="mt-3 flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
        <span className="px-4 text-sm text-white/30">
          KES
        </span>

        <input
          type="number"
          min="0"
          placeholder="50"
          className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-white/20"
        />
      </div>

      <p className="mt-2 text-xs text-white/20">
        Amount earned per 1,000 verified views.
      </p>
    </div>
  </div>

  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
    <p className="text-xs font-medium text-white/60">
      Example
    </p>

    <p className="mt-2 text-xs leading-5 text-white/30">
      If the approval reward is KES 100 and the view reward is
      KES 50 per 1,000 verified views, a clip with 10,000 verified
      views could earn KES 600 in total.
    </p>
  </div>
</div>