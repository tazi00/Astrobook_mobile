import Header from '@/src/components/header';
import { cartService } from '@/src/features/cart/service/cart.service';
import { Appointment } from '@/src/features/cart/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function formatScheduledAt(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date, time };
}

function ConfirmedCard({ item }: { item: Appointment }) {
  const { date, time } = formatScheduledAt(item.scheduledAt);

  return (
    <View style={styles.card}>
      <View style={styles.cardStrip} />
      <View style={styles.cardInner}>
        <View style={styles.cardTop}>
          <View style={styles.cardEmoji}>
            <Text style={{ fontSize: 22 }}>🔮</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardServiceName}>{item.service.title}</Text>
            <Text style={styles.cardAstroName}>by {item.astrologerName}</Text>
          </View>
          <Text style={styles.cardPrice}>₹{item.service.price}</Text>
        </View>
        <View style={styles.cardChips}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>📅 {date}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>🕐 {time}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>⏱ {item.service.durationMinutes} min</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function BookingConfirmedScreen() {
  const router = useRouter();
  const { appointmentIds } = useLocalSearchParams<{ appointmentIds: string }>();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ids = appointmentIds?.split(',').filter(Boolean) ?? [];
    if (ids.length === 0) {
      setIsLoading(false);
      return;
    }

    Promise.all(ids.map((id) => cartService.getAppointmentById(id)))
      .then((results) => setAppointments(results.map((r) => r.appointment)))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [appointmentIds]);

  const totalPrice = appointments.reduce((sum, a) => sum + Number(a.service.price), 0);

  if (isLoading) {
    return (
      <View style={styles.root}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#9d0399" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }}
      >
        {/* ── Success Banner ── */}
        <View style={styles.successBanner}>
          <View style={styles.successIconWrap}>
            <Text style={styles.successIcon}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSub}>
            Your {appointments.length > 1 ? `${appointments.length} sessions are` : 'session is'}{' '}
            booked successfully
          </Text>
        </View>

        {/* ── Confirmed Appointments ── */}
        <Text style={styles.sectionTitle}>Booking Details</Text>
        {appointments.map((item) => (
          <ConfirmedCard key={item.id} item={item} />
        ))}

        {/* ── Price Summary ── */}
        <View style={styles.priceBox}>
          <Text style={styles.priceBoxTitle}>Price Summary</Text>
          {appointments.map((item) => (
            <View key={item.id} style={styles.priceRow}>
              <Text style={styles.priceRowLabel} numberOfLines={1}>
                {item.service.title}
              </Text>
              <Text style={styles.priceRowValue}>₹{item.service.price}</Text>
            </View>
          ))}
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>₹{totalPrice}</Text>
          </View>
        </View>

        {/* ── Safe note ── */}
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.safeText}>🔒 Safe and Secure Payments via Razorpay</Text>
        </View>
      </ScrollView>

      {/* ── Bottom Buttons ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push('/(app)/astrologers')}
        >
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/(app)/my-bookings')}
        >
          <Text style={styles.primaryBtnText}>My Bookings →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },

  // Success banner
  successBanner: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    elevation: 1,
  },
  successIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  successIcon: { fontSize: 36 },
  successTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A2E' },
  successSub: { fontSize: 14, color: '#666', textAlign: 'center' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E' },

  // Card
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 1,
  },
  cardStrip: { width: 5, backgroundColor: '#9d0399' },
  cardInner: { flex: 1, padding: 14, gap: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardEmoji: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardServiceName: { fontSize: 14, fontWeight: '800', color: '#1A1A2E' },
  cardAstroName: { fontSize: 12, color: '#9d0399', fontWeight: '600', marginTop: 1 },
  cardPrice: { fontSize: 16, fontWeight: '800', color: '#9d0399' },
  cardChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: '#F5F0FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 11, color: '#6B21A8', fontWeight: '600' },

  // Price box
  priceBox: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    padding: 16,
    gap: 10,
  },
  priceBoxTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceRowLabel: { fontSize: 13, color: '#666', flex: 1, marginRight: 8 },
  priceRowValue: { fontSize: 13, color: '#1A1A2E', fontWeight: '600' },
  priceDivider: { height: 1, backgroundColor: '#EDE9FF' },
  totalLabel: { fontSize: 15, fontWeight: '800', color: '#1A1A2E' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#9d0399' },

  safeText: { fontSize: 12, color: '#AAA' },

  // Bottom
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EDE9FF',
    elevation: 10,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#9d0399',
    alignItems: 'center',
  },
  secondaryBtnText: { color: '#9d0399', fontSize: 14, fontWeight: '700' },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#9d0399',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
});
