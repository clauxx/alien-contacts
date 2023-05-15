import {ContactCard} from '@/components/ContactCard';
import {fireEvent, render} from '@testing-library/react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import * as hooks from '@/utils/contacts';
import {NavigationContainer} from '@react-navigation/native';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValueOnce(mockCanvasState),
}));
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({children}: {children: React.ReactNode}) => (
  <NavigationContainer>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </NavigationContainer>
);

const withSilentErrorLogs = (cb: () => void) => {
  //NOTE: silencing the error logs for this test
  jest.spyOn(console, 'error');
  //@ts-ignore
  console.error.mockImplementation(() => {});

  cb();

  //@ts-ignore
  console.error?.mockRestore();
};

describe('ContactCard', () => {
  it('should fail', async () => {
    withSilentErrorLogs(() => {
      const errorMessage = "Contact doesn't exist";
      jest.spyOn(hooks, 'useContact').mockImplementation(() => ({
        contact: null,
        error: new Error(errorMessage),
      }));
      expect(() => {
        const {getByText} = render(
          <ContactCard {...defaultProps} visible={false} />,
          {wrapper},
        );

        expect(getByText(errorMessage)).toBeDefined();
      }).toThrow();
    });
  });

  it('should show the fallback if not visible', () => {
    jest
      .spyOn(hooks, 'useContact')
      .mockImplementation(() => ({contact: testContact, error: null}));

    const {queryByTestId} = render(
      <ContactCard {...defaultProps} visible={false} />,
      {wrapper},
    );
    expect(queryByTestId('contact-card-fallback')).toBeDefined();
    expect(queryByTestId('contact-card-btn')).toBeNull();
  });

  it('should show the content if visible', () => {
    jest
      .spyOn(hooks, 'useContact')
      .mockImplementation(() => ({contact: testContact, error: null}));

    const {queryByTestId} = render(
      <ContactCard {...defaultProps} visible={true} />,
      {wrapper},
    );
    expect(queryByTestId('contact-card-fallback')).toBeNull();
    expect(queryByTestId('contact-card-btn')).toBeDefined();
  });
  it('should navigate to Contact on long press', () => {
    jest
      .spyOn(hooks, 'useContact')
      .mockImplementation(() => ({contact: testContact, error: null}));

    const {getByTestId} = render(
      <ContactCard {...defaultProps} visible={true} />,
      {wrapper},
    );
    const btn = getByTestId('contact-card-btn');
    expect(getByTestId('contact-card-btn')).toBeDefined();

    fireEvent(btn, 'longPress');
    const navParams = {
      id: defaultProps.id,
      queryKey: defaultProps.queryKey,
    };
    expect(mockNavigate).toBeCalledWith('Contact', navParams);
  });
});

const testContact = {
  id: 7043,
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
} as const;

const mockCanvasState = {
  colors: ['red', 'blue', 'yello'],
  size: 20,
} as const;

const defaultProps = {
  id: testContact.id,
  queryKey: 'testKey',
};
