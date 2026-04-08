"use client";

import { useState, useTransition } from "react";
import { updateNotes } from "@/app/actions/bucket-list";

export function NotesEditor({
  id,
  initialNotes,
}: {
  id: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleBlur() {
    if (notes === initialNotes) return;
    setSaved(false);
    startTransition(async () => {
      const result = await updateNotes(id, notes);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  return (
    <div className="mt-3">
      <label className="mb-1 block text-xs font-medium text-muted">
        Notes
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleBlur}
        placeholder="Add your travel notes..."
        rows={2}
        className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none transition-colors placeholder:text-stone-400 focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/20"
      />
      <div className="h-4">
        {isPending && (
          <span className="text-xs text-muted">Saving...</span>
        )}
        {saved && (
          <span className="text-xs text-teal-600">Saved!</span>
        )}
      </div>
    </div>
  );
}
