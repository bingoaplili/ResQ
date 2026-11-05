import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { colors } from '../theme';
import MainTabs from './MainTabs';
import SplashScreen from '../screens/onboarding/SplashScreen';
import FeatureCarouselScreen from '../screens/onboarding/FeatureCarouselScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import CreateAccountScreen from '../screens/auth/CreateAccountScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import ProfileSetupScreen from '../screens/setup/ProfileSetupScreen';
import SetupContactsScreen from '../screens/setup/SetupContactsScreen';
import PermissionsScreen from '../screens/setup/PermissionsScreen';
import MotionTestScreen from '../screens/setup/MotionTestScreen';
import SOSCountdownScreen from '../screens/emergency/SOSCountdownScreen';
import ActiveSOSScreen from '../screens/emergency/ActiveSOSScreen';
import EmergencyResolvedScreen from '../screens/emergency/EmergencyResolvedScreen';
import ReportTypeScreen from '../screens/report/ReportTypeScreen';
import ReportLocationScreen from '../screens/report/ReportLocationScreen';
import ReportDetailsScreen from '../screens/report/ReportDetailsScreen';
import ReportReviewScreen from '../screens/report/ReportReviewScreen';
import ReportSubmittedScreen from '../screens/report/ReportSubmittedScreen';
import ZoneDetailScreen from '../screens/zones/ZoneDetailScreen';
import TrustedCircleScreen from '../screens/contacts/TrustedCircleScreen';
import ContactFormScreen from '../screens/contacts/ContactFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: colors.navy } }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="Carousel" component={FeatureCarouselScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="SetupContacts" component={SetupContactsScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="MotionTest" component={MotionTestScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="SOSCountdown" component={SOSCountdownScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="ActiveSOS" component={ActiveSOSScreen} options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="EmergencyResolved" component={EmergencyResolvedScreen} options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="ReportType" component={ReportTypeScreen} />
      <Stack.Screen name="ReportLocation" component={ReportLocationScreen} />
      <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />
      <Stack.Screen name="ReportReview" component={ReportReviewScreen} />
      <Stack.Screen name="ReportSubmitted" component={ReportSubmittedScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="ZoneDetail" component={ZoneDetailScreen} />
      <Stack.Screen name="TrustedCircle" component={TrustedCircleScreen} />
      <Stack.Screen name="ContactForm" component={ContactFormScreen} options={{ animation: 'slide_from_bottom' }} />
    </Stack.Navigator>
  );
}
