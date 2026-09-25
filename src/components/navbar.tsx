"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useApp } from "@/context";

import { Alert, CloseButton } from "@heroui/react";
import { LogoGithub } from '@gravity-ui/icons';
import { ThemeSwitch } from "./theme-switch";
import BalanceDropdown from "./balance-dropdown";

const publicNavMenuItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];
const userNavMenuItems = [
  {
    label: "Inventory",
    href: "/inventory",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];


export const Navbar = () => {
  const { apiKey, factionBalance } = useApp();
  const { pathname } = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dismissedWarning, setDismissedWarning] = useState(false);

  // Close mobile menu whenever the route changes.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navContent = apiKey
    ? userNavMenuItems
    : publicNavMenuItems;

  return (
    <div className="sticky top-0 z-40 w-full">
      <nav className="w-full border-b border-separator bg-background/70 backdrop-blur-lg">
        <header className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <Link
              className="flex items-center gap-1"
              to={apiKey ? "/inventory" : "/"}
              onClick={() => setIsMenuOpen(false)}
            >
              <p className="font-bold text-inherit">Nventory</p>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <BalanceDropdown apiKey={apiKey} factionBalance={factionBalance} />
            <Link to="https://github.com/torn-Nventory/torn-Nventory.github.io">
              <LogoGithub />
            </Link>
            <ThemeSwitch />

            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="p-2 cursor-pointer"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                ) : (
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                )}
              </svg>
            </button>
          </div>
        </header>

        {isMenuOpen && (
          <div className="border-t border-separator">
            <ul className="flex flex-col gap-2 p-4">
              {navContent.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" &&
                    pathname.startsWith(`${item.href}/`));

                return (
                  <li key={item.href}>
                    <Link
                      className={clsx(
                        "block py-2 text-lg no-underline transition-colors",
                        isActive
                          ? "font-semibold text-accent"
                          : "text-foreground",
                      )}
                      to={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {!apiKey && !dismissedWarning && (
        <div className="p-3">
          <Alert status="danger">
            <Alert.Indicator />

            <Alert.Content>
              <Alert.Title>Unable to load API key</Alert.Title>

              <Alert.Description>
                We're experiencing issues loading your API key from the
                database. Please try the following:

                <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                  <li>Check your internet connection</li>
                  <li>Make sure you have set your API key</li>
                </ul>
              </Alert.Description>

              <Link
                className="mt-2"
                to="/settings"
                onClick={() => setDismissedWarning(true)}
              >
                Click here to go to /settings
              </Link>
            </Alert.Content>

            <CloseButton
              onClick={() => setDismissedWarning(true)}
            />
          </Alert>
        </div>
      )}
    </div>
  );
};