import Radio from 'pages/Articles/LostItemDetailPage/components/Radio';

interface RadioOption {
  value: string;
  label: string;
  subtitle: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[]; // ✅ 배열 타입
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioGroup({
  name, options, selectedValue, onChange,
}: RadioGroupProps) {
  return (
    <div>
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          label={option.label}
          subtitle={option.subtitle}
          name={name}
          checked={selectedValue === option.value}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
