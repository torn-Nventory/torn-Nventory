import { useApp } from "@/context";
import { Plus, SlidersVertical, ChevronDown } from "@gravity-ui/icons";
import { Button, Card, Chip } from "@heroui/react";
import { useState, useMemo } from "react";
import { TornInventoryItemType, TornItem } from "torn-client";
type IInventorySort = "quantity-high" | "quantity-low" | "a-z" | "z-a"

export default ({ items }: { items: TornItem[] }) => {
  const { inventory } = useApp()

  const itemCount = 0;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TornInventoryItemType | "all">("all");
  const [sort, setSort] = useState<IInventorySort>("a-z");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = items.filter((item) => {
      if (category !== "all" && item.type !== category) {
        return false;
      }

      if (query) {
        const searchable = [
          item.id,
          item.name
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchable.includes(query)) {
          return false;
        }
      }

      return true;
    });

    result.sort((a, b) => {
      switch (sort) {
        case "quantity-high":
          return (b. ?? 0) - (getContractValue(a) ?? 0);

        case "quantity-low":
          return (getContractValue(a) ?? 0) - (getContractValue(b) ?? 0);

        case "progress":
          return (getProgress(b) ?? 0) - (getProgress(a) ?? 0);

        case "newest":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

    return result;
  }, [contracts, search, type, status, sort]);

  const activeFilterCount =
    (type !== "all" ? 1 : 0) + (status !== "all" ? 1 : 0);

  function clearFilters() {
    setSearch("");
    setType("all");
    setStatus("all");
    setSort("quantity-low");
  }
  return (
    <div className="space-y-8 w-full">
      <header className="flex gap-4 flex-row items-end justify-between">
        <p className="font-medium text-default-500">Inventory</p>

        <Button variant="primary">
          <Plus className="size-4" />
          New contract
        </Button>
      </header>

      <Card className="w-full">
        <Card.Header className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-default-100">
              <SlidersVertical className="size-5" />
            </div>

            <div>
              <h2 className="font-semibold">Filter & sort</h2>

              <p className="text-sm text-default-500">
                {filteredItems.length} of {itemCount} items
              </p>
            </div>

            {activeFilterCount > 0 && (
              <Chip size="sm" variant="soft">
                {activeFilterCount} active
              </Chip>
            )}
          </div>

          <Button
            isIconOnly
            variant="ghost"
            aria-label={filtersOpen ? "Hide filters" : "Show filters"}
            onPress={() => setFiltersOpen((open) => !open)}
          >
            <ChevronDown
              className={`size-4 transition-transform ${filtersOpen ? "rotate-180" : ""
                }`}
            />
          </Button>
        </Card.Header>

        {filtersOpen && (
          <>
            <div className="border-t border-default-200" />

            <Card.Content>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Input
                  aria-label="Search"
                  placeholder="Search items..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  variant="secondary"
                />

                <CategorySelect
                  label="Category type"
                  value={category}
                  options={[
                    { id: "all", label: "All types" },
                    {
                      id: "bounty",
                      label: "Bounty",
                      icon: <Target className="size-4" />,
                    },
                    {
                      id: "revive",
                      label: "Revive",
                      icon: <Stethoscope className="size-4" />,
                    },
                    {
                      id: "hosp",
                      label: "Hosp",
                      icon: <TargetDart className="size-4" />,
                    },
                  ]}
                  onChange={(value) => {
                    if (
                      value === "all" ||
                      value === "bounty" ||
                      value === "revive" ||
                      value === "hosp"
                    ) {
                      setType(value);
                    }
                  }}
                />

                <ContractSelect
                  label="Sort by"
                  value={sort}
                  options={[
                    {
                      id: "quantity-high",
                      label: "Quantity: high to low",
                      icon: <ArrowShapeDown className="size-4" />,
                    },
                    {
                      id: "quantity-low",
                      label: "Quantity: low to high",
                      icon: <ArrowShapeUp className="size-4" />,
                    }
                  ]}
                  onChange={(value: string) => {
                    if (
                      value === "quantity-high" ||
                      value === "quantity-low"
                    ) {
                      setSort(value);
                    }
                  }}
                />
              </div>

              {(activeFilterCount > 0 || search.length > 0) && (
                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="ghost" onPress={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              )}
            </Card.Content>
          </>
        )}
      </Card>

      {filteredItems.length === 0 ? (
        <EmptyState
          hasFilters={Boolean(search) || activeFilterCount > 0}
          onClear={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((contract) => (
            <InventoryCard items={filteredItems} />
          ))}
        </div>
      )}
    </div>
  );
}