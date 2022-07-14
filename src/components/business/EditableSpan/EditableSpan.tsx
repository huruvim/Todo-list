import React, {useState} from 'react';
import {TextSpan} from 'components/ui/TextSpan/TextSpan';
import {TextInput} from 'components/ui/TextInput/TextInput';

interface EditableSpanProps {
  value: string;
  onChange: (newValue: string) => void;
}

export const EditableSpan: React.FC<EditableSpanProps> = React.memo(({value, onChange}) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(value);

  const activateEditMode = () => {
    setEditMode(true);
    setTitle(value);
  };

  const activateViewMode = () => {
    setEditMode(false);
    onChange(title);
  };

  return (
    <>
      {editMode && (
        <TextInput
          variant="standard"
          title={title}
          onChangeHandler={setTitle}
          autoFocus
          onBlur={activateViewMode}
        />
      )}
      {!editMode && <TextSpan value={value} onDoubleClick={activateEditMode} />}
    </>
  );
});
