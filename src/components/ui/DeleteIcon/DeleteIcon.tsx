import React from 'react';
import {Delete} from '@material-ui/icons';
import {IconButton} from '@material-ui/core';

interface DeleteIconProps {
  onClick: () => void;
}

export const DeleteIcon: React.FC<DeleteIconProps> = React.memo(({onClick}) => {
  return (
    <IconButton onClick={onClick}>
      <Delete fontSize="small" />
    </IconButton>
  );
});
