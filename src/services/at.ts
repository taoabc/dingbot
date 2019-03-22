import _ from 'lodash';
import { atTable } from '../config';

function mobilesFromAuthor(authorName: string, authorEmail: string) {
  let finded;
  if (authorEmail) {
    finded = _.find(atTable, { authorEmail });
  }
  if (!finded && authorName) {
    finded = _.find(atTable, { authorName });
  }
  if (finded) {
    return [ finded.phone ];
  }
  return [];
}

function mobilesFromUser(userName: string, userEmail: string | null) {
  let finded;
  if (userEmail) {
    finded = _.find(atTable, { userEmail });
  }
  if (!finded && userName) {
    finded = _.find(atTable, { userName });
  }
  if (finded) {
    return [ finded.phone ];
  }
  return [];
}

export default {
  mobilesFromAuthor,
  mobilesFromUser,
};
