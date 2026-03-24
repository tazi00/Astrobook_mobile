import Header from '@/src/components/header';
import { useAstrologer } from '@/src/features/astrolgers/hooks/useAstrologer';
import { useAstrologerServices } from '@/src/features/astrolgers/hooks/useAstrologerService';
import { useAstrologerSlots } from '@/src/features/astrolgers/hooks/useAstrologerSlots';
import { useCancelAppointment, useInitiateBooking } from '@/src/features/cart/hooks/useCart';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const COLORS = ['#6B21A8', '#9D174D', '#1E40AF', '#065F46', '#92400E', '#1E3A5F'];

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{ fontSize: size, color: i <= Math.floor(rating) ? '#F59E0B' : '#DDD' }}
        >
          ★
        </Text>
      ))}
      <Text style={{ fontSize: size - 2, color: '#666', marginLeft: 4 }}>{rating}</Text>
    </View>
  );
}

function generateTimeSlots(startTime: string, endTime: string, durationMinutes: number): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTime.split(':').map(Number) as [number, number];
  const [endH, endM] = endTime.split(':').map(Number) as [number, number];

  let cursor = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (cursor + durationMinutes <= endMinutes) {
    const h = Math.floor(cursor / 60);
    const m = cursor % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const displayM = m.toString().padStart(2, '0');
    slots.push(`${displayH}:${displayM} ${ampm}`);
    cursor += durationMinutes;
  }

  return slots;
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.toLocaleDateString('en-US', { weekday: 'short' });
  const num = d.getDate().toString().padStart(2, '0');
  return { day, num };
}

