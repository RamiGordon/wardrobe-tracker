"use client";

import { useEffect, useRef, useState } from "react";
import { signOutAction } from "@/actions/auth";
import styles from "./UserAvatar.module.css";

interface UserAvatarProps {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

export function UserAvatar({ name, email, image }: UserAvatarProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = (name || email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className={styles.root} ref={rootRef}>
      <button className={styles.trigger} onClick={() => setOpen((o) => !o)}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.avatarImg} src={image} alt="" />
        ) : (
          <span className={styles.avatarFallback}>{initials}</span>
        )}
      </button>
      {open && (
        <div className={styles.menu}>
          <div className={styles.menuInfo}>
            {name && <div className={styles.menuName}>{name}</div>}
            {email && <div className={styles.menuEmail}>{email}</div>}
          </div>
          <form action={signOutAction}>
            <button className={styles.menuSignOut} type="submit">
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
