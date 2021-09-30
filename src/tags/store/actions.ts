import { createAction } from "typesafe-actions";

import { Tag } from "../Tag";

export const storeTags = createAction("STORE_TAGS")<Tag[]>();

export default {
  storeTags,
};