// "11:00 AM" + "2026-03-13" → ISO datetime string
function toISODateTime(dateStr: string, timeStr: string, _timezone: string): string {
  const [timePart, ampm] = timeStr.split(' ') as [string, string];
  const [hStr, mStr] = timePart.split(':') as [string, string];
  let h = parseInt(hStr);
  const m = parseInt(mStr);
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${dateStr}T${pad(h)}:${pad(m)}:00.000+05:30`;
}

export default function BookSlotScreen() {
  const router = useRouter();
  const { astroId, serviceId, existingAppointmentId } = useLocalSearchParams<{
    astroId: string;
    serviceId: string;
    existingAppointmentId?: string;
  }>();

  const { astrologer, isLoading: astroLoading } = useAstrologer(astroId);
  const { services, isLoading: servicesLoading } = useAstrologerServices(astroId);
  const { slots, isLoading: slotsLoading } = useAstrologerSlots(astroId);
  const { mutateAsync: initiateBooking, isPending: isBooking } = useInitiateBooking();
  const { mutateAsync: cancelAppointment } = useCancelAppointment();

  const service = services.find((s) => s.id === serviceId) ?? null;

  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const colorIndex = astroId ? astroId.charCodeAt(0) % COLORS.length : 0;
  const color = COLORS[colorIndex]!;

  const availableDates = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]!;
    return slots
      .filter((s) => s.date >= today)
      .map((s) => s.date)
      .filter((d, i, arr) => arr.indexOf(d) === i)
      .sort();
  }, [slots]);

  const timeSlots = useMemo(() => {
    if (!selectedDate || !service) return [];
    const slot = slots.find((s) => s.date === selectedDate);
    if (!slot) return [];
    return generateTimeSlots(slot.startTime, slot.endTime, service.durationMinutes);
  }, [selectedDate, slots, service]);

  const canProceed = selectedDate !== null && selectedTime !== null;

  const handleProceed = async () => {
    if (!selectedDate || !selectedTime || !astrologer || !service) return;

    const slotData = slots.find((s) => s.date === selectedDate);
    const timezone = slotData?.timezone ?? 'Asia/Kolkata';
    const scheduledAt = toISODateTime(selectedDate, selectedTime, timezone);
    console.log('selectedTime:', selectedTime);
    console.log('timezone:', timezone);
    console.log('scheduledAt sent:', scheduledAt);
    try {
      // Edit mode — pehle purana cancel karo
      if (existingAppointmentId) {
        try {
          await cancelAppointment(existingAppointmentId);
        } catch {
          // Already cancelled toh bhi chalta hai
        }
      }

      await initiateBooking({
        astrologerId: astroId,
        serviceId,
        scheduledAt,
      });
      setSheetVisible(false);
      router.push('/(app)/cart');
    } catch (err: any) {
      setSheetVisible(false);
      Alert.alert(
        existingAppointmentId ? 'Reschedule Failed' : 'Booking Failed',
        err?.message ?? 'Something went wrong. Please try again.',
      );
    }
  };

  const isLoading = astroLoading || servicesLoading;

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

  if (!astrologer || !service) {
    return (
      <View style={styles.root}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#9d0399' }}>Service not found</Text>
        </View>
      </View>
    );
  }

  const meta = astrologer.meta;

  return (
    <View style={styles.root}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* ── Service Hero Card ── */}
        <View style={styles.heroCard}>
          <View style={[styles.heroBg, { backgroundColor: color }]} />
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
          <View style={styles.heroContent}>
            <View style={[styles.heroEmojiWrap, { backgroundColor: color + '33' }]}>
              <Text style={styles.heroEmoji}>{meta.emoji}</Text>
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.heroServiceName}>{service.title}</Text>
              <Text style={styles.heroAstroName}>by {astrologer.name}</Text>
              <View style={styles.heroMetaRow}>
                <StarRating rating={meta.rating} size={12} />
                <Text style={styles.heroMetaDot}> · </Text>
                <Text style={styles.heroMetaText}>⏱ {service.durationMinutes} min</Text>
              </View>
              <Text style={styles.heroShortDesc} numberOfLines={2}>
                {service.shortDescription}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Price + Astrologer strip ── */}
        <View style={[styles.priceStrip, { borderColor: color + '30' }]}>
          <View style={styles.priceStripLeft}>
            <View style={[styles.miniAvatar, { backgroundColor: color + '22' }]}>
              <Text style={{ fontSize: 18 }}>{meta.emoji}</Text>
            </View>
            <View>
              <Text style={styles.priceStripName}>{astrologer.name}</Text>
              <Text style={styles.priceStripSpeciality}>{meta.speciality}</Text>
            </View>
          </View>
          <View style={styles.priceStripRight}>
            <Text style={[styles.priceStripPrice, { color }]}>₹{service.price}</Text>
            <Text style={styles.priceStripDuration}>{service.durationMinutes} min</Text>
          </View>
        </View>

        {/* ── Tabs ── */}
        <View style={styles.tabRow}>
          {(['about', 'reviews'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && styles.tabActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabText, activeTab === t && { color, fontWeight: '700' }]}>
                {t === 'about' ? 'About' : 'Reviews'}
              </Text>
              {activeTab === t && (
                <View style={[styles.tabUnderline, { backgroundColor: color }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Tab Content ── */}
        <View style={styles.tabContent}>
          {activeTab === 'about' && (
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>About this Service</Text>
              <Text style={styles.aboutText}>{service.about}</Text>
              <View style={styles.chipsRow}>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: color + '15', borderColor: color + '40' },
                  ]}
                >
                  <Text style={[styles.chipText, { color }]}>⏱ {service.durationMinutes} min</Text>
                </View>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: color + '15', borderColor: color + '40' },
                  ]}
                >
                  <Text style={[styles.chipText, { color }]}>💫 {meta.speciality}</Text>
                </View>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: color + '15', borderColor: color + '40' },
                  ]}
                >
                  <Text style={[styles.chipText, { color }]}>🌐 {meta.languages}</Text>
                </View>
              </View>
            </View>
          )}
          {activeTab === 'reviews' && (
            <View style={{ alignItems: 'center', paddingTop: 40 }}>
              <Text style={{ fontSize: 32 }}>⭐</Text>
              <Text style={{ color: '#AAA', marginTop: 8 }}>Reviews coming soon</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Bottom Bar ── */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={[styles.bottomPrice, { color }]}>₹{service.price}</Text>
          <Text style={styles.bottomDuration}>{service.durationMinutes} min session</Text>
        </View>
        <TouchableOpacity
          style={[styles.selectSlotBtn, { backgroundColor: color }]}
          onPress={() => setSheetVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.selectSlotBtnText}>
            {existingAppointmentId ? 'Change Slot →' : 'Select Slot →'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Slot Selection Bottom Sheet ── */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetVisible(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setSheetVisible(false)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Select Slot</Text>

          {slotsLoading ? (
            <ActivityIndicator size="small" color="#9d0399" style={{ marginVertical: 20 }} />
          ) : availableDates.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <Text style={{ fontSize: 28 }}>📅</Text>
              <Text style={{ color: '#AAA', marginTop: 8 }}>No available slots</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 16 }}
              >
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {availableDates.map((date) => {
                    const { day, num } = formatDateLabel(date);
                    const isSelected = selectedDate === date;
                    return (
                      <TouchableOpacity
                        key={date}
                        style={[
                          styles.dateChip,
                          isSelected && { backgroundColor: color, borderColor: color },
                        ]}
                        onPress={() => {
                          setSelectedDate(date);
                          setSelectedTime(null);
                        }}
                      >
                        <Text style={[styles.dateChipDay, isSelected && { color: '#FFF' }]}>
                          {day}
                        </Text>
                        <Text style={[styles.dateChipNum, isSelected && { color: '#FFF' }]}>
                          {num}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {selectedDate ? (
                timeSlots.length === 0 ? (
                  <Text style={{ color: '#AAA', textAlign: 'center', paddingVertical: 16 }}>
                    No time slots for this date
                  </Text>
                ) : (
                  <View style={styles.timeSlotsGrid}>
                    {timeSlots.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <TouchableOpacity
                          key={time}
                          style={[
                            styles.timeChip,
                            isSelected && { backgroundColor: color, borderColor: color },
                          ]}
                          onPress={() => setSelectedTime(time)}
                        >
                          <Text style={[styles.timeChipText, isSelected && { color: '#FFF' }]}>
                            {time}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )
              ) : (
                <Text style={{ color: '#CCC', textAlign: 'center', paddingVertical: 16 }}>
                  Select a date first
                </Text>
              )}
            </ScrollView>
          )}

          <View style={styles.sheetBottom}>
            <View>
              <Text style={[styles.sheetPrice, { color }]}>₹{service.price}</Text>
              {selectedDate && selectedTime ? (
                <Text style={styles.sheetSelectedSlot}>
                  {formatDateLabel(selectedDate).day} {formatDateLabel(selectedDate).num} ·{' '}
                  {selectedTime}
                </Text>
              ) : (
                <Text style={styles.sheetSelectedSlot}>No slot selected</Text>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.proceedBtn,
                { backgroundColor: canProceed && !isBooking ? color : '#CCC' },
              ]}
              disabled={!canProceed || isBooking}
              onPress={handleProceed}
            >
              {isBooking ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.proceedBtnText}>
                  {existingAppointmentId ? 'Reschedule →' : 'Proceed to Cart →'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },
  heroCard: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    height: 160,
    justifyContent: 'flex-end',
  },
  heroBg: { ...StyleSheet.absoluteFillObject, opacity: 0.92 },
  heroCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -80,
    right: -60,
    backgroundColor: '#FFFFFF15',
  },
  heroCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    bottom: -40,
    left: -20,
    backgroundColor: '#FFFFFF10',
  },
  heroContent: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18 },
  heroEmojiWrap: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 36 },
  heroInfo: { flex: 1 },
  heroServiceName: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 2 },
  heroAstroName: { fontSize: 12, color: '#FFFFFFCC', marginBottom: 4 },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  heroMetaDot: { color: '#FFFFFF88' },
  heroMetaText: { fontSize: 12, color: '#FFFFFFCC' },
  heroShortDesc: { fontSize: 12, color: '#FFFFFFAA', lineHeight: 18 },
  priceStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  priceStripLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceStripName: { fontSize: 13, fontWeight: '700', color: '#1A1A2E' },
  priceStripSpeciality: { fontSize: 11, color: '#888' },
  priceStripRight: { alignItems: 'flex-end' },
  priceStripPrice: { fontSize: 20, fontWeight: '800' },
  priceStripDuration: { fontSize: 11, color: '#AAA' },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    overflow: 'hidden',
    marginBottom: 4,
  },
  tab: { flex: 1, paddingVertical: 13, alignItems: 'center', position: 'relative' },
  tabActive: { backgroundColor: '#FAFAFE' },
  tabText: { fontSize: 13, color: '#999', fontWeight: '500' },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2.5,
    borderRadius: 2,
  },
  tabContent: { paddingHorizontal: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 14 },
  aboutSection: { gap: 14 },
  aboutText: { fontSize: 14, color: '#555', lineHeight: 22 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '600' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EDE9FF',
    elevation: 10,
  },
  bottomPrice: { fontSize: 22, fontWeight: '800' },
  bottomDuration: { fontSize: 12, color: '#AAA', marginTop: 2 },
  selectSlotBtn: { borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  selectSlotBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  sheetOverlay: { flex: 1, backgroundColor: '#00000055' },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '75%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A2E', marginBottom: 16 },
  dateChip: {
    width: 52,
    height: 60,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EDE9FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    gap: 2,
  },
  dateChipDay: { fontSize: 11, color: '#888', fontWeight: '600' },
  dateChipNum: { fontSize: 16, color: '#1A1A2E', fontWeight: '800' },
  timeSlotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 8 },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EDE9FF',
    backgroundColor: '#FFF',
  },
  timeChipText: { fontSize: 13, color: '#1A1A2E', fontWeight: '600' },
  sheetBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EDE9FF',
    marginTop: 8,
  },
  sheetPrice: { fontSize: 20, fontWeight: '800' },
  sheetSelectedSlot: { fontSize: 12, color: '#888', marginTop: 2 },
  proceedBtn: { borderRadius: 14, paddingHorizontal: 24, paddingVertical: 13 },
  proceedBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
});
