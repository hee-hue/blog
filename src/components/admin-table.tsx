"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type StatRow = {
  slug: string;
  title: string;
  likes: number;
  bookmarks: number;
};

type Key = "title" | "likes" | "bookmarks";

function SortHead({
  k,
  label,
  right,
  sortKey,
  desc,
  onSort,
}: {
  k: Key;
  label: string;
  right?: boolean;
  sortKey: Key;
  desc: boolean;
  onSort: (k: Key) => void;
}) {
  const Icon = sortKey !== k ? ArrowUpDown : desc ? ArrowDown : ArrowUp;
  return (
    <TableHead
      className={right ? "text-right" : undefined}
      aria-sort={sortKey === k ? (desc ? "descending" : "ascending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className="inline-flex items-center gap-1 hover:text-link"
      >
        {label}
        <Icon className="size-3.5" aria-hidden />
      </button>
    </TableHead>
  );
}

export function AdminTable({ rows }: { rows: StatRow[] }) {
  const [key, setKey] = useState<Key>("likes");
  const [desc, setDesc] = useState(true);

  const sorted = [...rows].sort((a, b) => {
    const r =
      key === "title" ? a.title.localeCompare(b.title, "ko") : a[key] - b[key];
    return desc ? -r : r;
  });

  function toggle(k: Key) {
    if (k === key) setDesc((d) => !d);
    else {
      setKey(k);
      setDesc(k !== "title");
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortHead k="title" label="글 제목" sortKey={key} desc={desc} onSort={toggle} />
          <SortHead k="likes" label="좋아요" right sortKey={key} desc={desc} onSort={toggle} />
          <SortHead k="bookmarks" label="북마크" right sortKey={key} desc={desc} onSort={toggle} />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((r) => (
          <TableRow key={r.slug}>
            <TableCell className="whitespace-normal font-medium">{r.title}</TableCell>
            <TableCell className="text-right tabular-nums">{r.likes}</TableCell>
            <TableCell className="text-right tabular-nums">{r.bookmarks}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
