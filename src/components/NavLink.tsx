"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<LinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  exact?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, href, exact, ...props }, ref) => {
    const pathname = usePathname();
    const hrefString = typeof href === "string" ? href : href.toString();
    const isActive = exact
      ? pathname === hrefString
      : pathname.startsWith(hrefString);
    const isPending = false;

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName, isPending && pendingClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
