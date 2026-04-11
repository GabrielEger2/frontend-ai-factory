"use client";

import React from "react";
import { handleLinkClick } from "@lib/scroll";

interface ClientSideLinkProps {
  href: string;
  children: React.ReactNode;
  headerHeight?: number;
  className?: string;
}

export function ClientSideLink({
  href,
  children,
  headerHeight = 64,
  className,
}: ClientSideLinkProps) {
  return (
    <a
      href={href}
      onClick={(e) => handleLinkClick(e, headerHeight)}
      className={className}
    >
      {children}
    </a>
  );
}
