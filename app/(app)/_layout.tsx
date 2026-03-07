import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

function TabIcon({ name, color }: { name: string; color: string }) {
  return <Feather name={name as any} size={22} color={color} />;
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff1ff',
          borderTopWidth: 0,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
          elevation: 8,
        },
        tabBarActiveTintColor: '#9d0399',
        tabBarInactiveTintColor: '#4A4468',
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="astrologers"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="zodiac-aries" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color }) => <Feather name="compass" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="podcast"
        options={{
          tabBarIcon: ({ color }) => <Feather name="mic" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />

      {/* Yeh screens tabs mein nahi dikhenge — tabBar hidden hoga */}
      <Tabs.Screen
        name="astrologer-profile"
        options={{
          href: null, // Tab bar mein nahi dikhega
          tabBarStyle: { display: 'none' }, // Tab bar hide
        }}
      />
      <Tabs.Screen
        name="book-slot"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="payment-success"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
