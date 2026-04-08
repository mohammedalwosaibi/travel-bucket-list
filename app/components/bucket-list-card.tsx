"use client";

import { useState, useTransition } from "react";
import { BucketListItem } from "@/lib/types";
import { removeFromBucketList } from "@/app/actions/bucket-list";
import { NotesEditor } from "./notes-editor";

export function BucketListCard({ item }: { item: BucketListItem }) {
  const [isPending, startTransition] = useTransition();
  const [removed, setRemoved] = useState(false);

  function handleRemove() {
    startTransition(async () => {
      const result = await removeFromBucketList(item.id);
      if (result.success) setRemoved(true);
    });
  }

  if (removed) return null;

  const addedDate = new Date(item.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/60">
      {item.flag_url && (
        <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
          <img
            src={item.flag_url}
            alt={`Flag of ${item.country_name}`}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {item.country_name}
            </h3>
            <p className="text-sm text-muted">Added {addedDate}</p>
          </div>
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="shrink-0 rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-rose-50 hover:text-danger disabled:opacity-50"
            title="Remove from bucket list"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {item.capital && (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
              🏛️ {item.capital}
            </span>
          )}
          {item.region && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
              🌍 {item.region}
            </span>
          )}
        </div>

        <NotesEditor id={item.id} initialNotes={item.notes} />
      </div>
    </div>
  );
}
