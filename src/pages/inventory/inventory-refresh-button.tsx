import { useEffect, useRef, useState } from "react";

import { Button, Tooltip } from "@heroui/react";

import { useApp } from "@/context";

const COOLDOWN_SECONDS = 15;

export default function RefreshInventoryButton() {
  const { loadInventory } = useApp();

  const [isPending, setIsPending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const cooldownTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const cooldownIntervalRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimeoutRef.current) {
        clearTimeout(cooldownTimeoutRef.current);
      }

      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  const startCooldown = () => {
    const expiresAt =
      Date.now() + COOLDOWN_SECONDS * 1000;

    setCooldown(COOLDOWN_SECONDS);

    cooldownIntervalRef.current = setInterval(() => {
      const remaining = Math.ceil(
        (expiresAt - Date.now()) / 1000,
      );

      if (remaining <= 0) {
        setCooldown(0);

        if (cooldownIntervalRef.current) {
          clearInterval(cooldownIntervalRef.current);
          cooldownIntervalRef.current = null;
        }

        return;
      }

      setCooldown(remaining);
    }, 250);

    cooldownTimeoutRef.current = setTimeout(() => {
      setCooldown(0);

      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
        cooldownIntervalRef.current = null;
      }

      cooldownTimeoutRef.current = null;
    }, COOLDOWN_SECONDS * 1000);
  };

  const handleRefresh = async () => {
    if (isPending || cooldown > 0) {
      return;
    }

    setIsPending(true);

    try {
      await loadInventory();
      startCooldown();
    } catch (error) {
      console.error(
        "Failed to refresh inventory:",
        error,
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Tooltip delay={0}>
      <Button
        variant="primary"
        isPending={isPending}
        isDisabled={isPending || cooldown > 0}
        onPress={handleRefresh}
        className="min-w-40 rounded-xl"
      >
        {({ isPending: pending }) => {
          if (pending) {
            return "Refreshing...";
          }

          if (cooldown > 0) {
            return `Refresh in ${cooldown}s`;
          }

          return "Refresh Inventory";
        }}
      </Button>

      <Tooltip.Content>
        <p>
          Inventory only updates hourly, spamming this button
          does nothing but use your allowance.
        </p>
      </Tooltip.Content>
    </Tooltip>
  );
}