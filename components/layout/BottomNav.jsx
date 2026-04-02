"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Início" },
  { href: "/fixos", label: "Fixos" },
  { href: "/variaveis", label: "Variáveis" },
  { href: "/cartoes", label: "Cartões" },
  { href: "/dividas", label: "Dívidas" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottomNav">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`navItem ${pathname === item.href ? "active" : ""}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
