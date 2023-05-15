import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {waitFor} from '@testing-library/react-native';
import {renderHook} from '@testing-library/react-hooks';
import {ErrorBoundary} from 'react-error-boundary';
import {View} from 'react-native';
import {useContact} from '../contacts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
queryClient.setDefaultOptions({queries: {cacheTime: 0}});

const wrapper = ({children}: {children: React.ReactNode}) => (
  <ErrorBoundary fallback={<View />}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </ErrorBoundary>
);

jest.useFakeTimers();

const queryKey = 'test-client-key' as const;

describe('useContact', () => {
  beforeEach(() => {
    queryClient.setQueryData([queryKey], {pages: testContacts});
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('should return the first contact', async () => {
    const id = 0;
    const {result} = renderHook(() => useContact(queryKey, id), {
      wrapper,
    });
    await waitFor(() =>
      expect(result.current.contact).toEqual(testContacts[id]),
    );
  });

  it('should return the second contact', async () => {
    const id = 1;
    const {result} = renderHook(() => useContact(queryKey, id), {
      wrapper,
    });
    await waitFor(() =>
      expect(result.current.contact).toEqual(testContacts[id]),
    );
  });

  it('should fail if accessing a non-existent contact', async () => {
    const id = 99;
    const {result} = renderHook(() => useContact(queryKey, id), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.error?.message).toContain(id.toString());
    });
  });
});

const testContacts = [
  {
    id: 0,
    uid: '61561329-b0d0-4114-a4e7-efd861386345',
    password: 'sJ7OoVUbCR',
    first_name: 'Abdul',
    last_name: 'Schneider',
    username: 'abdul.schneider',
    email: 'abdul.schneider@email.com',
    avatar:
      'https://robohash.org/consequunturoptioveritatis.png?size=300x300\u0026set=set1',
    gender: 'Polygender',
    phone_number: '+974 1-682-792-7291 x86330',
    social_insurance_number: '660136961',
    date_of_birth: '1965-01-01',
    employment: {title: 'Investor Liaison', key_skill: 'Fast learner'},
    address: {
      city: 'Maggieport',
      street_name: 'Eldon Branch',
      street_address: '4720 Carroll Plains',
      zip_code: '23134-7610',
      state: 'Oregon',
      country: 'United States',
      coordinates: {lat: 12.966658910950656, lng: 147.037629368027},
    },
    credit_card: {cc_number: '6771-8967-3266-6214'},
    subscription: {
      plan: 'Platinum',
      status: 'Pending',
      payment_method: 'Money transfer',
      term: 'Payment in advance',
    },
  },
  {
    id: 1,
    uid: '61561329-b0d0-4114-a4e7-efd861386345',
    password: 'sJ7OoVUbCR',
    first_name: 'Abdul',
    last_name: 'Schneider',
    username: 'abdul.schneider',
    email: 'abdul.schneider@email.com',
    avatar:
      'https://robohash.org/consequunturoptioveritatis.png?size=300x300\u0026set=set1',
    gender: 'Polygender',
    phone_number: '+974 1-682-792-7291 x86330',
    social_insurance_number: '660136961',
    date_of_birth: '1965-01-01',
    employment: {title: 'Investor Liaison', key_skill: 'Fast learner'},
    address: {
      city: 'Maggieport',
      street_name: 'Eldon Branch',
      street_address: '4720 Carroll Plains',
      zip_code: '23134-7610',
      state: 'Oregon',
      country: 'United States',
      coordinates: {lat: 12.966658910950656, lng: 147.037629368027},
    },
    credit_card: {cc_number: '6771-8967-3266-6214'},
    subscription: {
      plan: 'Platinum',
      status: 'Pending',
      payment_method: 'Money transfer',
      term: 'Payment in advance',
    },
  },
];
