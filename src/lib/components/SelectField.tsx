// components/FormSelectField.tsx
import { FormControl, FormLabel, Select } from "@chakra-ui/react";

interface FormSelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: boolean;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}: FormSelectFieldProps) {
  return (
    <FormControl isInvalid={error}>
      <FormLabel textTransform="capitalize">{label}</FormLabel>
      <Select
        placeholder={placeholder || `Selecione ${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
