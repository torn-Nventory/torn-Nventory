import {
  TornAPI,
  type FactionBasic,
  type KeyInfoResponse,
  type TornItem,
  type UserBasic,
  type UserInventoryItem,
  type TornInventoryItemType,
} from "torn-client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "@heroui/react";

// -----------------------------------------------------------------------------
// Storage
// -----------------------------------------------------------------------------

const STORAGE = {
  apiKey: "torn_api_key",
  user: "torn_user_key",
  faction: "torn_faction_key",
  factionBalance: "torn_faction_balance_key",
  inventory: "torn_inventory_key",
  items: "torn_items_key",
} as const;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type ApiKey = string | null;

type ItemsById = Record<number, TornItem>;
type InventoryById = Record<number, UserInventoryItem>;



type AppContext = {
  mounted: boolean;

  // Authentication
  apiKey: ApiKey;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;

  // API
  client: TornAPI | null;
  keyInfo: KeyInfoResponse["info"] | null;

  // Cached data
  user: UserBasic | null;
  faction: FactionBasic | null;
  factionBalance: IFactionBalance;
  inventory: InventoryById;
  items: ItemsById;

  // API helpers
  loadUser: () => Promise<UserBasic>;
  loadFaction: () => Promise<FactionBasic | null>;
  loadFactionBalance: (userId?: number) => Promise<IFactionBalance | null>;
  loadInventory: () => Promise<UserInventoryItem[]>;
  loadItems: () => Promise<TornItem[]>;
};

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const INVENTORY_CATEGORIES = [
  "Artifact",
  "Book",
  "Booster",
  "Candy",
  "Clothing",
  "Collectible",
  "Defensive",
  "Drug",
  "Energy Drink",
  "Enhancer",
  "Flower",
  "Jewelry",
  "Material",
  "Medical",
  "Other",
  "Plushie",
  "Supply Pack",
  "Tool",
  "Temporary",
  "Primary",
  "Secondary",
  "Melee",
] satisfies TornInventoryItemType[];

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

const AppContext = createContext<AppContext | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside <Provider>");
  }

  return context;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function readStorage<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to read localStorage key "${key}":`, error);
    return null;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write localStorage key "${key}":`, error);
  }
}

function removeStorage(...keys: string[]) {
  for (const key of keys) {
    localStorage.removeItem(key);
  }
}

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

type ProviderProps = {
  children: ReactNode;
};

