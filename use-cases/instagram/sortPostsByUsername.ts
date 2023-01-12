import { BaseError } from '../../errors';
import { SortPostsByUsernameDTO } from './dto';
import axios from 'axios';
import { getDataByUsername } from './getDataByUsername';

export async function sortPostsByUsername({
  requestId,
  userId,
  username,
  sortBy,
  only,
  fromDate,
  untilDate,
}: SortPostsByUsernameDTO) {
  const igUser = await getDataByUsername({ requestId, username });

  return {};
}
