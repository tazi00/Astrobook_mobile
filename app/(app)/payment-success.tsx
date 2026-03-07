import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function generateId(prefix: string) {
  return `${prefix}${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { total, serviceName } = useLocalSearchParams<any>();
  const bookingId = generateId('BK');
  const transactionId = generateId('TXN');

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successCircle}>
          <Text style={styles.successEmoji}>✅</Text>
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your consultation has been booked successfully</Text>

        {/* Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Service</Text>
            <Text style={styles.detailVal}>{serviceName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Amount Paid</Text>
            <Text style={[styles.detailVal, { color: '#9d0399' }]}>₹{total}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Booking ID</Text>
            <Text style={styles.detailVal}>{bookingId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Transaction ID</Text>
            <Text style={styles.detailVal}>{transactionId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>🟡 Upcoming</Text>
            </View>
          </View>
        </View>

        {/* Info */}
        <Text style={styles.infoText}>
          You can add details, upload documents, or reschedule from your Bookings section.
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.btnCol}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace('/(app)/feed')}
        >
          <Text style={styles.primaryBtnText}>Go to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace('/(app)/feed')}
        >
          <Text style={styles.secondaryBtnText}>View Bookings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF', justifyContent: 'space-between', padding: 24, paddingTop: 80 },
  content: { alignItems: 'center' },
  successCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#FAF0FF', alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, borderWidth: 2, borderColor: '#9d0399',
  },
  successEmoji: { fontSize: 48 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 28 },
  detailsCard: {
    width: '100%', backgroundColor: '#FFF', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#EDE9FF', gap: 14,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailKey: { fontSize: 13, color: '#888' },
  detailVal: { fontSize: 13, fontWeight: '700', color: '#1A1A2E', maxWidth: '55%', textAlign: 'right' },
  statusBadge: {
    backgroundColor: '#FEF3C7', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  statusText: { fontSize: 12, fontWeight: '600', color: '#92400E' },
  infoText: { fontSize: 12, color: '#AAA', textAlign: 'center', marginTop: 20, lineHeight: 18 },
  btnCol: { gap: 12 },
  primaryBtn: {
    backgroundColor: '#9d0399', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  secondaryBtn: {
    backgroundColor: '#FFF', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#9d0399',
  },
  secondaryBtnText: { color: '#9d0399', fontSize: 16, fontWeight: '700' },
});
