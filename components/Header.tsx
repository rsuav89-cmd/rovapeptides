"use client";

import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, FileCheck2, User } from "lucide-react";
import { headerUtilityLinks, primaryNav } from "@/lib/site";
import { useCart } from "@/components/cart/CartContext";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { SearchOverlay } from "./SearchOverlay";
import { CollectionsMegaMenu } from "@/components/catalog/CollectionsMegaMenu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, open, lastAddedId } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={[
          "sticky top-0 z-40 h-[var(--header-h)] transition-[background-color,box-shadow,border-color] duration-280 ease-out-expo",
          // Scrolled: a warm graphite frosted bar (readable over both dark and
          // warm-light sections as the page scrolls beneath it). At the top it
          // is transparent over the dark hero. White text throughout.
          scrolled
            ? "border-b border-line bg-graphite/85 shadow-card backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-9">
            <span
              className={[
                "inline-block origin-left transition-transform duration-280 ease-out-expo will-change-transform",
                scrolled ? "scale-[0.92]" : "scale-100",
              ].join(" ")}
            >
              <Logo />
            </span>

            <nav className="hidden items-center gap-1 lg:flex">
              <CollectionsMegaMenu />
              <ul className="flex items-center gap-1">
                {primaryNav.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.9rem] text-ink-2 transition-colors duration-160 hover:text-ink"
                    >
                      {item.label}
                      {item.badge && (
                        <span className="rounded-full bg-brand-cta/90 px-1.5 py-0.5 font-mono text-[0.55rem] font-semibold uppercase tracking-widest text-white">
                          {item.badge}
                        </span>
                      )}
                      <span className="pointer-events-none absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 bg-brand-cta transition-transform duration-220 ease-out-expo group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="/coas"
              className="hidden items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm font-medium transition-[transform,border-color,background-color] duration-160 ease-out-expo hover:border-ink hover:bg-white/[0.03] active:scale-95 md:inline-flex"
            >
              <FileCheck2 className="h-4 w-4 text-signal-ink" strokeWidth={2} />
              View COAs
            </a>

            {headerUtilityLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:text-ink lg:inline-flex"
              >
                {link.label === "Account" && <User className="h-4 w-4" strokeWidth={2} />}
                {link.label}
              </a>
            ))}

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="grid h-10 w-10 place-items-center rounded-full transition-[transform,background-color] duration-160 ease-out-expo hover:bg-white/[0.05] active:scale-90"
            >
              <Search className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.9} />
            </button>

            <button
              type="button"
              onClick={open}
              aria-label={`Cart, ${count} items`}
              className="relative grid h-10 w-10 place-items-center rounded-full transition-[transform,background-color] duration-160 ease-out-expo hover:bg-white/[0.05] active:scale-90"
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.9} />
              {count > 0 && (
                <span
                  key={count}
                  className={[
                    "absolute -right-0.5 -top-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-brand-cta px-1 font-mono text-[0.62rem] font-bold text-white",
                    lastAddedId ? "animate-[badge-pop_260ms_cubic-bezier(0.34,1.3,0.5,1)]" : "",
                  ].join(" ")}
                >
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full transition-transform duration-160 ease-out-expo hover:bg-white/[0.05] active:scale-90 lg:hidden"
            >
              <Menu className="h-[1.3rem] w-[1.3rem]" strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
