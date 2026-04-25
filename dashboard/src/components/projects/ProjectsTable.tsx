"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, STATUS_LABELS } from "@/components/projects/StatusBadge";
import type { ProjectSummary, ProjectStatus } from "@/types/project";
import { SEGMENT_LABELS } from "@/types/project";

type SortColumn = "companyName" | "createdAt";
type SortDirection = "asc" | "desc";

const ALL_STATUSES: ProjectStatus[] = [
  "queued",
  "researching",
  "styling",
  "awaiting_style_approval",
  "composing",
  "awaiting_layout_approval",
  "content",
  "humanizing",
  "assembling",
  "qa",
  "deploying",
  "deployed",
  "failed",
  "qa_failed",
];

interface ProjectsTableProps {
  projects: ProjectSummary[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredAndSorted = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    const filtered = projects.filter((p) => {
      const matchesSearch = p.companyName.toLowerCase().includes(lowerSearch);
      const matchesStatus = statusFilter === "" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let comparison: number;

      if (sortColumn === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        comparison = a.companyName.localeCompare(b.companyName);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [projects, search, statusFilter, sortColumn, sortDirection]);

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection(column === "createdAt" ? "desc" : "asc");
    }
  }

  function renderSortIcon(column: SortColumn) {
    if (sortColumn === column) {
      return sortDirection === "asc" ? (
        <ChevronUp className="ml-1 inline h-4 w-4" />
      ) : (
        <ChevronDown className="ml-1 inline h-4 w-4" />
      );
    }
    return <ChevronDown className="ml-1 inline h-4 w-4 opacity-30" />;
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by company name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ALL_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("companyName")}
            >
              Company Name
              {renderSortIcon("companyName")}
            </TableHead>
            <TableHead>Segment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("createdAt")}
            >
              Created
              {renderSortIcon("createdAt")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSorted.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No projects match your filters.
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSorted.map((project) => (
              <TableRow
                key={project.projectId}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/projects/${project.projectId}`)}
              >
                <TableCell className="font-medium">
                  {project.companyName}
                </TableCell>
                <TableCell>
                  {SEGMENT_LABELS[project.segment] ?? project.segment}
                </TableCell>
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell>{formatDate(project.createdAt)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
