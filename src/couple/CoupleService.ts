import Gateway from '../http/Gateway';

import type {Profile} from './Profile';

export type Couple = {
  user: Profile;
  partner?: Profile;
  cid?: string;
};

/* GET /couple */
export const fetchCouple = (): Promise<Couple> =>
  Gateway.get<Couple>('couple').then(r => r.data);
