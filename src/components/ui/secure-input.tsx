import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { sanitizeInput } from "@/utils/securityUtils";

export interface SecureInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSecureChange?: (value: string, originalEvent: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  allowedCharacters?: RegExp;
}

const SecureInput = React.forwardRef<HTMLInputElement, SecureInputProps>(
  ({ className, onSecureChange, maxLength = 1000, allowedCharacters, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Apply character filtering if specified
      if (allowedCharacters) {
        value = value.split('').filter(char => allowedCharacters.test(char)).join('');
      }

      // Apply length limit
      if (value.length > maxLength) {
        value = value.slice(0, maxLength);
      }

      // Sanitize input
      const sanitizedValue = sanitizeInput(value);

      // Update the input value
      e.target.value = sanitizedValue;

      // Call the secure change handler
      if (onSecureChange) {
        onSecureChange(sanitizedValue, e);
      }
    };

    return (
      <Input
        className={cn(
          // Additional security styling
          "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          className
        )}
        ref={ref}
        onChange={handleChange}
        autoComplete="off"
        spellCheck="false"
        {...props}
      />
    );
  }
);

SecureInput.displayName = "SecureInput";

export { SecureInput };