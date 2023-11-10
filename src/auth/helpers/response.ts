import { Users } from '@prisma/client';

export const ExcludePasswordAndToken = (user: Users) => {
  const { id, firstName, lastName, email } = user;
  return { id, firstName, lastName, email };
};
