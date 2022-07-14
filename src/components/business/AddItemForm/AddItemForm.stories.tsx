import React from 'react';
import {action} from '@storybook/addon-actions';
import {AddItemForm} from './AddItemForm';

export default {
  title: 'AddItemForm Stories',
  component: AddItemForm
};

const asyncCallback = async (title: string) => {
  action('Button inside form clicked');
};

export const AddItemFormBaseExample = () => {
  return <AddItemForm addItem={asyncCallback} />;
};

export const AddItemFormDisabledExample = () => {
  return <AddItemForm disabled={true} addItem={asyncCallback} />;
};
