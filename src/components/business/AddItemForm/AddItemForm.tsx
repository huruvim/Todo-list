import React, {KeyboardEvent, useState} from 'react';
import {IconButton} from '@material-ui/core';
import {AddBox} from '@material-ui/icons';
import {AddItemHelpers} from 'features/TodolistsList/TodolistsList';
import {TextInput} from 'components/ui/TextInput';

type AddItemFormPropsType = {
  addItem: (title: string, helpers: AddItemHelpers) => void;
  disabled?: boolean;
};

export const AddItemForm: React.FC<AddItemFormPropsType> = React.memo(
  ({addItem, disabled = false}) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);

    const addItemHandler = () => {
      if (title.trim() !== '') {
        addItem(title, {setError, setTitle});
      } else {
        setError('Title is required');
      }
    };

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (error !== null) {
        setError(null);
      }
      if (e.charCode === 13) {
        addItemHandler();
      }
    };

    return (
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <TextInput
          title={title}
          error={error}
          onKeyPress={onKeyPressHandler}
          onChangeHandler={setTitle}
          disabled={disabled}
          label={'Title'}
          customCss={{width: '300px'}}
        />
        <IconButton color="primary" onClick={addItemHandler} disabled={disabled}>
          <AddBox />
        </IconButton>
      </div>
    );
  }
);
