import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { TabBar } from '../components/TabBar';
import HomeScreen from '../screens/tabs/HomeScreen';
import TravelScreen from '../screens/tabs/TravelScreen';
import ZonesScreen from '../screens/tabs/ZonesScreen';
import RespondScreen from '../screens/tabs/RespondScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }} tabBar={(p) => <TabBar {...p} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Travel" component={TravelScreen} />
      <Tab.Screen name="Zones" component={ZonesScreen} />
      <Tab.Screen name="Respond" component={RespondScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
