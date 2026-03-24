import Header from '@/src/components/header';
import { useMyAppointments } from '@/src/features/cart/hooks/useCart';
import type { Appointment, CartItemCategory } from '@/src/features/cart/types/index';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CATEGORIES: { id: CartItemCategory; label: string; emoji: string }[] = [
  { id: 'consultation', label: 'Consultations', emoji: '🔮' },
  { id: 'course', label: 'Courses', emoji: '📚' },
  { id: 'product', label: 'Products', emoji: '🛍️' },
];

const STATUS_SECTIONS = [
  { key: 'confirmedUpcoming', label: 'Upcoming', color: '#6B21A8', emoji: '📅' },
  { key: 'ongoing', label: 'Ongoing', color: '#065F46', emoji: '🟢' },
  { key: 'completed', label: 'Completed', color: '#1E40AF', emoji: '✅' },
] as const;

function formatScheduledAt(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date, time };
}

function BookingCard({
  item,
  status,
  onPress,
}: {
  item: Appointment;
  status: (typeof STATUS_SECTIONS)[number];
  onPress: () => void;
}) {
  const { date, time } = formatScheduledAt(item.scheduledAt);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.cardStrip, { backgroundColor: status.color }]} />
      <View style={styles.cardInner}>
        <View style={styles.cardTop}>
          <View style={styles.cardEmoji}>
            <Text style={{ fontSize: 22 }}>🔮</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardServiceName}>{item.service.title}</Text>
            <Text style={styles.cardAstroName}>by {item.astrologerName}</Text>
            <Text style={styles.cardDesc} numberOfLines={1}>
              {item.service.shortDescription}
            </Text>
          </View>
          {/* Status badge */}
          <View style={[styles.statusBadge, { backgroundColor: status.color + '18' }]}>
            <Text style={[styles.statusBadgeText, { color: status.color }]}>
              {status.emoji} {status.label}
            </Text>
          </View>
        </View>

        {/* Slot chips */}
        <View style={styles.chips}>
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

        {/* Price + Action */}
        <View style={styles.cardBottom}>
          <Text style={styles.cardPrice}>₹{item.service.price}</Text>

          {/* Ongoing → Join Session button */}
          {item.status === 'ongoing' && (
            <TouchableOpacity style={styles.joinBtn} onPress={onPress}>
              <Text style={styles.joinBtnText}>Join Session →</Text>
            </TouchableOpacity>
          )}

          {/* Upcoming → Join button disabled with countdown */}
          {item.status === 'confirmed' && (
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingBadgeText}>Scheduled</Text>
            </View>
          )}

          {/* Completed → View details */}
          {item.status === 'completed' && (
            <TouchableOpacity style={styles.viewBtn} onPress={onPress}>
              <Text style={styles.viewBtnText}>View Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MyBookingsScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CartItemCategory>('consultation');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { upcoming, ongoing, completed, cancelled, isLoading, refetch } = useMyAppointments();

  const activeLabel = CATEGORIES.find((c) => c.id === activeCategory)!;
  const confirmedUpcoming = upcoming.filter((a) => a.status === 'confirmed');
  // Abhi sirf consultation — baad mein courses/products aayenge
  const grouped = {
    confirmedUpcoming,
    ongoing,
    completed,
  };

  const totalBookings = upcoming.length + ongoing.length + completed.length + cancelled.length;

  return (
    <View style={styles.root}>
      <Header />

      {/* ── Category Dropdown ── */}
      <View style={styles.dropdownWrap}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setDropdownOpen((p) => !p)}
          activeOpacity={0.85}
        >
          <Text style={styles.dropdownText}>
            {activeLabel.emoji} {activeLabel.label}
          </Text>
          <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={styles.dropdownMenu}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.dropdownItem,
                  activeCategory === cat.id && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setActiveCategory(cat.id);
                  setDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    activeCategory === cat.id && styles.dropdownItemTextActive,
                  ]}
                >
                  {cat.emoji} {cat.label}
                </Text>
                {activeCategory === cat.id && <Text style={{ color: '#9d0399' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* ── Content ── */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#9d0399" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        >
          {totalBookings === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 48 }}>📭</Text>
              <Text style={styles.emptyTitle}>No Bookings Yet</Text>
              <Text style={styles.emptySub}>Book a consultation to get started</Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => router.push('/(app)/astrologers')}
              >
                <Text style={styles.browseBtnText}>Browse Astrologers</Text>
              </TouchableOpacity>
            </View>
          ) : (
            STATUS_SECTIONS.map((section) => {
              const items = grouped[section.key];
              if (items.length === 0) return null;
              return (
                <View key={section.key} style={styles.section}>
                  {/* Section header */}
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: section.color }]}>
                      {section.emoji} {section.label}
                    </Text>
                    <View style={[styles.sectionCount, { backgroundColor: section.color + '18' }]}>
                      <Text style={[styles.sectionCountText, { color: section.color }]}>
                        {items.length}
                      </Text>
                    </View>
                  </View>

                  {/* Cards */}
                  <View style={{ gap: 10 }}>
                    {items.map((item) => (
                      <BookingCard
                        key={item.id}
                        item={item}
                        status={section}
                        onPress={() => {
                          if (item.status === 'ongoing') {
                            router.push({
                              pathname: '/(app)/session',
                              params: {
                                appointmentId: item.id,
                                channel: item.agoraChannel ?? '',
                                token: item.agoraToken ?? '',
                              },
                            });
                          }
                        }}
                      />
                    ))}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },

  // Dropdown
  dropdownWrap: { marginHorizontal: 16, marginTop: 12, zIndex: 10 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#9d0399',
  },
  dropdownText: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  dropdownArrow: { fontSize: 12, color: '#9d0399' },
  dropdownMenu: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    elevation: 10,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  dropdownItemActive: { backgroundColor: '#F9F0FF' },
  dropdownItemText: { fontSize: 14, color: '#555', fontWeight: '500' },
  dropdownItemTextActive: { color: '#9d0399', fontWeight: '700' },

  // Section
  section: { gap: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  sectionCount: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  sectionCountText: { fontSize: 12, fontWeight: '800' },

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
  cardStrip: { width: 5 },
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
  cardDesc: { fontSize: 11, color: '#AAA', marginTop: 2 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusBadgeText: { fontSize: 10, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: '#F5F0FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 11, color: '#6B21A8', fontWeight: '600' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardPrice: { fontSize: 16, fontWeight: '800', color: '#9d0399' },

  // Buttons
  joinBtn: {
    backgroundColor: '#065F46',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  joinBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  upcomingBadge: {
    backgroundColor: '#EDE9FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  upcomingBadgeText: { color: '#6B21A8', fontSize: 11, fontWeight: '700' },
  viewBtn: {
    borderWidth: 1.5,
    borderColor: '#9d0399',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  viewBtnText: { color: '#9d0399', fontSize: 11, fontWeight: '700' },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E' },
  emptySub: { fontSize: 13, color: '#AAA' },
  browseBtn: {
    marginTop: 16,
    backgroundColor: '#9d0399',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  browseBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});
