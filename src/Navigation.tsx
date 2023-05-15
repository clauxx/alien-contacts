import {
  DarkTheme,
  NavigationContainer,
  RouteProp,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Header } from '@/components/Header';
import { ContactProps } from '@/screens/contact';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

type RootStackParamList = {
  Contacts: undefined;
  Contact: ContactProps;
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;

const screens: Record<keyof RootStackParamList, any> = {
  Contacts: () => require('@/screens/contactFeed').ContactFeed,
  Contact: () => require('@/screens/contact').Contact,
};

type GetOptions = <T extends keyof RootStackParamList>(args: {
  route: RouteProp<RootStackParamList, T>;
}) => {};

const getOptionsWithHeader =
  (config?: { showBack?: boolean }) =>
  (...[args]: Parameters<GetOptions>): ReturnType<GetOptions> =>
    ({
      headerShown: true,
      headerTransparent: true,
      header: () => (
        <Header title={args.route.name} showBack={config?.showBack ?? false} />
      ),
    } as const);

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName="Contacts">
        <Stack.Screen
          name="Contacts"
          getComponent={screens.Contacts}
          options={getOptionsWithHeader()}
        />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="Contact"
            getComponent={screens.Contact}
            options={getOptionsWithHeader({ showBack: true })}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
