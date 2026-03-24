import { useAuthStore } from '@/src/features/auth/store/authstore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { OnboardingPayload, userService } from '../service/user.service';
import { useRouter } from 'expo-router';

export const useUser = () => {
  const { user, updateUser } = useAuthStore();
  const router = useRouter(); // ← add karo
  // Profile fetch
  const profileQuery = useQuery({
    queryKey: ['user', 'me'],
    queryFn: userService.getMe,
    enabled: !!user, // sirf tab fetch karo jab logged in ho
  });

  // Onboarding
  const onboardMutation = useMutation({
    mutationFn: (payload: OnboardingPayload) => userService.onboard(payload),
    onSuccess: (response) => {
      updateUser({ name: response.name, isOnboarded: true });
      router.replace('/(app)/feed'); // ← add karo
    },
  });

  // Profile update
  const updateMutation = useMutation({
    mutationFn: (data: Partial<OnboardingPayload>) => userService.updateMe(data),
    onSuccess: (response) => {
      updateUser({ name: response.name });
    },
  });

  return {
    profile: profileQuery.data,
    profileLoading: profileQuery.isLoading,

    onboard: onboardMutation.mutate,
    onboarding: onboardMutation.isPending,
    onboardError: onboardMutation.error?.message,

    updateProfile: updateMutation.mutate,
    updating: updateMutation.isPending,
  };
};
