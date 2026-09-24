import ApiCard from "./api-card";
import LocalStorageCard from "./localstorage-card";
export default function SettingsPage() {
  return (

    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className="w-full max-w-lg text-2xl font-semibold items-start">Settings</h1>
      <ApiCard />
      <LocalStorageCard />

    </section>

  );
}
