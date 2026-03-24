import auth from '@react-native-firebase/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { authService } from '../service/auth.service';
import { useAuthStore } from '../store/authstore';

// ← Module level pe — component unmount hone pe bhi survive karega
let confirmationResult: any = null;

export const useAuth = () => {
  const router = useRouter();
  const { login, logout: storeLogout } = useAuthStore();

  const sendOTPMutation = useMutation({
    mutationFn: (phoneNumber: string) => auth().signInWithPhoneNumber(phoneNumber),
    onSuccess: (confirmation) => {
      confirmationResult = confirmation; // ← ref nahi, module variable
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: async (otp: string) => {
      if (!confirmationResult) throw new Error('Pehle OTP bhejo');
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      return authService.login(idToken);
    },
    onSuccess: (response) => {
      login(response.user, response.accessToken, response.refreshToken);
      if (response.user.isOnboarded) {
        router.replace('/(app)/feed');
      } else {
        router.replace('/(auth)/onboarding');
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { refreshToken } = useAuthStore.getState();
      if (refreshToken) await authService.logout(refreshToken);
      await auth().signOut();
    },
    onSuccess: () => {
      storeLogout();
      router.replace('/(auth)/login');
    },
    onError: () => {
      storeLogout();
      router.replace('/(auth)/login');
    },
  });

  return {
    sendOTP: sendOTPMutation.mutate,
    verifyOTP: verifyOTPMutation.mutate,
    logout: logoutMutation.mutate,
    sendingOTP: sendOTPMutation.isPending,
    verifyingOTP: verifyOTPMutation.isPending,
    sendOTPError: sendOTPMutation.error?.message,
    verifyOTPError: verifyOTPMutation.error?.message,
  };
};
