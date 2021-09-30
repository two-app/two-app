import { TwoState } from "../../state/reducers";
import { Tag } from "../Tag";

import { TagState } from "./reducers";

export const selectTags = (tagState: TagState): Tag[] => tagState.allTags;

export const selectAllTags = (state: TwoState): Tag[] => {
  return state.tags.allTags;
};
