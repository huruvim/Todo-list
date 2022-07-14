import {ResponseType} from 'utils/api/types';
import {regex} from './regex';

export const isGoodResp = (data: ResponseType) => data.resultCode === 0;

export const isEmpty = (value: string | unknown[]) => value.length === 0;

export const isEmail = (email: string) => regex.email.test(email);
