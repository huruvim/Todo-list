import React, {KeyboardEvent} from 'react';
import {TextField} from '@material-ui/core';

interface TextInputProps {
  disabled?: boolean;
  error?: string | null;
  title: string;
  variant?: 'outlined' | 'standard' | 'filled';
  autoFocus?: boolean;
  label?: string;
  customCss?: React.CSSProperties;
  onBlur?: () => void;
  onChangeHandler: (title: string) => void;
  onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const TextInput: React.FC<TextInputProps> = React.memo(
  ({
    error,
    disabled,
    onKeyPress = () => null,
    onBlur = () => null,
    variant = 'outlined',
    autoFocus = false,
    customCss = {},
    title,
    onChangeHandler,
    label
  }) => {
    return (
      <TextField
        variant={variant}
        disabled={disabled}
        error={!!error}
        value={title}
        label={label}
        helperText={error}
        autoFocus={autoFocus}
        style={customCss}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        onChange={(e) => onChangeHandler(e.currentTarget.value)}
      />
    );
  }
);
