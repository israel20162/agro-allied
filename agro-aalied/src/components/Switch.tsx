type SwitchProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function Switch({ checked, onChange }: SwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 w-max mt-4">
      <label className="relative cursor-pointer">
        <input
          type="checkbox"
          role="switch"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <div
          className="w-9 h-5 bg-slate-300 rounded-full
            peer-checked:bg-blue-600
            peer-focus-visible:ring-2
            peer-focus-visible:ring-blue-500
            transition-colors dark:bg-neutral-700"
        ></div>
        <div
          className="absolute left-0.5 top-0.5 w-[15.5px] h-[15.5px] bg-white rounded-full
            transition-transform peer-checked:translate-x-4"
        ></div>
      </label>
    </div>
  );
}
