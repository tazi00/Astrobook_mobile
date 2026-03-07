import { useAuthStore } from '@/src/store/authStore';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return <Redirect href="/(app)/feed" />;
  }

  return <Redirect href="/(auth)/login" />;
}
