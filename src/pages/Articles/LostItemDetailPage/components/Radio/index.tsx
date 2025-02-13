interface RadioProps {
  value: string;
  label: string;
  subtitle:string;
  name:string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Radio({
  value, label, subtitle, name, checked, onChange,
}: RadioProps) {
  return (
    <label>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      {label}
      {subtitle}
    </label>
  );
}
