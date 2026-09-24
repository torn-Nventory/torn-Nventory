import { useEffect, useMemo, useState } from "react";

import { useApp } from "@/context";

import InventorySelection, {
  type InventorySort,
} from "./inventory-selection";
import InventoryTable, {
  type InventoryRow,
} from "./inventory-table";
import RefreshInventoryButton from "./inventory-refresh-button";
import { Key } from "@heroui/react";

//const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100, 250, 500] as const;


export default function InventoryPage() {
  const { inventory, items } = useApp();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Flower");
  const [sort, setSort] = useState<InventorySort>("name-asc");

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [includedRows, setIncludedRows] = useState<Key[]>(["icon", "total"]);


  const categories = useMemo(() => {
    const values = new Set<string>();

    for (const inventoryItem of Object.values(inventory)) {
      const item = items[inventoryItem.id];

      if (item?.type) {
        values.add(item.type);
      }
    }

    return Array.from(values).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [inventory, items]);

  const rows = useMemo<InventoryRow[]>(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result: InventoryRow[] = [];

    for (const inventoryItem of Object.values(inventory)) {
      const item = items[inventoryItem.id];

      if (!item) {
        continue;
      }

      if (category !== "all" && item.type !== category) {
        continue;
      }

      if (
        normalizedSearch &&
        !item.name.toLowerCase().includes(normalizedSearch) &&
        !item.type.toLowerCase().includes(normalizedSearch)
      ) {
        continue;
      }

      result.push({
        inventory: inventoryItem,
        item,
      });
    }

    result.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.item.name.localeCompare(b.item.name);

        case "name-desc":
          return b.item.name.localeCompare(a.item.name);

        case "quantity-asc":
          return a.inventory.amount - b.inventory.amount;

        case "quantity-desc":
          return b.inventory.amount - a.inventory.amount;

        case "value-asc":
          return (
            a.item.value.market_price * a.inventory.amount -
            b.item.value.market_price * b.inventory.amount
          );

        case "value-desc":
          return (
            b.item.value.market_price * b.inventory.amount -
            a.item.value.market_price * a.inventory.amount
          );

        default:
          return 0;
      }
    });

    return result;
  }, [inventory, items, search, category, sort]);

  // Reset to the first page whenever the result set changes.
  useEffect(() => {
    setPage(1);
  }, [search, category, sort, itemsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(rows.length / itemsPerPage),
  );

  const safePage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;

    return rows.slice(start, start + itemsPerPage);
  }, [rows, safePage, itemsPerPage]);

  const firstItem =
    rows.length === 0
      ? 0
      : (safePage - 1) * itemsPerPage + 1;

  const lastItem = Math.min(
    safePage * itemsPerPage,
    rows.length,
  );

  return (
    <section className="flex flex-col items-center gap-6 px-4 py-8 md:py-10">
      <div className="flex w-full max-w-5xl flex-row justify-between">
        <h1 className="text-2xl font-semibold">Inventory</h1>

        <RefreshInventoryButton />
      </div>

      <InventorySelection
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
        sort={sort}
        setSort={setSort}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        includedRows={includedRows}
        setIncludedRows={setIncludedRows}
      />

      <InventoryTable rows={paginatedRows} cat={category} includedRows={includedRows} />

      {rows.length > 0 && (
        <div className="flex w-full max-w-5xl items-center justify-between gap-4">
          <p className="text-sm text-muted">
            Showing {firstItem.toLocaleString()}–
            {lastItem.toLocaleString()} of{" "}
            {rows.length.toLocaleString()}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => {
                setPage((current) => Math.max(1, current - 1));
              }}
              className="rounded border px-3 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="min-w-20 text-center text-sm">
              Page {safePage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => {
                setPage((current) =>
                  Math.min(totalPages, current + 1),
                );
              }}
              className="rounded border px-3 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
