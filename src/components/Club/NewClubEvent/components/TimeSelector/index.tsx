import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import DownArrowIcon from 'assets/svg/down-arrow-icon.svg';
import styles from './TimeSelector.module.scss';

interface PickerProps {
  hour: number;
  minute: number;
  onChange: (time: { hour: number; minute: number }) => void;
}

interface DropdownProps {
  options: number[];
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}

function Dropdown({ options, value, suffix, onChange }: DropdownProps) {
  const [isOpen, , close, toggle] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: close });

  return (
    <div className={styles.dropdownWrapper} ref={containerRef}>
      <button type="button" className={styles.trigger} onClick={toggle}>
        {value?.toString().padStart(2, '0') ?? '00'} {suffix}
        <DownArrowIcon />
      </button>
      {isOpen && (
        <ul className={styles.menu}>
          {options.map((opt) => (
            <li
              role="option"
              aria-selected={opt === value}
              key={opt}
              className={styles.option}
              onClick={() => {
                onChange(opt);
                close();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onChange(opt);
                  close();
                }
              }}
              tabIndex={0}
            >
              {opt.toString().padStart(2, '0')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TimeSelector({ hour, minute, onChange }: PickerProps) {
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className={styles.pickerContainer}>
      <Dropdown
        options={hourOptions}
        value={hour}
        suffix="시"
        onChange={(val) => onChange({ hour: val, minute: minute ?? 0 })}
      />
      <Dropdown
        options={minuteOptions}
        value={minute}
        suffix="분"
        onChange={(val) => onChange({ hour: hour ?? 0, minute: val })}
      />
    </div>
  );
}
