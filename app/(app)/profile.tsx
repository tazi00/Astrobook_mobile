import { View, Text, StyleSheet } from 'react-native';
export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 Profile</Text>
      <Text style={styles.sub}>Coming soon...</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080617', alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 28, color: '#F5ECD7', fontWeight: '700', marginBottom: 8 },
  sub: { color: '#4A4468', fontSize: 14 },
});
