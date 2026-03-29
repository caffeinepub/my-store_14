import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Facebook,
  Instagram,
  Search,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { CartItem } from "../App";
import { useProducts } from "../hooks/useQueries";
import type { Product } from "../types";
import CartSheet from "./CartSheet";
import ProductCard from "./ProductCard";

interface StorefrontProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateCartItem: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onNavigateAdmin: () => void;
}

const COLLECTIONS = [
  {
    title: "SERUMS & OILS",
    subtitle: "Concentrated actives for luminous skin",
    image: "/assets/generated/collection-serums.dim_600x400.jpg",
  },
  {
    title: "MOISTURIZERS",
    subtitle: "Deep hydration for every skin type",
    image: "/assets/generated/collection-moisturizers.dim_600x400.jpg",
  },
  {
    title: "CLEANSERS",
    subtitle: "Gentle purifying rituals",
    image: "/assets/generated/collection-cleansers.dim_600x400.jpg",
  },
];

const JOURNALS = [
  {
    title: "5 Steps to Glowing Skin",
    category: "SKINCARE TIPS",
    date: "March 12, 2026",
    excerpt:
      "Unlock your skin's natural luminosity with our expertly curated five-step routine designed for modern lifestyles.",
    image: "/assets/generated/journal-glowing-skin.dim_600x400.jpg",
  },
  {
    title: "Winter Skincare Rituals",
    category: "SEASONAL",
    date: "February 28, 2026",
    excerpt:
      "Cold weather calls for richer textures and deeper hydration. Discover the products your skin craves this winter.",
    image: "/assets/generated/journal-winter-ritual.dim_600x400.jpg",
  },
  {
    title: "Morning Glow Routine",
    category: "ROUTINES",
    date: "January 15, 2026",
    excerpt:
      "Start your day with intention. Our morning ritual combines gentle cleansing with protective layers for all-day radiance.",
    image: "/assets/generated/journal-morning-glow.dim_600x400.jpg",
  },
];

