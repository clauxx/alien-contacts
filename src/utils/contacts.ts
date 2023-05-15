import { InfiniteData, useQuery, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { User } from './api';
import { useMemo } from 'react';

type PaginatedContacts = InfiniteData<User[]>;

export const flattenPaginated = (data?: PaginatedContacts) => {
  return data ? _.uniqBy(_.flatten(data?.pages), 'id') : [];
};

export const useContact = (queryKey: string, id: number) => {
  const client = useQueryClient();
  const { data } = useQuery([queryKey], async () =>
    client.getQueryData<PaginatedContacts>([queryKey])
  );

  //TODO throw error with error boundary
  const contact = useMemo(() => {
    const users = flattenPaginated(data);
    return users?.find((p) => p.id === id)!;
  }, [data, id]);

  return contact;
};
