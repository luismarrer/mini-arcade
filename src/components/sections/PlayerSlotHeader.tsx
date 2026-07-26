interface PlayerSlotHeaderProps {
  label: string;
}

export default function PlayerSlotHeader({ label }: PlayerSlotHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-arcade-border pb-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-arcade-subtle">
      <span>{label}</span>
      <span className="flex gap-1.5" aria-hidden="true">
        <i className="size-1.5 rounded-full bg-arcade-red shadow-[0_0_8px_rgba(229,69,75,0.4)]" />
        <i className="size-1.5 rounded-full bg-arcade-yellow shadow-[0_0_8px_rgba(244,196,48,0.4)]" />
        <i className="size-1.5 rounded-full bg-arcade-green shadow-[0_0_8px_rgba(130,220,61,0.4)]" />
      </span>
    </div>
  );
}
