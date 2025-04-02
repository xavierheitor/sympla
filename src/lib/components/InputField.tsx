// components/InputField.tsx
'use client'

import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react'
import { ChangeEvent } from 'react'

interface InputFieldProps {
    label: string
    placeholder?: string
    value: string
    error?: string[]
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    type?: string
    name?: string
}

export default function InputField({
    label,
    placeholder,
    value,
    error,
    onChange,
    type = 'text',
    name,
}: InputFieldProps) {
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel>{label}</FormLabel>
            <Input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} />
            {error &&
                error.map((msg, i) => (
                    <Text key={i} fontSize="sm" color="red.500">
                        {msg}
                    </Text>
                ))}
        </FormControl>
    )
}