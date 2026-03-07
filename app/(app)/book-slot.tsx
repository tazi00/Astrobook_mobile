import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';

const TIME_SLOTS = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','5:00 PM'];
const DATES = ['Today','Tomorrow','Mon 3 Mar','Tue 4 Mar','Wed 5 Mar','Thu 6 Mar'];

export default function BookSlotScreen() {
  const router = useRouter();
  const { astroId, serviceId, serviceName, price } = useLocalSearchParams<any>();
  const [bookingType, setBookingType] = useState<'instant' | 'schedule'>('instant');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('');

  const handleAddToCart = () => {
    router.push({
      pathname: '/(app)/cart',
      params: { astroId, serviceId, serviceName, price, bookingType, selectedDate, selectedTime },
    });
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Slot</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{serviceName}</Text>
          <Text style={styles.servicePrice}>₹{price}</Text>
        </View>

        {/* Booking Type */}
        <Text style={styles.sectionTitle}>Booking Type</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeCard, bookingType === 'instant' && styles.typeCardActive]}
            onPress={() => setBookingType('instant')}
          >
            <Text style={styles.typeEmoji}>⚡</Text>
            <Text style={[styles.typeLabel, bookingType === 'instant' && styles.typeLabelActive]}>Instant</Text>
            <Text style={styles.typeSub}>Now • ~30 min</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeCard, bookingType === 'schedule' && styles.typeCardActive]}
            onPress={() => setBookingType('schedule')}
          >
            <Text style={styles.typeEmoji}>📅</Text>
            <Text style={[styles.typeLabel, bookingType === 'schedule' && styles.typeLabelActive]}>Schedule</Text>
            <Text style={styles.typeSub}>Pick date & time</Text>
          </TouchableOpacity>
        </View>

        {/* Schedule options */}
        {bookingType === 'schedule' && (
          <>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
              {DATES.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.dateChip, selectedDate === d && styles.dateChipActive]}
                  onPress={() => setSelectedDate(d)}
                >
                  <Text style={[styles.dateChipText, selectedDate === d && styles.dateChipTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.timesGrid}>
              {TIME_SLOTS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeChip, selectedTime === t && styles.timeChipActive]}
                  onPress={() => setSelectedTime(t)}
                >
                  <Text style={[styles.timeChipText, selectedTime === t && styles.timeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {bookingType === 'instant' && (
          <View style={styles.instantInfo}>
            <Text style={styles.instantEmoji}>⚡</Text>
            <Text style={styles.instantText}>Astrologer will connect with you within 30 minutes!</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total Amount</Text>
          <Text style={styles.bottomPrice}>₹{price}</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={styles.cartBtnText}>Add to Cart →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 14,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EDE9FF',
  },
  backIcon: { fontSize: 22, color: '#9d0399' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
  content: { padding: 16 },
  serviceInfo: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: '#EDE9FF',
  },
  serviceName: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  servicePrice: { fontSize: 18, fontWeight: '800', color: '#9d0399' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 12, marginTop: 8 },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  typeCard: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 14, padding: 16,
    alignItems: 'center', borderWidth: 2, borderColor: '#EDE9FF',
  },
  typeCardActive: { borderColor: '#9d0399', backgroundColor: '#FAF0FF' },
  typeEmoji: { fontSize: 28, marginBottom: 6 },
  typeLabel: { fontSize: 14, fontWeight: '700', color: '#888' },
  typeLabelActive: { color: '#9d0399' },
  typeSub: { fontSize: 11, color: '#AAA', marginTop: 2 },
  datesRow: { gap: 8, paddingBottom: 4, marginBottom: 16 },
  dateChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#EDE9FF',
  },
  dateChipActive: { backgroundColor: '#9d0399', borderColor: '#9d0399' },
  dateChipText: { fontSize: 13, color: '#666', fontWeight: '500' },
  dateChipTextActive: { color: '#FFF', fontWeight: '700' },
  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  timeChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#EDE9FF',
  },
  timeChipActive: { backgroundColor: '#9d0399', borderColor: '#9d0399' },
  timeChipText: { fontSize: 13, color: '#666' },
  timeChipTextActive: { color: '#FFF', fontWeight: '700' },
  instantInfo: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FAF0FF', borderRadius: 14, padding: 20,
    borderWidth: 1, borderColor: '#EDE9FF', marginTop: 8,
  },
  instantEmoji: { fontSize: 32 },
  instantText: { flex: 1, fontSize: 14, color: '#6B21A8', lineHeight: 22 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: '#EDE9FF', elevation: 8,
  },
  bottomLabel: { fontSize: 12, color: '#888' },
  bottomPrice: { fontSize: 22, fontWeight: '800', color: '#9d0399' },
  cartBtn: { backgroundColor: '#9d0399', borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  cartBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});
