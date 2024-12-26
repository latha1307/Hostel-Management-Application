import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      {/* Ensure the default route points to "index" */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* Add the "home" screen with header hidden */}
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="leave" options={{ headerShown: false }} />
    </Stack>
  );
}
