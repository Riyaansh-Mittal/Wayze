import React, { useContext } from "react";
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { AuthContext, AuthProvider } from "./src/services/AuthContext";
// import { UpdateModalProvider } from "./src/services/UpdateModalContext";
// import UpdateRequiredModal from "./src/components/UpdateRequiredModal";
// import MaintenanceModal from "./src/components/MaintenanceModal";
// import mobileAds from 'react-native-google-mobile-ads';

// // Initialize the Mobile Ads SDK
// mobileAds()
//   .initialize()
//   .then(adapterStatuses => {
//     console.log('Ads initialization complete');
//   });

// // import SplashScreen from "./src/screens/SplashScreen";
// // import OnboardingScreen from "./src/screens/OnboardingScreen";
// // import Login from "./src/screens/Login";
// // import SignUp from "./src/screens/SignUp";
// // import Home from "./src/screens/Home";
// // import MyVehicles from "./src/screens/MyVehicles";
// // import FindVehicle from "./src/screens/FindVehicle";
// // import Profile from "./src/screens/Profile";
// // import ScanQRCode from "./src/screens/ScanQRCode";
// // import Settings from "./src/screens/Settings";
// // import Notifications from "./src/screens/Notifications";
// // import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// // import GenerateQRCode from "./src/screens/GenerateQRCode";
// // import QRDisplay from "./src/screens/QRDisplay";
// // import Feedback from "./src/screens/Feedback";
// // import EditProfile from "./src/screens/EditProfile";
// // import SupportAbout from "./src/screens/SupportAbout";
// // import { Appbar } from "react-native-paper";
// // import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
// // import ParkingTimer from "./src/screens/ParkingTimer";
// // import EnterCarNumber from "./src/screens/EnterCarNumber";
// // import CallPage from "./src/screens/CallPage";
// // import SendAlert from "./src/screens/SendAlert";
// // import AddVehicle from "./src/screens/AddVehicle";
// // import History from "./src/screens/History";

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// // 🔹 Custom Top Bar
// const TopBar = ({ navigation }) => {
//   const { theme, toggleTheme } = useContext(AuthContext);

//   const rotate = useSharedValue(0);
//   const scale = useSharedValue(1);

//   const handleThemeToggle = () => {
//     rotate.value = withTiming(theme.isLight ? 270 : 0, { duration: 500 });
//     scale.value = withTiming(1.2, { duration: 300 }, () => {
//       scale.value = withTiming(1, { duration: 200 });
//     });
//     toggleTheme();
//   };

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ rotate: `${rotate.value}deg` }, { scale: scale.value }],
//   }));

//   return (
//     <Appbar.Header style={{ backgroundColor: theme.primaryColor }}>
//       <Appbar.Content title="QR Parking App" titleStyle={{ color: theme.textColor }} />
//       <TouchableOpacity onPress={handleThemeToggle} style={{ marginRight: 15 }}>
//         <Animated.View style={animatedStyle}>
//           <Icon
//             name={theme.isLight ? "white-balance-sunny" : "weather-night"}
//             size={30}
//             color={theme.textColor}
//           />
//         </Animated.View>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
//         <Icon name="account-circle" size={30} color={theme.textColor} style={{ marginRight: 15 }} />
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
//         <Icon name="bell" size={30} color={theme.textColor} style={{ marginRight: 15 }} />
//       </TouchableOpacity>
//     </Appbar.Header>
//   );
// };

// // 🔹 Screen Wrapper
// const ScreenWrapper = ({ children }) => {
//   const { theme } = useContext(AuthContext);
//   return (
//     <View style={{ flex: 1, backgroundColor: theme.backgroundColor, paddingBottom: 60 }}>
//       <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
//         {children}
//       </ScrollView>
//     </View>
//   );
// };

// // 🔹 Main Bottom Tabs
// const MainTabs = () => {
//   const { theme } = useContext(AuthContext);

