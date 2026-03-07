import Header from '@/src/components/header';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ASTROLOGERS: Record<string, any> = {
  '1': {
    name: 'Suprio Karmakar',
    speciality: 'Vedic Astrology',
    languages: 'Bengali, English, Hindi',
    exp: '15 Years',
    rating: 4.5,
    reviews: 1021,
    price: 199,
    emoji: '🔮',
    color: '#6B21A8',
    online: true,
    about:
      'Expert in Vedic astrology with 15+ years of experience. Specializes in Kundali analysis, marriage compatibility, and career guidance.',
    services: [
      { id: '1', name: 'Couples Harmony', price: 499, duration: '30 min', emoji: '💑' },
      { id: '2', name: 'Love Healing', price: 699, duration: '45 min', emoji: '❤️' },
      { id: '3', name: 'Career Healing', price: 599, duration: '30 min', emoji: '🚀' },
      { id: '4', name: 'Medical Healing', price: 799, duration: '60 min', emoji: '🌿' },
    ],
    reviews_list: [
      {
        id: '1',
        name: 'Priya S.',
        rating: 5,
        comment: 'Very accurate predictions. Highly recommended!',
        date: '12 Jan 2026',
      },
      {
        id: '2',
        name: 'Rahul M.',
        rating: 4,
        comment: 'Good session, very helpful for career guidance.',
        date: '5 Jan 2026',
      },
      {
        id: '3',
        name: 'Sneha K.',
        rating: 5,
        comment: 'Amazing experience! Will consult again.',
        date: '28 Dec 2025',
      },
    ],
  },
  '2': {
    name: 'Ananya Sharma',
    speciality: 'Tarot Expert',
    languages: 'Hindi, English',
    exp: '8 Years',
    rating: 4.8,
    reviews: 856,
    price: 299,
    emoji: '🃏',
    color: '#9D174D',
    online: true,
    about:
      'Professional Tarot reader with deep expertise in love, relationships, and spiritual guidance.',
    services: [
      { id: '1', name: 'Love Reading', price: 399, duration: '30 min', emoji: '❤️' },
      { id: '2', name: 'Career Reading', price: 499, duration: '45 min', emoji: '🚀' },
      { id: '3', name: 'General Reading', price: 299, duration: '20 min', emoji: '🃏' },
    ],
    reviews_list: [
      {
        id: '1',
        name: 'Amit R.',
        rating: 5,
        comment: 'Mind-blowing accuracy!',
        date: '20 Jan 2026',
      },
    ],
  },
};

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
  const { id } = useLocalSearchParams<{ id: string }>();
  const astro = ASTROLOGERS[id] || ASTROLOGERS['1'];
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');

  return (
    <View style={styles.root}>
      {/* Header */}
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileBanner, { backgroundColor: astro.color }]}>
          <View style={styles.profileAvatarWrap}>
            <View style={[styles.profileAvatar, { backgroundColor: astro.color }]}>
              <Text style={styles.profileEmoji}>{astro.emoji}</Text>
            </View>
            <View
              style={[styles.onlineDot, { backgroundColor: astro.online ? '#22C55E' : '#9CA3AF' }]}
            />
          </View>
          <Text style={styles.profileName}>{astro.name}</Text>
          <Text style={styles.profileSpeciality}>{astro.speciality}</Text>
          <View style={styles.profileStatsRow}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatVal}>{astro.exp}</Text>
              <Text style={styles.profileStatLabel}>Experience</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatVal}>{astro.rating}⭐</Text>
              <Text style={styles.profileStatLabel}>Rating</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatVal}>{astro.reviews}</Text>
              <Text style={styles.profileStatLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        {/* Language & Price badges */}
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🌐 {astro.languages}</Text>
          </View>
          <View style={[styles.badge, styles.priceBadge]}>
            <Text style={styles.priceBadgeText}>₹{astro.price}/min</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {(['about', 'services', 'reviews'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {/* About */}
          {activeTab === 'about' && (
            <View>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.aboutText}>{astro.about}</Text>
            </View>
          )}

          {/* Services */}
          {activeTab === 'services' && (
            <View style={{ gap: 12 }}>
              <Text style={styles.sectionTitle}>Consultation Types</Text>
              {astro.services.map((service: any) => (
                <View key={service.id} style={styles.serviceCard}>
                  <View style={styles.serviceLeft}>
                    <Text style={styles.serviceEmoji}>{service.emoji}</Text>
                    <View>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <Text style={styles.serviceDuration}>⏱ {service.duration}</Text>
                    </View>
                  </View>
                  <View style={styles.serviceRight}>
                    <Text style={styles.servicePrice}>₹{service.price}</Text>
                    <TouchableOpacity
                      style={styles.bookServiceBtn}
                      onPress={() =>
                        router.push({
                          pathname: '/(app)/book-slot',
                          params: {
                            astroId: id,
                            serviceId: service.id,
                            serviceName: service.name,
                            price: service.price,
                          },
                        })
                      }
                    >
                      <Text style={styles.bookServiceBtnText}>Book</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <View style={{ gap: 12 }}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              {astro.reviews_list.map((review: any) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text style={{ color: '#FFF', fontWeight: '700' }}>{review.name[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewName}>{review.name}</Text>
                      <StarRating rating={review.rating} size={12} />
                    </View>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Book Button */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>
            ₹{astro.price}
            <Text style={styles.bottomPriceSub}>/min</Text>
          </Text>
          <Text style={styles.bottomOnline}>{astro.online ? '🟢 Online Now' : '⚫ Offline'}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookNowBtn}
          onPress={() => setActiveTab('services')}
          activeOpacity={0.85}
        >
          <Text style={styles.bookNowBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FF',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 22, color: '#9d0399' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoAstro: { fontSize: 20, fontWeight: '800', color: '#1A1A2E' },
  logoBookBadge: {
    backgroundColor: '#9d0399',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 2,
  },
  logoBook: { fontSize: 20, fontWeight: '800', color: '#FFF' },

  // Profile Banner
  profileBanner: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  profileAvatarWrap: { position: 'relative', marginBottom: 16 },
  profileAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF50',
  },
  profileEmoji: { fontSize: 44 },
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileName: { fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  profileSpeciality: { fontSize: 14, color: '#FFFFFFCC', marginBottom: 20 },
  profileStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  profileStat: { alignItems: 'center', paddingHorizontal: 20 },
  profileStatVal: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  profileStatLabel: { fontSize: 11, color: '#FFFFFFAA', marginTop: 2 },
  profileStatDivider: { width: 1, height: 32, backgroundColor: '#FFFFFF30' },

  // Badges
  badgesRow: { flexDirection: 'row', gap: 10, padding: 16, flexWrap: 'wrap' },
  badge: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#EDE9FF',
  },
  badgeText: { fontSize: 12, color: '#444' },
  priceBadge: { backgroundColor: '#9d0399', borderColor: '#9d0399' },
  priceBadgeText: { fontSize: 12, color: '#FFF', fontWeight: '700' },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FF',
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#9d0399' },
  tabText: { fontSize: 14, color: '#888', fontWeight: '500' },
  tabTextActive: { color: '#9d0399', fontWeight: '700' },

  // Tab Content
  tabContent: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  aboutText: { fontSize: 14, color: '#555', lineHeight: 22 },

  // Service Card
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    elevation: 1,
  },
  serviceLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  serviceEmoji: { fontSize: 28 },
  serviceName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  serviceDuration: { fontSize: 12, color: '#888', marginTop: 2 },
  serviceRight: { alignItems: 'flex-end', gap: 6 },
  servicePrice: { fontSize: 16, fontWeight: '800', color: '#9d0399' },
  bookServiceBtn: {
    backgroundColor: '#9d0399',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  bookServiceBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },

  // Review
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    elevation: 1,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#9d0399',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewName: { fontSize: 13, fontWeight: '700', color: '#1A1A2E', marginBottom: 2 },
  reviewDate: { fontSize: 11, color: '#AAA' },
  reviewComment: { fontSize: 13, color: '#555', lineHeight: 20 },

  // Bottom Bar
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
    elevation: 8,
  },
  bottomPrice: { fontSize: 22, fontWeight: '800', color: '#9d0399' },
  bottomPriceSub: { fontSize: 13, color: '#AAA', fontWeight: '400' },
  bottomOnline: { fontSize: 12, color: '#666', marginTop: 2 },
  bookNowBtn: {
    backgroundColor: '#9d0399',
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  bookNowBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
