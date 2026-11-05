import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainTabParamList = {
  Home: undefined;
  Travel: undefined;
  Zones: undefined;
  Respond: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Carousel: undefined;
  Welcome: undefined;
  Login: undefined;
  CreateAccount: undefined;
  Otp: undefined;
  ProfileSetup: undefined;
  SetupContacts: undefined;
  Permissions: undefined;
  MotionTest: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  SOSCountdown: undefined;
  ActiveSOS: undefined;
  EmergencyResolved: undefined;
  ReportType: undefined;
  ReportLocation: undefined;
  ReportDetails: undefined;
  ReportReview: undefined;
  ReportSubmitted: { ref: string } | undefined;
  ZoneDetail: { id: string };
  TrustedCircle: undefined;
  ContactForm: { id?: string } | undefined;
};

export type RootNav = NativeStackNavigationProp<RootStackParamList>;
export type RootProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
