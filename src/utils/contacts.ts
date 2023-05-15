import {InfiniteData, useQuery, useQueryClient} from '@tanstack/react-query';
import _ from 'lodash';
import {User} from './api';
import {useMemo} from 'react';

type PaginatedContacts = InfiniteData<User[]>;

export const flattenPaginated = (data?: PaginatedContacts) => {
  return data ? _.uniqBy(_.flatten(data?.pages), 'id') : [];
};

export type UseContactReturn =
  | {
      error: Error;
      contact: null;
    }
  | {
      error: null;
      contact: User;
    };

export const useContact = (queryKey: string, id: number): UseContactReturn => {
  const client = useQueryClient();
  const {data} = useQuery([queryKey], async () =>
    client.getQueryData<PaginatedContacts>([queryKey]),
  );

  const result = useMemo(() => {
    const users = flattenPaginated(data);
    const user = users?.find(p => p.id === id)!;
    if (!user) {
      return {
        contact: null,
        error: new Error(`Contact doesn't exist ${id}`),
      };
    }
    return {
      contact: user,
      error: null,
    };
  }, [data, id]);

  return result;
};