export function Provider({ children }: ProviderProps) {
  // ---------------------------------------------------------------------------
  // Mount state
  // ---------------------------------------------------------------------------

  const [mounted, setMounted] = useState(false);

  // ---------------------------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------------------------

  const [apiKey, setApiKeyState] = useState<ApiKey>(null);
  const [keyInfo, setKeyInfo] = useState<KeyInfoResponse["info"] | null>(null);

  // ---------------------------------------------------------------------------
  // Small/important cached data
  // ---------------------------------------------------------------------------

  const [user, setUser] = useState<UserBasic | null>(null);
  const [faction, setFaction] = useState<FactionBasic | null>(null);
  const [factionBalance, setFactionBalance] = useState<IFactionBalance>({
    points: null,
    money: null
  });
  const [inventory, setInventory] = useState<InventoryById>({});

  // ---------------------------------------------------------------------------
  // Large item cache
  //
  // Keep the actual 4k-item object in a ref.
  //
  // Updating a ref does NOT cause a provider-wide rerender.
  // We still expose a snapshot through state when the item cache changes.
  // ---------------------------------------------------------------------------

  const itemsRef = useRef<ItemsById>({});
  const [itemsVersion, setItemsVersion] = useState(0);

  const items = itemsRef.current;

  // ---------------------------------------------------------------------------
  // Torn API client
  // ---------------------------------------------------------------------------

  const client = useMemo(() => {
    if (!apiKey) {
      return null;
    }

    return new TornAPI({
      apiKeys: [apiKey],
      rateLimitMode: "autoDelay",
    });
  }, [apiKey]);

  // ---------------------------------------------------------------------------
  // Hydrate localStorage once
  // ---------------------------------------------------------------------------

  useEffect(() => {
    try {
      const storedApiKey = localStorage.getItem(STORAGE.apiKey);

      const storedUser = readStorage<UserBasic>(STORAGE.user);
      const storedFaction = readStorage<FactionBasic>(STORAGE.faction);
      const storedInventory = readStorage<InventoryById>(
        STORAGE.inventory,
      );
      const storedItems = readStorage<ItemsById>(STORAGE.items);

      if (storedApiKey) {
        setApiKeyState(storedApiKey);
      }

      if (storedUser) {
        setUser(storedUser);
      }

      if (storedFaction) {
        setFaction(storedFaction);
      }

      if (storedInventory) {
        setInventory(storedInventory);
      }

      if (storedItems) {
        itemsRef.current = storedItems;
        setItemsVersion((version) => version + 1);
      }

      toast.success("Successfully restored cached Torn data.");
    } catch (error) {
      console.error("Failed to restore cached Torn data:", error);

      toast.danger(
        "Failed to restore cached Torn data, check logs for more info.",
      );
    } finally {
      setMounted(true);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // API key
  // ---------------------------------------------------------------------------

  const setApiKey = useCallback((newKey: string) => {
    const trimmedKey = newKey.trim();

    if (!trimmedKey) {
      removeStorage(
        STORAGE.apiKey,
        STORAGE.user,
        STORAGE.faction,
        STORAGE.inventory,
        STORAGE.items,
      );

      setApiKeyState(null);
      setKeyInfo(null);
      setUser(null);
      setFaction(null);
      setInventory({});

      itemsRef.current = {};
      setItemsVersion((version) => version + 1);

      return;
    }

    localStorage.setItem(STORAGE.apiKey, trimmedKey);
    setApiKeyState(trimmedKey);
  }, []);

  const clearApiKey = useCallback(() => {
    removeStorage(
      STORAGE.apiKey,
      STORAGE.user,
      STORAGE.faction,
      STORAGE.inventory,
      STORAGE.items,
    );

    setApiKeyState(null);
    setKeyInfo(null);
    setUser(null);
    setFaction(null);
    setInventory({});

    itemsRef.current = {};
    setItemsVersion((version) => version + 1);
  }, []);

  // ---------------------------------------------------------------------------
  // Cache helpers
  // ---------------------------------------------------------------------------

  const cacheUser = useCallback((data: UserBasic) => {
    setUser(data);
    writeStorage(STORAGE.user, data);
  }, []);

  const cacheFaction = useCallback((data: FactionBasic) => {
    setFaction(data);
    writeStorage(STORAGE.faction, data);
  }, []);

  const cacheFactionBalance = useCallback((data: IFactionBalance) => {
    setFactionBalance(data);
    writeStorage(STORAGE.factionBalance, data);
  }, []);

  /**
   * Replace the item cache in one operation.
   *
   * This is substantially cheaper than doing:
   *
   *   setItems(current => ({ ...current, ... }))
   *
   * 4,000 times.
   */
  const cacheItems = useCallback((newItems: TornItem[]) => {
    const next: ItemsById = {};

    for (const item of newItems) {
      next[item.id] = item;
    }

    itemsRef.current = next;

    // One React update.
    setItemsVersion((version) => version + 1);

    // One localStorage serialization.
    writeStorage(STORAGE.items, next);
  }, []);

  // ---------------------------------------------------------------------------
  // Load user
  // ---------------------------------------------------------------------------

  const loadUser = useCallback(async (): Promise<UserBasic> => {
    if (!client) {
      toast.danger("No Torn API key configured.");
      throw new Error("No Torn API key configured");
    }

    try {
      const response = await client.user.basic();

      cacheUser(response.profile);

      return response.profile;
    } catch (error) {
      console.error("Failed to load Torn user:", error);

      toast.danger(
        "Failed to load Torn user, check logs for more info.",
      );

      throw error;
    }
  }, [client, cacheUser]);

  // ---------------------------------------------------------------------------
  // Load faction + balance
  // ---------------------------------------------------------------------------

  const loadFaction = useCallback(
    async (): Promise<FactionBasic | null> => {
      if (!client) {
        toast.danger("No Torn API key configured.");
        throw new Error("No Torn API key configured");
      }

      try {
        const response = await client.faction.basic();
        const basic = response.basic ?? null;

        if (basic) {
          cacheFaction(basic);
        }

        return basic;
      } catch (error) {
        console.error("Failed to load Torn faction:", error);

        toast.danger(
          "Failed to load Torn faction, check logs for more info.",
        );

        throw error;
      }
    },
    [client, cacheFaction],
  );

  const loadFactionBalance = useCallback(
    async (userId?: number): Promise<IFactionBalance | null> => {
      if (!client) {
        toast.danger("No Torn API key configured.");
        throw new Error("No Torn API key configured");
      }

      try {
        const response = await client.faction.balance();
        const balances = response.balance ?? null;

        if (!balances) {
          return null;
        }

        // Use the explicitly supplied ID first.
        // Fall back to keyInfo from React state if available.
        const currentUserId = userId ?? keyInfo?.user.id;

        if (!currentUserId) {
          throw new Error("Unable to determine current Torn user ID");
        }

        const myBalance = balances.members.find(
          (member) => member.id === currentUserId,
        );

        console.log("response:", response);
        console.log("balances:", balances);
        console.log("myBalance:", myBalance);
        console.log("current user id:", currentUserId);

        const result: IFactionBalance = {
          points: myBalance?.points ?? null,
          money: myBalance?.money ?? null,
        };

        cacheFactionBalance(result);

        toast.success("Faction balance loaded");

        return result;
      } catch (error) {
        console.error("Failed to load Torn faction balance:", error);

        toast.danger(
          "Failed to load faction balance, check logs for more info.",
        );

        throw error;
      }
    },
    [client, keyInfo, cacheFactionBalance],
  );


  // ---------------------------------------------------------------------------
  // Load inventory
  // ---------------------------------------------------------------------------

  const loadInventory = useCallback(async (): Promise<
    UserInventoryItem[]
  > => {
    if (!client) {
      toast.danger("No Torn API key configured.");
      throw new Error("No Torn API key configured");
    }

    try {
      const inventoryItems: UserInventoryItem[] = [];

      for (const category of INVENTORY_CATEGORIES) {
        const response = await client.user.inventory({
          cat: category,
        });

        inventoryItems.push(
          ...(response.inventory.items ?? []),
        );
      }

      const nextInventory: InventoryById = {};

      for (const item of inventoryItems) {
        nextInventory[item.id] = item;
      }

      setInventory(nextInventory);
      writeStorage(STORAGE.inventory, nextInventory);

      toast.success("Successfully loaded inventory.");

      return inventoryItems;
    } catch (error) {
      console.error("Failed to load inventory:", error);

      toast.danger(
        "Failed to load inventory, check logs for more info.",
      );

      throw error;
    }
  }, [client]);

  // ---------------------------------------------------------------------------
  // Load item definitions
  // ---------------------------------------------------------------------------

  const loadItems = useCallback(async (): Promise<TornItem[]> => {
    if (!client) {
      toast.danger("No Torn API key configured.");
      throw new Error("No Torn API key configured");
    }

    try {
      const response = await client.torn.items();
      const tornItems = response.items ?? [];

      cacheItems(tornItems);

      toast.success(
        `Successfully loaded ${tornItems.length.toLocaleString()} Torn items.`,
      );

      return tornItems;
    } catch (error) {
      console.error("Failed to load Torn items:", error);

      toast.danger(
        "Failed to load Torn items, check logs for more info.",
      );

      throw error;
    }
  }, [client, cacheItems]);

  // ---------------------------------------------------------------------------
  // Load API key information
  //
  // IMPORTANT:
  // Do not depend on `items` here.
  //
  // Previously:
  //
  //   [mounted, client, items]
  //
  // meant every item-cache update could cause this effect to run again.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!mounted || !client) {
      return;
    }

    let cancelled = false;

    async function initialise() {

      try {
        if (!client) {
          return;
        }

        const data = await client.key.info();

        if (cancelled) {
          return;
        }

        setKeyInfo(data.info);

        // Only load the item database when we don't have one.
        if (Object.keys(itemsRef.current).length === 0) {
          await loadItems();
        }

        // IMPORTANT:
        // data.info is the freshly returned value.
        // Do not use keyInfo here because setKeyInfo() is asynchronous.
        await loadFactionBalance(data.info.user.id);

        if (!cancelled) {
          toast.success(
            "Successfully loaded and verified API key.",
          );
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load API key information:",
          error,
        );

        setKeyInfo(null);

        toast.danger(
          "Failed to load API key information, check logs for more info.",
        );
      }
    }

    initialise();

    return () => {
      cancelled = true;
    };
  }, [mounted, client, loadItems]);

  // ---------------------------------------------------------------------------
  // Context value
  // ---------------------------------------------------------------------------

  const value = useMemo<AppContext>(
    () => ({
      mounted,

      apiKey,
      setApiKey,
      clearApiKey,

      client,
      keyInfo,

      user,
      faction,
      factionBalance,
      inventory,

      // Reading items makes this component subscribe to itemsVersion.
      // The actual data remains in the ref.
      items,

      loadUser,
      loadFaction,
      loadFactionBalance,
      loadInventory,
      loadItems,
    }),
    [
      mounted,
      apiKey,
      setApiKey,
      clearApiKey,
      client,
      keyInfo,
      user,
      faction,
      factionBalance,
      inventory,
      itemsVersion,
      items,
      loadUser,
      loadFaction,
      loadFactionBalance,
      loadInventory,
      loadItems,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
