import React from 'react';
import {Checkbox} from '@material-ui/core';

interface CheckBoxProps {
  isChecked: boolean;
  color?: 'primary' | 'secondary' | 'default';
  onChangeHandler: (isChecked: boolean) => void;
}

export const CheckBox: React.FC<CheckBoxProps> = React.memo(
  ({isChecked, onChangeHandler, color = 'primary'}) => {
    return (
      <Checkbox
        checked={isChecked}
        onChange={(e) => onChangeHandler(e.currentTarget.checked)}
        color={color}
      />
    );
  }
);
