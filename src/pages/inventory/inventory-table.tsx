import type {
  TornItem,
  UserInventoryItem,
} from "torn-client";

import { Key, Table } from "@heroui/react";

export type InventoryRow = {
  inventory: UserInventoryItem;
  item: TornItem;
};

type InventoryTableProps = {
  rows: InventoryRow[];
  cat: string;
  includedRows: Key[]
};

function getCheapestShop(
  shops: InventoryRow["item"]["value"]["shops"],
) {
  return shops.reduce<typeof shops[number] | null>(
    (cheapest, shop) => {
      if (shop.buy_price == null) {
        return cheapest;
      }

      if (
        cheapest === null ||
        cheapest.buy_price == null ||
        shop.buy_price < cheapest.buy_price
      ) {
        return shop;
      }

      return cheapest;
    },
    null,
  );
}


export default function InventoryTable({
  rows,
  cat,
  includedRows
}: InventoryTableProps) {
  return (
    <div className="w-full max-w-5xl">
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Inventory">
            <Table.Header>
              <Table.Column id="icon" className={includedRows.includes("icon") ? "" : "hidden"}>
                Icon
              </Table.Column>
              <Table.Column id="name" isRowHeader>
                Name
              </Table.Column>

              <Table.Column id="category" className={cat === "all" ? "" : "hidden"}>
                Category
              </Table.Column>

              <Table.Column id="quantity">
                Quantity
              </Table.Column>


              <Table.Column id="cheapest" className={includedRows.includes("cheapest") ? "" : "hidden"}>
                Cheapest Value
              </Table.Column>

              <Table.Column id="market" className={includedRows.includes("market") ? "" : "hidden"}>
                Market Value
              </Table.Column>


              <Table.Column id="total-value" className={includedRows.includes("total") ? "" : "hidden"}>
                Total Value
              </Table.Column>

            </Table.Header>

            <Table.Body>
              {rows.length === 0 && <p className="flex justify-center p-16">
                No inventory items found.
              </p>}
              {rows.map((row) => <>
                <Table.Row id={String(row.inventory.id)}>

                  <Table.Cell className={includedRows.includes("icon") ? "" : "hidden"}>
                    <img src={`https://torn.com/images/items/${row.item.id}/medium.png`} alt={row.item.id.toString()} />

                  </Table.Cell>

                  <Table.Cell>
                    {row.item.name}
                  </Table.Cell>

                  <Table.Cell className={cat === "all" ? "" : "hidden"}>
                    {cat === "all" ? row.item.type : "—"}
                  </Table.Cell>

                  <Table.Cell>
                    {row.inventory.amount.toLocaleString()}
                  </Table.Cell>

                  <Table.Cell className={includedRows.includes("cheapest") ? "" : "hidden"}>
                    {(() => {
                      const shop = getCheapestShop(row.item.value.shops);

                      return shop
                        ? `$${shop.buy_price?.toLocaleString()} [${shop.country}]`
                        : "—";
                    })()}
                  </Table.Cell>

                  <Table.Cell className={includedRows.includes("market") ? "" : "hidden"}>
                    ${row.item.value.market_price.toLocaleString()}
                  </Table.Cell>
                  <Table.Cell className={includedRows.includes("total") ? "" : "hidden"}>
                    ${(
                      row.item.value.market_price *
                      row.inventory.amount
                    ).toLocaleString()}
                  </Table.Cell>
                </Table.Row>
              </>)}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}