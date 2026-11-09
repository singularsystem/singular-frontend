"use client";
import React from "react";
import { IMaskInput } from "react-imask";

const inputClasses =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

type MaskedInputProps = {
  mask: string;
  value: string;
  onAccept: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  // onChange: (value: string) => void;
};

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, value, onAccept, placeholder, id, name }, ref) => (
    <IMaskInput
      mask={mask}
      value={value}
      onAccept={onAccept}
      placeholder={placeholder}
      id={id}
      name={name}
      inputRef={ref}
      className={inputClasses}
    />
  )
);

MaskedInput.displayName = "MaskedInput";
