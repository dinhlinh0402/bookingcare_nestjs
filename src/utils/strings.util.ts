import { UserEntity } from 'src/modules/user/user.entity';
import { snakeCase as toSnake } from 'typeorm/util/StringUtils';

export const snakeCase = toSnake;

export const getFullName = (user: UserEntity): string => {
  const { firstName, middleName, lastName } = user;

  let fullName = '';

  // if (firstName) fullName += firstName;
  // if (middleName) fullName += ` ${middleName}`;
  // if (lastName) fullName += ` ${lastName}`;

  if (lastName) fullName += lastName;
  if (middleName) fullName += ` ${middleName}`;
  if (firstName) fullName += ` ${firstName}`;

  return fullName.trim();
};
