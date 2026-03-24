import { useAuthStore } from '@/src/features/auth/store/authstore';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return <Redirect href="/(app)/feed" />;
  }

  return <Redirect href="/(auth)/login" />;
}
