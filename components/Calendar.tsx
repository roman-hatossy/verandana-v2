'use client';
import * as React from 'react';

type LegacyProps = {
  isOpen?: boolean;
  selectedDate?: Date | null;
  onDateSelect?: (date: Date | null) => void;
  onClose?: () => void;
  currentMonth?: number;
  currentYear?: number;
  onMonthChange?: (_direction: 'prev' | 'next') => void;
};

type NewProps = {
  value?: Date | null;
  onChange?: (d: Date | null) => void;
  min?: string;
  max?: string;
  name?: string;
  required?: boolean;
  className?: string;
};
type Props = LegacyProps & NewProps;

function toInputValue(d?: Date | null) {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromInputValue(v: string): Date | null {
  if (!v) return null;
  const [y, m, d] = v.split('-').map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  return isNaN(dt.getTime()) ? null : dt;
}

export default function Calendar(props: Props) {
  const { selectedDate, onDateSelect, value, onChange, min, max, name, required, className } = props;
  const controlled = typeof value !== 'undefined' || typeof selectedDate !== 'undefined';
  const [local, setLocal] = React.useState<Date | null>(value ?? selectedDate ?? null);
  
  React.useEffect(() => {
    if (typeof value !== 'undefined') setLocal(value ?? null);
    else if (typeof selectedDate !== 'undefined') setLocal(selectedDate ?? null);
  }, [value, selectedDate]);
  
  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = fromInputValue(e.target.value);
    if (!controlled) setLocal(picked);
    onChange?.(picked);
    onDateSelect?.(picked);
  };
  
  return (
    <input
      type="date"
      value={toInputValue(local)}
      onChange={onPick}
      min={min}
      max={max}
      name={name}
      required={required}
      className={className ?? 'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm'}
    />
  );
}
