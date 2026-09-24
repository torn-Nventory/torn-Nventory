import type {
  User,
  Faction,
  KeyInfoResponse,
  TornItemCategory,
  TornInventoryItemType,
} from "torn-client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { tornFetch, paths } from "@nuxx/torn-fetch";

const API_KEY_STORAGE = "torn_api_key";

type ApiKey = string | null;

type AppContext = {
  // App state
  mounted: boolean;

  // API authentication
  apiKey: ApiKey;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;

  // API key information / permissions
  keyInfo: KeyInfoResponse | null;

  // User data
  user: User | null;
  faction: Faction | null;
  inventory: Record<TornItemCategory, TornInventoryItemType[]> | null;

  // API
  callApi: <T = unknown>(
    path: keyof paths,
    params?: Record<string, unknown>,
  ) => Promise<T>;
};

const AppContext = createContext<AppContext | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside <Provider>");
  }

  return context;
}

type ProviderProps = {
  children: ReactNode;
};

export function Provider({ children }: ProviderProps) {
  const [mounted, setMounted] = useState(false);

  const [apiKey, setApiKeyState] = useState<ApiKey>(null);

  const [keyInfo, setKeyInfo] = useState<KeyInfoResponse | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const [faction, setFaction] = useState<Faction | null>(null);

  const [inventory, setInventory] = useState<Record<
    TornItemCategory,
    TornItem[]
  > | null>(null);

  /**
   * Load the API key from localStorage.
   *
   * The key itself is intentionally kept separate from
   * the rest of the application/user data.
   */
  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE);

    if (storedKey) {
      setApiKeyState(storedKey);
    }

    setMounted(true);
  }, []);

  /**
   * Save a new API key.
   */
  const setApiKey = (newKey: string) => {
    const trimmedKey = newKey.trim();

    if (!trimmedKey) {
      clearApiKey();

      return;
    }

    localStorage.setItem(API_KEY_STORAGE, trimmedKey);
    setApiKeyState(trimmedKey);
  };

  /**
   * Remove the API key and associated API-derived state.
   */
  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE);

    setApiKeyState(null);
    setKeyInfo(null);
    setUser(null);
    setFaction(null);
    setInventory(null);
  };

  /**
   * Generic Torn API request.
   */
  const callApi = async <T = unknown,>(
    path: keyof paths,
    params: Record<string, unknown> = {},
  ): Promise<T> => {
    if (!apiKey) {
      throw new Error("No Torn API key configured");
    }

    try {
      const data = await tornFetch(apiKey, path, params);

      return data as T;
    } catch (error) {
      console.error("Torn API Error:", error);
      throw error;
    }
  };

  /**
   * Load information about the API key.
   *
   * This is kept in context because KeyInfoResponse determines
   * what the user is allowed to access.
   */
  useEffect(() => {
    if (!mounted || !apiKey) {
      return;
    }

    let cancelled = false;

    async function loadKeyInfo() {
      try {
        const data = await callApi<KeyInfoResponse>("/key/info");

        if (!cancelled) {
          setKeyInfo(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load API key information:", error);

          // Invalid/revoked key, for example.
          setKeyInfo(null);
        }
      }
    }

    loadKeyInfo();

    return () => {
      cancelled = true;
    };
  }, [mounted, apiKey]);

  const value: AppContext = {
    mounted,

    apiKey,
    setApiKey,
    clearApiKey,

    keyInfo,

    user,
    faction,
    inventory,

    callApi,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}