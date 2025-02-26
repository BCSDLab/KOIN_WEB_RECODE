import Radio from 'pages/Articles/LostItemDetailPage/components/Radio';
import styles from './RadioGroup.module.scss';

interface RadioOption {
  value: string;
  label: string;
  subtitle: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValues?: string[];
  onChange: (selected: string[]) => void;
}

export default function RadioGroup({
  name, options, selectedValues = [], onChange,
}: RadioGroupProps) {
  const handleChange = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onChange(newSelectedValues);
  };

  return (
    <div className={styles['radio-group']}>
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          label={option.label}
          subtitle={option.subtitle}
          name={name}
          checked={selectedValues.includes(option.value)}
          onChange={() => handleChange(option.value)}
        />
      ))}
    </div>
  );
}
