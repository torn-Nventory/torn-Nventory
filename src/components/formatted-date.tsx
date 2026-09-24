"use client";

type FormattedDateProps = {
  timestamp: string | number | Date;
};

export default function FormattedDate({ timestamp }: FormattedDateProps) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return <span>Invalid date</span>;
  }

  return (
    <span>
      {date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </span>
  );
}
