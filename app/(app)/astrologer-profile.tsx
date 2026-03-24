import Header from '@/src/components/header';
import { useAstrologer } from '@/src/features/astrolgers/hooks/useAstrologer';
import { useAstrologerServices } from '@/src/features/astrolgers/hooks/useAstrologerService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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

export default function AstrologerProfileScreen() {
  const router = useRouter();
  const { id, tab } = useLocalSearchParams<{ id: string; tab?: string }>();
  const [activeTab, setActiveTab] = useState<'about' | 'consultations' | 'reviews'>(
    tab === 'services' ? 'consultations' : 'about',
  );

  const { astrologer, isLoading: astroLoading } = useAstrologer(id);
  const { services, isLoading: servicesLoading } = useAstrologerServices(id);

  const colorIndex = id ? id.charCodeAt(0) % COLORS.length : 0;
  const color = COLORS[colorIndex]!;

  if (astroLoading) {
    return (
      <View style={styles.root}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#9d0399" />
        </View>
      </View>
    );
  }

  if (!astrologer) {
    return (
      <View style={styles.root}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#9d0399' }}>Astrologer not found</Text>
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
        {/* ── Profile Header Card ── */}
        <View style={styles.profileCard}>
          <View style={[styles.bgCircle1, { backgroundColor: color + '30' }]} />
          <View style={[styles.bgCircle2, { backgroundColor: color + '18' }]} />

          <View style={styles.profileTopRow}>
            <View style={styles.avatarWrap}>
              <View style={[styles.avatarRing, { borderColor: color + '60' }]}>
                <View style={[styles.avatar, { backgroundColor: color + '22' }]}>
                  <Text style={styles.avatarEmoji}>{meta.emoji}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.onlineBadge,
                  { backgroundColor: meta.online ? '#22C55E' : '#9CA3AF' },
                ]}
              >
                <Text style={styles.onlineBadgeText}>{meta.online ? '● Live' : '● Off'}</Text>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{astrologer.name}</Text>
              <Text style={[styles.profileSpeciality, { color }]}>{meta.speciality}</Text>
              <Text style={styles.profileLang}>🌐 {meta.languages}</Text>
              <View style={styles.profileMetaRow}>
                <StarRating rating={meta.rating} size={13} />
                <Text style={styles.reviewCount}> ({meta.reviews})</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.followBtn, { borderColor: color }]}>
              <Text style={[styles.followBtnText, { color }]}>Follow +</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color }]}>{meta.exp}</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color }]}>{meta.rating} ⭐</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color }]}>{meta.reviews}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color }]}>₹{meta.price}</Text>
              <Text style={styles.statLabel}>Per Min</Text>
            </View>
          </View>
        </View>

        {/* ── Tabs ── */}
        <View style={styles.tabRow}>
          {(['about', 'consultations', 'reviews'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && styles.tabActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabText, activeTab === t && { color, fontWeight: '700' }]}>
                {t === 'about' ? 'About' : t === 'consultations' ? 'Consultations' : 'Reviews'}
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
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.aboutText}>{meta.about}</Text>
              <View style={styles.chipsRow}>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: color + '15', borderColor: color + '40' },
                  ]}
                >
                  <Text style={[styles.chipText, { color }]}>🌐 {meta.languages}</Text>
                </View>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: color + '15', borderColor: color + '40' },
                  ]}
                >
                  <Text style={[styles.chipText, { color }]}>⏳ {meta.exp}</Text>
                </View>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: color + '15', borderColor: color + '40' },
                  ]}
                >
                  <Text style={[styles.chipText, { color }]}>💫 {meta.speciality}</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'consultations' && (
            <View style={{ gap: 12 }}>
              <Text style={styles.sectionTitle}>Consultation Services</Text>
              {servicesLoading ? (
                <ActivityIndicator size="small" color="#9d0399" />
              ) : services.length === 0 ? (
                <Text style={{ color: '#AAA', textAlign: 'center' }}>No services available</Text>
              ) : (
                services.map((service) => (
                  <View key={service.id} style={styles.serviceCard}>
                    <View style={[styles.serviceStrip, { backgroundColor: color }]} />
                    <View style={styles.serviceInner}>
                      <View style={styles.serviceLeft}>
                        <View style={[styles.serviceEmojiWrap, { backgroundColor: color + '18' }]}>
                          <Text style={styles.serviceEmoji}>🔮</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.serviceName}>{service.title}</Text>
                          <Text style={styles.serviceDuration}>
                            ⏱ {service.durationMinutes} min
                          </Text>
                          <Text style={styles.serviceDesc} numberOfLines={1}>
                            {service.shortDescription}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.serviceRight}>
                        <Text style={[styles.servicePrice, { color }]}>₹{service.price}</Text>
                        <TouchableOpacity
                          style={[styles.bookServiceBtn, { backgroundColor: color }]}
                          onPress={() =>
                            router.push({
                              pathname: '/(app)/book-slot',
                              params: {
                                astroId: id,
                                serviceId: service.id,
                                serviceName: service.title,
                                price: service.price,
                              },
                            })
                          }
                        >
                          <Text style={styles.bookServiceBtnText}>Book</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
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
          <Text style={[styles.bottomPrice, { color }]}>
            ₹{meta.price}
            <Text style={styles.bottomPriceSub}>/min</Text>
          </Text>
          <Text style={styles.bottomOnline}>{meta.online ? '🟢 Online Now' : '⚫ Offline'}</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookNowBtn, { backgroundColor: color }]}
          onPress={() => {
            if (activeTab === 'consultations') {
              // Already consultations tab mein hai → book-slot pe jaao
              // But serviceId kahan se? Pehli service le lo
              const firstService = services[0];
              if (firstService) {
                router.push({
                  pathname: '/(app)/book-slot',
                  params: { astroId: id, serviceId: firstService.id },
                });
              }
            } else {
              // Consultations tab open karo
              setActiveTab('consultations');
            }
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.bookNowBtnText}>Book Consultation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },
  profileCard: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 20,
    padding: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EDE9FF',
    elevation: 3,
  },
  bgCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -60,
    right: -40,
  },
  bgCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    bottom: -30,
    left: -20,
  },
  profileTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 20 },
  avatarWrap: { position: 'relative' },
  avatarRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2.5,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 34 },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  onlineBadgeText: { fontSize: 9, color: '#FFF', fontWeight: '700' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 2 },
  profileSpeciality: { fontSize: 13, fontWeight: '600', marginBottom: 3 },
  profileLang: { fontSize: 11, color: '#888', marginBottom: 4 },
  profileMetaRow: { flexDirection: 'row', alignItems: 'center' },
  reviewCount: { fontSize: 11, color: '#AAA' },
  followBtn: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 2,
  },
  followBtnText: { fontSize: 11, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F6FF',
    borderRadius: 14,
    paddingVertical: 12,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 13, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 10, color: '#999' },
  statDivider: { width: 1, height: 28, backgroundColor: '#E5E0F5' },
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
  serviceCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    overflow: 'hidden',
    elevation: 1,
    flexDirection: 'row',
  },
  serviceStrip: { width: 5 },
  serviceInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  serviceLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  serviceEmojiWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceEmoji: { fontSize: 24 },
  serviceName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  serviceDuration: { fontSize: 12, color: '#888', marginTop: 2 },
  serviceDesc: { fontSize: 11, color: '#AAA', marginTop: 2 },
  serviceRight: { alignItems: 'flex-end', gap: 6 },
  servicePrice: { fontSize: 16, fontWeight: '800' },
  bookServiceBtn: { borderRadius: 8, paddingHorizontal: 16, paddingVertical: 6 },
  bookServiceBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
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
  bottomPriceSub: { fontSize: 13, color: '#AAA', fontWeight: '400' },
  bottomOnline: { fontSize: 12, color: '#666', marginTop: 2 },
  bookNowBtn: { borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  bookNowBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
});
