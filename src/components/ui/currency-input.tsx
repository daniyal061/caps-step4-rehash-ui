import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { cn } from '../../lib/utils';

interface CurrencyInputProps {
    value: number;
    onChange: (value: number) => void;
    className?: string;
    placeholder?: string;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ value, onChange, className, placeholder, onBlur, onFocus, ...props }, ref) => {
        const [displayValue, setDisplayValue] = useState('');
        const [isFocused, setIsFocused] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);

        // Format number as currency
        const formatCurrency = (num: number): string => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(num);
        };

        // Parse currency string to number
        const parseCurrency = (str: string): number => {
            const cleaned = str.replace(/[^0-9.-]/g, '');
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? 0 : parsed;
        };

        // Update display value when value prop changes
        useEffect(() => {
            if (!isFocused) {
                setDisplayValue(formatCurrency(value));
            }
        }, [value, isFocused]);

        // Initialize display value
        useEffect(() => {
            setDisplayValue(formatCurrency(value));
        }, []);

        const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            // Show raw number without currency formatting when focused
            setDisplayValue(value.toString());
            onFocus?.(event);
        };

        const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            // Parse the current input value and update
            const numericValue = parseCurrency(displayValue);
            onChange(numericValue);
            // Format back to currency display
            setDisplayValue(formatCurrency(numericValue));
            onBlur?.(event);
        };

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value;
            setDisplayValue(inputValue);

            if (isFocused) {
                // Only update the numeric value while typing
                const numericValue = parseCurrency(inputValue);
                onChange(numericValue);
            }
        };

        return (
            <Input
                ref={ref || inputRef}
                type="text"
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={cn(className)}
                placeholder={placeholder}
                {...props}
            />
        );
    }
);

CurrencyInput.displayName = 'CurrencyInput';