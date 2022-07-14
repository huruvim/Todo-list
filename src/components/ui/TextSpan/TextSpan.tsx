import React from 'react';

interface TextSpanProps {
  value: string;
  onDoubleClick: () => void;
}

export const TextSpan: React.FC<TextSpanProps> = React.memo(({value, onDoubleClick}) => {
  return (
    <span onDoubleClick={onDoubleClick} style={{wordWrap: 'break-word'}}>
      {value}
    </span>
  );
});
