import { Stack } from "expo-router";
import { TasksProvider } from "@/src/contexts/TasksContext";

export default function RootLayout() {
  return (
    <TasksProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </TasksProvider>
  );
}
