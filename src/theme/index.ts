import { ViewStyle } from 'react-native';

export const colors = {
  navy: '#13273F',
  navyDeep: '#0B1A2C',
  navySoft: '#21405F',
  horizon: '#80AEE8',
  horizonDeep: '#3F78BF',
  horizonSoft: '#D3E3F8',
  horizonMist: '#E8F0FB',
  bordeaux: '#5B0015',
  bordeauxSoft: '#80213A',
  ivory: '#F7F2E0',
  ivoryLight: '#FCFAF0',
  ivoryDeep: '#ECE4C6',
  pink: '#F2AEBC',
  pinkSoft: '#F9D9E0',
  pinkDeep: '#D9778C',
  sos: '#D91A3B',
  sosDeep: '#A8102B',
  safe: '#2F8F6B',
  safeDeep: '#1E6B4F',
  safeSoft: '#CDE9DD',
  warn: '#C9811A',
  warnSoft: '#F6E3BD',
  ink: '#13273F',
  inkMuted: '#4B5C73',
  inkFaint: '#7B8798',
  link: '#2A5FA8',
  line: 'rgba(19,39,63,0.14)',
  lineLight: 'rgba(247,242,224,0.22)',
};

export const fonts = {
  display: 'Fraunces_700Bold',
  displaySemi: 'Fraunces_600SemiBold',
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semi: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius = { sm: 8, md: 12, lg: 18, xl: 26, pill: 999 };

export const shadow = (level: 1 | 2 | 3): ViewStyle => ({
  shadowColor: '#0B1A2C',
  shadowOpacity: [0, 0.1, 0.16, 0.24][level],
  shadowRadius: [0, 8, 16, 28][level],
  shadowOffset: { width: 0, height: [0, 3, 8, 14][level] },
  elevation: [0, 2, 5, 9][level],
});

export const config = {
  brand: 'ResQ',
  emergencyNumber: '999',
  // Device dialer stays off while the app is being reviewed so no real call can start.
  enableDeviceDialer: false,
};
