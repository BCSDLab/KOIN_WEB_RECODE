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
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioGroup({
  name, options, selectedValue, onChange,
}: RadioGroupProps) {
  return (
    <div className={styles['radio-group']}>
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
