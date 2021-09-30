import Gateway from '../http/Gateway';

import type {Profile} from './Profile';

export type Couple = {
  user: Profile;
  partner?: Profile;
  cid?: string;
};

const getCouple = (): Promise<Couple> => {
  console.log('Performing GET /couple');
  return Gateway.get<Couple>('couple').then(r => r.data);
};

export default {getCouple};
