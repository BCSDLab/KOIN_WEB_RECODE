import Checkbox from 'pages/Articles/LostItemDetailPage/components/Checkbox';
import styles from './CheckboxGroup.module.scss';

interface CheckboxOption {
  value: string;
  label: string;
  subtitle: string;
}

interface CheckboxGroupProps {
  name: string;
  options: CheckboxOption[];
  selectedValues?: string[];
  onChange: (selected: string[]) => void;
}

export default function CheckboxGroup({
  name, options, selectedValues = [], onChange,
}: CheckboxGroupProps) {
  const handleChange = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onChange(newSelectedValues);
  };

  return (
    <div className={styles['checkbox-group']}>
      {options.map((option) => (
        <Checkbox
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
