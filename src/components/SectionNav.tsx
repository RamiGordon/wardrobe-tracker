"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const SECTIONS = [
  { href: "/", label: "Wishlist" },
  { href: "/outfits", label: "Outfits" },
];

export function SectionNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.sectionNav}>
      {SECTIONS.map((section) => (
        <Link
          key={section.href}
          href={section.href}
          className={`${styles.sectionTab} ${pathname === section.href ? styles.active : ""}`}
        >
          {section.label}
        </Link>
      ))}
    </nav>
  );
}