export default function Storefront({
  cart,
  onAddToCart,
  onUpdateCartItem,
  onClearCart,
  onNavigateAdmin,
}: StorefrontProps) {
  const { data: products = [], isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  const scrollToProducts = () => {
    document
      .getElementById("bestsellers")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Announcement bar */}
      <div className="bg-announcement text-announcement-foreground text-xs text-center py-2.5 px-4 font-medium tracking-wide">
        ✨ Free shipping on orders over $50 &nbsp;·&nbsp; Use code{" "}
        <span className="font-bold underline underline-offset-2">
          WELCOME10
        </span>{" "}
        for 10% off
      </div>

      {/* Header */}
      <header className="bg-header border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="shrink-0">
            <span className="font-serif font-bold text-xl tracking-[0.18em] text-foreground uppercase">
              Glow Aura
            </span>
          </div>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {["SHOP", "COLLECTIONS", "BESTSELLERS", "ABOUT"].map((item) => (
              <button
                key={item}
                data-ocid="nav.link"
                type="button"
                onClick={() => {
                  if (item === "BESTSELLERS") scrollToProducts();
                  if (item === "COLLECTIONS") {
                    document
                      .getElementById("collections")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                  if (item === "SHOP") scrollToProducts();
                }}
                className="text-xs tracking-[0.12em] font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Right utilities */}
          <div className="flex items-center gap-2">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                data-ocid="store.search_input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs bg-background/60 border-border w-36 focus-visible:w-48 transition-all focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
            <Button
              data-ocid="admin.link"
              variant="ghost"
              size="sm"
              onClick={onNavigateAdmin}
              className="gap-1.5 text-muted-foreground hover:text-foreground text-xs h-8"
            >
              <Settings className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
            <CartSheet
              cart={cart}
              onUpdateCartItem={onUpdateCartItem}
              onClearCart={onClearCart}
            />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative w-full overflow-hidden"
          style={{ minHeight: 420 }}
        >
          <img
            src="/assets/generated/hero-glow-aura.dim_1200x480.jpg"
            alt="Glow Aura hero"
            className="w-full h-[420px] sm:h-[480px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/55 via-foreground/20 to-transparent flex items-center">
            <div className="px-8 sm:px-16 max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-white/80 text-xs tracking-[0.2em] uppercase mb-3 font-medium"
              >
                New Season Collection
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-white font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight uppercase tracking-wide"
              >
                Embrace Your Natural Radiance
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/75 mt-3 text-sm tracking-wider uppercase"
              >
                Discover the art of glowing skin.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6"
              >
                <Button
                  data-ocid="store.primary_button"
                  onClick={scrollToProducts}
                  className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 rounded-none px-8 py-3 h-auto text-xs tracking-[0.15em] uppercase"
                >
                  Shop the Glow
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <section
          id="collections"
          className="max-w-6xl mx-auto px-4 sm:px-6 py-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-center uppercase tracking-[0.15em] text-2xl sm:text-3xl text-foreground mb-10"
          >
            Featured Collections
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {COLLECTIONS.map((col, i) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-sm cursor-pointer"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="font-serif text-white font-bold tracking-[0.12em] uppercase text-lg">
                    {col.title}
                  </h3>
                  <p className="text-white/75 text-xs mt-1 mb-3">
                    {col.subtitle}
                  </p>
                  <button
                    type="button"
                    className="self-start text-xs tracking-[0.12em] uppercase text-primary font-semibold border-b border-primary pb-0.5 hover:text-white hover:border-white transition-colors"
                  >
                    Shop Now →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bestsellers */}
        <section id="bestsellers" className="bg-secondary/40 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="font-serif uppercase tracking-[0.15em] text-2xl sm:text-3xl text-foreground">
                Bestsellers
              </h2>
              {products.length > 0 && (
                <p className="text-muted-foreground text-sm mt-2">
                  {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                </p>
              )}
            </motion.div>

            {/* Mobile search */}
            <div className="relative lg:hidden mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                data-ocid="store.search_input"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {isLoading ? (
              <div
                data-ocid="store.loading_state"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-card rounded-sm border border-border overflow-hidden"
                  >
                    <Skeleton className="h-52 w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-8 w-full mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                data-ocid="store.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="font-serif text-lg">
                  {search ? "No products match your search" : "Coming Soon"}
                </p>
                <p className="text-sm mt-1 text-muted-foreground/60">
                  {search
                    ? "Try a different search term"
                    : "Our curated collection is being prepared for you"}
                </p>
                {search && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.07 } },
                }}
              >
                {filtered.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart}
                      index={idx + 1}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Glow Journals */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-center uppercase tracking-[0.15em] text-2xl sm:text-3xl text-foreground mb-10"
          >
            Glow Journals
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {JOURNALS.map((journal, i) => (
              <motion.article
                key={journal.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden rounded-sm mb-4">
                  <img
                    src={journal.image}
                    alt={journal.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs tracking-[0.15em] text-primary font-medium uppercase mb-1">
                  {journal.category}
                </p>
                <h3 className="font-serif text-foreground font-semibold text-lg leading-snug group-hover:text-primary transition-colors">
                  {journal.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-2 leading-relaxed line-clamp-2">
                  {journal.excerpt}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-3">
                  {journal.date}
                </p>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-footer text-footer-foreground mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <h3 className="font-serif font-bold text-2xl tracking-[0.15em] uppercase mb-3 text-foreground">
                Glow Aura
              </h3>
              <p className="text-footer-foreground/60 text-sm leading-relaxed mb-5">
                Luxurious modern beauty & skincare, curated for your most
                radiant self.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary transition-colors"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground/50 hover:text-primary hover:border-primary transition-colors"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="font-semibold text-xs tracking-[0.15em] uppercase text-foreground mb-4">
                Shop
              </h4>
              <ul className="space-y-2.5 text-sm text-footer-foreground/60">
                {[
                  "Serums & Oils",
                  "Moisturizers",
                  "Cleansers",
                  "Gift Sets",
                ].map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="hover:text-primary transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="font-semibold text-xs tracking-[0.15em] uppercase text-foreground mb-4">
                About
              </h4>
              <ul className="space-y-2.5 text-sm text-footer-foreground/60">
                {["Our Story", "Ingredients", "Sustainability", "Press"].map(
                  (item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="hover:text-primary transition-colors"
                      >
                        {item}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-xs tracking-[0.15em] uppercase text-foreground mb-4">
                Join the Glow
              </h4>
              <p className="text-sm text-footer-foreground/60 mb-3 leading-relaxed">
                Skincare rituals, exclusive offers & early access.
              </p>
              <div className="flex gap-2">
                <Input
                  data-ocid="footer.input"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/40 border-border text-foreground placeholder:text-muted-foreground text-xs h-9 rounded-none"
                />
                <Button
                  data-ocid="footer.primary_button"
                  className="bg-primary text-primary-foreground shrink-0 text-xs tracking-wider rounded-none h-9 px-4"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border/40 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-footer-foreground/40">
            <span>
              © {new Date().getFullYear()} Glow Aura. All rights reserved.
            </span>
            <span>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-footer-foreground/70 transition-colors"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