//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: true,
//         tabBarStyle: {
//           backgroundColor: theme.backgroundColor,
//           borderTopColor: theme.primaryColor,
//           height: 65,
//         },
//         tabBarActiveTintColor: theme.textColor,
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         options={{
//           tabBarLabel: "Home",
//           tabBarIcon: ({ color }) => <Icon name="home" color={color} size={28} />,
//         }}
//       >
//         {(props) => (
//           <ScreenWrapper>
//             <Home {...props} />
//           </ScreenWrapper>
//         )}
//       </Tab.Screen>

//       <Tab.Screen
//         name="MyVehicles"
//         options={{
//           tabBarLabel: "My Vehicles",
//           tabBarIcon: ({ color }) => <Icon name="car-multiple" color={color} size={28} />,
//         }}
//       >
//         {(props) => (
//           <ScreenWrapper>
//             <MyVehicles {...props} />
//           </ScreenWrapper>
//         )}
//       </Tab.Screen>

//       <Tab.Screen
//         name="ScanQRCode"
//         component={ScanQRCode}
//         options={({ navigation }) => ({
//           tabBarButton: () => (
//             <TouchableOpacity
//               style={{
//                 backgroundColor: theme.primaryColor,
//                 width: 68,
//                 height: 68,
//                 bottom: 16,
//                 borderRadius: 50,
//                 justifyContent: "center",
//                 alignItems: "center",
//                 marginBottom: 25,
//                 position: 'absolute',
//                 left: '50%',
//                 marginLeft: -34,
//                 zIndex: 9,
//               }}
//               onPress={() => navigation.navigate('ScanQRCode')}
//             >
//               <Icon name="qrcode-scan" color="white" size={36} />
//             </TouchableOpacity>
//           ),
//           tabBarStyle: { display: 'none' },
//           headerShown: false,
//         })}
//       />

//       <Tab.Screen
//         name="FindVehicle"
//         options={{
//           tabBarLabel: "Find Vehicle",
//           tabBarIcon: ({ color }) => <Icon name="car-search" color={color} size={28} />,
//         }}
//       >
//         {(props) => (
//           <ScreenWrapper>
//             <FindVehicle {...props} />
//           </ScreenWrapper>
//         )}
//       </Tab.Screen>

//       <Tab.Screen
//         name="Profile"
//         options={{
//           tabBarLabel: "Profile",
//           tabBarIcon: ({ color }) => <Icon name="account" color={color} size={28} />,
//         }}
//       >
//         {(props) => (
//           <ScreenWrapper>
//             <Profile {...props} />
//           </ScreenWrapper>
//         )}
//       </Tab.Screen>
//     </Tab.Navigator>
//   );
// };

// // 🔹 Main Stack
// const MainStack = () => (
//   <Stack.Navigator screenOptions={{ header: (props) => <TopBar {...props} /> }}>
//     <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: true }} />
//     <Stack.Screen name="Profile" component={Profile} />
//     <Stack.Screen name="Notifications" component={Notifications} />
//     <Stack.Screen name="GenerateQRCode" component={GenerateQRCode} />
//     <Stack.Screen name="QRDisplay" component={QRDisplay} />
//     <Stack.Screen name="Feedback" component={Feedback} />
//     <Stack.Screen name="EditProfile" component={EditProfile} />
//     <Stack.Screen name="SupportAbout" component={SupportAbout} />
//     <Stack.Screen name="EnterCarNumber" component={EnterCarNumber} />
//     <Stack.Screen name="CallPage" component={CallPage} />
//     <Stack.Screen name="SendAlert" component={SendAlert} />
//     <Stack.Screen name="AddVehicle" component={AddVehicle} />
//     <Stack.Screen name="History" component={History} />
//   </Stack.Navigator>
// );

// // 🔹 Authentication Stack
// const AuthStack = () => (
//   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="Splash" component={SplashScreen} />
//     <Stack.Screen name="Onboarding" component={OnboardingScreen} />
//     <Stack.Screen name="Login" component={Login} />
//     <Stack.Screen name="SignUp" component={SignUp} />
//   </Stack.Navigator>
// );

// // 🔹 App Content (inside UpdateModalProvider context)
// const AppContent = () => {
//   const { isAuthenticated } = useContext(AuthContext);

//   if (isAuthenticated === null) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4e54c8' }}>
//         <ActivityIndicator size="large" color="#fff" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       {isAuthenticated ? <MainStack /> : <AuthStack />}
      
//       {/* Global Modals - rendered at top level */}
//       <UpdateRequiredModal />
//       <MaintenanceModal />
//     </NavigationContainer>
//   );
// };

// 🔹 App Component - Wrapped with providers
const App = () => (
  <AuthProvider>
    <UpdateModalProvider>
      <AppContent />
    </UpdateModalProvider>
  </AuthProvider>
);

export default App;
