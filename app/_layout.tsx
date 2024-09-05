import { Stack } from "expo-router";
import { useFonts } from "expo-font";

export default function RootLayout() {
  const [loaded] = useFonts({
    "KellySlab": require("@/assets/fonts/KellySlab-Regular.ttf"),
  });
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="student" options={{ headerShown: false }} />
      <Stack.Screen name="club" options={{ headerShown: false }} />
      
    </Stack>
  );
}
