import React from 'react';

interface RadioBoxProps {
  value: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioBox({
  value, name, checked, onChange,
}: RadioBoxProps) {
  return (
    <div className="radio-box">
      <input
        type="radio"
        id={value}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}
