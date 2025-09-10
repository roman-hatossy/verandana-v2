'use client';
import * as React from 'react';

type Props = {
  value?: Date | null;
  onChange?: (d: Date | null) => void;
  className?: string;
};

function toInputValue(d?: Date | null) {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromInputValue(v: string): Date | null {
  if (!v) return null;
  const dt = new Date(v);
  return isNaN(dt.getTime()) ? null : dt;
}

export default function Calendar({ value, onChange, className }: Props) {
  const [local, setLocal] = React.useState<Date | null>(value ?? null);
  React.useEffect(() => {
    if (typeof value !== 'undefined') setLocal(value ?? null);
  }, [value]);
  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = fromInputValue(e.target.value);
    if (typeof value === 'undefined') setLocal(picked);
    onChange?.(picked);
  };
  return (
    <input
      type="date"
      value={toInputValue(local)}
      onChange={onPick}
      className={className ?? 'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm'}
    />
  );
}
