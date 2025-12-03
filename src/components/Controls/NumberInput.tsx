import { useState, useEffect } from "react";

interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
  > {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  className,
  ...rest
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState<string>(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue === "" || newValue === "-") {
      return; // Allow empty or just minus sign
    }

    const numValue = Number(newValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    const numValue = Number(inputValue);
    if (inputValue === "" || isNaN(numValue)) {
      // Reset to current value if empty or invalid
      setInputValue(String(value));
    } else {
      // Clamp to min/max if provided
      let finalValue = numValue;
      if (min !== undefined) {
        finalValue = Math.max(min, finalValue);
      }
      if (max !== undefined) {
        finalValue = Math.min(max, finalValue);
      }
      onChange(finalValue);
      setInputValue(String(finalValue));
    }
  };

  return (
    <input
      type="number"
      value={inputValue}
      min={min}
      max={max}
      step={step}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      {...rest}
    />
  );
}

