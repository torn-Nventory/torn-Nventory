import InventorySelection from "./inventory-selection";
import InventoryTable from "./inventory-table";

export default function InventoryPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1>Inventory</h1>
      </div>
      <InventorySelection />
      <InventoryTable />
    </section>
  );
}
