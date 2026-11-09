"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeTriggerButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" size="icon" aria-label="Change theme" {...props}>
      <SunIcon className="dark:hidden" />
      <MoonIcon className="hidden dark:block" />
    </Button>
  );
}

// The dropdown (Radix menu, popper and focus handling) is about 25 KB of
// gzipped JS that most visits never use. It loads when the button is
// pointed at or focused, and the first click opens it.
const loadMenu = () => import("@/components/site/theme-menu");
const ThemeMenu = dynamic(() => loadMenu().then((m) => m.ThemeMenu), {
  ssr: false,
  loading: () => <ThemeTriggerButton />,
});

export function ThemeToggle() {
  const [active, setActive] = useState(false);
  if (active) return <ThemeMenu defaultOpen />;
  return (
    <ThemeTriggerButton
      aria-haspopup="menu"
      onPointerEnter={() => void loadMenu()}
      onFocus={() => void loadMenu()}
      onClick={() => setActive(true)}
    />
  );
}
