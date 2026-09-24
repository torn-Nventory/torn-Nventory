import { Card, CardHeader } from "@heroui/react";
import { useEffect, useState } from "react";

function parseValue(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export default function LocalStorageCard() {
  const [data, setData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const storage: Record<string, unknown> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key !== null) {
        storage[key] = parseValue(localStorage.getItem(key) ?? "");
      }
    }

    setData(storage);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Local Storage</h2>
          <p className="text-small text-default-500">
            {Object.keys(data).length} entries
          </p>
        </div>
      </CardHeader>

      <Card.Content>
        <pre className="overflow-auto rounded-medium bg-default-100 p-4 text-small">
          <JsonTree value={data} />
        </pre>
      </Card.Content>
    </Card>
  );
}

function JsonTree({
  value,
  depth = 0,
}: {
  value: unknown;
  depth?: number;
}) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return <span>{JSON.stringify(value)}</span>;
  }

  const entries = Object.entries(value);

  return (
    <>
      {"{"}
      {entries.length > 0 && "\n"}

      {entries.map(([key, child], index) => {
        const isObject =
          child !== null && typeof child === "object";

        return (
          <div key={key} style={{ paddingLeft: `${(depth + 1) * 20}px` }}>
            <span className="text-primary">
              {JSON.stringify(key)}
            </span>
            {": "}

            {isObject ? (
              <details open={depth === 0} className="inline">
                <summary className="inline cursor-pointer list-none">
                  {Array.isArray(child) ? "[" : "{"}
                  <span className="ml-1 text-default-500">
                    {Array.isArray(child)
                      ? `${child.length} items`
                      : `${Object.keys(child).length} keys`}
                  </span>
                  {Array.isArray(child) ? "]" : "}"}
                </summary>

                <div>
                  <JsonTree value={child} depth={depth + 1} />
                </div>
              </details>
            ) : (
              <span>{JSON.stringify(child)}</span>
            )}

            {index < entries.length - 1 && ","}
          </div>
        );
      })}

      {entries.length > 0 && "\n"}
      {"}"}
    </>
  );
}