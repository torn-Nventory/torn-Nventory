import {
  Card,
  Input,
  Key,
  Label,
  ListBox,
  Select,
} from "@heroui/react";

export type InventorySort =
  | "name-asc"
  | "name-desc"
  | "quantity-asc"
  | "quantity-desc"
  | "value-asc"
  | "value-desc";

type InventorySelectionProps = {
  search: string;
  setSearch: (value: string) => void;

  category: string;
  setCategory: (value: string) => void;

  categories: string[];

  sort: InventorySort;
  setSort: (value: InventorySort) => void;

  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;

  includedRows: Key[];
  setIncludedRows: (value: Key[]) => void;

};

export default function InventorySelection({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  sort,
  setSort,
  itemsPerPage,
  setItemsPerPage,
  includedRows,
  setIncludedRows
}: InventorySelectionProps) {
  return (
    <Card className="w-full max-w-5xl">
      <Card.Content>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Input
            className="w-full"
            aria-label="Search"
            placeholder="Search inventory..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />

          <Select
            className="w-full"
            value={category}
            onChange={(value) => {
              setCategory(String(value));
            }}
          >
            <Label>Category</Label>

            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>

            <Select.Popover>
              <ListBox>
                <ListBox.Item
                  id="all"
                  textValue="All categories"
                >
                  All categories
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                {categories.map((value) => (
                  <ListBox.Item
                    key={value}
                    id={value}
                    textValue={value}
                  >
                    {value}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Select
            className="w-full"
            value={sort}
            onChange={(value) => {
              setSort(String(value) as InventorySort);
            }}
          >
            <Label>Sort</Label>

            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>

            <Select.Popover>
              <ListBox>
                <ListBox.Item id="name-asc" textValue="Name A to Z">
                  Name A → Z
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                <ListBox.Item id="name-desc" textValue="Name Z to A">
                  Name Z → A
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                <ListBox.Item
                  id="quantity-desc"
                  textValue="Quantity highest first"
                >
                  Quantity ↓
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                <ListBox.Item
                  id="quantity-asc"
                  textValue="Quantity lowest first"
                >
                  Quantity ↑
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                <ListBox.Item
                  id="value-desc"
                  textValue="Value highest first"
                >
                  Value ↓
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                <ListBox.Item
                  id="value-asc"
                  textValue="Value lowest first"
                >
                  Value ↑
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>

          <Select
            className="w-full"
            value={String(itemsPerPage)}
            onChange={(value) => {
              setItemsPerPage(Number(value));
            }}
          >
            <Label>Items per page</Label>

            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>

            <Select.Popover>
              <ListBox>
                <ListBox.Item id="10" textValue="10 items">
                  10
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="25" textValue="25 items">
                  25
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                <ListBox.Item id="50" textValue="50 items">
                  50
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                <ListBox.Item id="100" textValue="100 items">
                  100
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                <ListBox.Item id="250" textValue="250 items">
                  250
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                <ListBox.Item id="500" textValue="500 items">
                  500
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
          <Select
            selectionMode="multiple"
            className="w-full"
            value={includedRows}
            onChange={(value) => {
              setIncludedRows(value);
            }}
          >
            <Label>Included Rows</Label>

            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>

            <Select.Popover>
              <ListBox>
                <ListBox.Item id="icon" textValue="Icon">
                  Icon
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="cheapest" textValue="Cheapest Value">
                  Cheapest Value
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="market" textValue="Market Value">
                  Market Value
                  <ListBox.ItemIndicator />
                </ListBox.Item>

                <ListBox.Item id="total" textValue="Total Value">
                  Total Value
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </Card.Content>
    </Card>
  );
}
