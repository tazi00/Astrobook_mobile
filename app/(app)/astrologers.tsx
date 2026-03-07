import Header from '@/src/components/header';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FILTERS = [
  { id: 'all', label: '✨ All' },
  { id: 'love', label: '❤️ Love' },
  { id: 'marriage', label: '💍 Marriage' },
  { id: 'health', label: '🌿 Health' },
  { id: 'finance', label: '💰 Finance' },
  { id: 'career', label: '🚀 Career' },
  { id: 'remedies', label: '🔮 Remedies' },
  { id: 'education', label: '📚 Education' },
];

const ASTROLOGERS = [
  {
    id: '1',
    name: 'Suprio Karmakar',
    speciality: 'Vedic',
    languages: 'Bengali, English, Hindi',
    exp: '15 Years',
    rating: 4.5,
    reviews: 1021,
    price: 199,
    emoji: '🔮',
    color: '#6B21A8',
    tags: ['love', 'marriage', 'remedies'],
    online: true,
  },
  {
    id: '2',
    name: 'Ananya Sharma',
    speciality: 'Tarot Expert',
    languages: 'Hindi, English',
    exp: '8 Years',
    rating: 4.8,
    reviews: 856,
    price: 299,
    emoji: '🃏',
    color: '#9D174D',
    tags: ['love', 'career', 'finance'],
    online: true,
  },
  {
    id: '3',
    name: 'Rohit Mishra',
    speciality: 'Numerology',
    languages: 'Hindi, Marathi',
    exp: '12 Years',
    rating: 4.3,
    reviews: 643,
    price: 149,
    emoji: '🔢',
    color: '#1E40AF',
    tags: ['finance', 'career', 'education'],
    online: false,
  },
  {
    id: '4',
    name: 'Priya Devi',
    speciality: 'Palmistry',
    languages: 'Tamil, English',
    exp: '10 Years',
    rating: 4.7,
    reviews: 422,
    price: 249,
    emoji: '✋',
    color: '#065F46',
    tags: ['health', 'marriage', 'remedies'],
    online: true,
  },
  {
    id: '5',
    name: 'Vikash Joshi',
    speciality: 'Vastu',
    languages: 'Hindi, Gujarati',
    exp: '20 Years',
    rating: 4.9,
    reviews: 1532,
    price: 399,
    emoji: '🏠',
    color: '#92400E',
    tags: ['finance', 'health', 'remedies'],
    online: false,
  },
  {
    id: '6',
    name: 'Meera Nair',
    speciality: 'KP Astrology',
    languages: 'Malayalam, English',
    exp: '6 Years',
    rating: 4.4,
    reviews: 289,
    price: 179,
    emoji: '⭐',
    color: '#6B21A8',
    tags: ['love', 'education', 'career'],
    online: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: 11, color: i <= Math.floor(rating) ? '#F59E0B' : '#DDD' }}>
          ★
        </Text>
      ))}
      <Text style={{ fontSize: 11, color: '#666', marginLeft: 3 }}>{rating}</Text>
    </View>
  );
}

export default function AstrologersScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = ASTROLOGERS.filter((a) => {
    const matchFilter = activeFilter === 'all' || a.tags.includes(activeFilter);
    const matchSearch =
      search === '' ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.speciality.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <View style={styles.root}>
      {/* Top Bar */}
      <Header />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchBarIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search astrologers..."
          placeholderTextColor="#AAA"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: '#9d0399', fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.chip, activeFilter === f.id && styles.chipActive]}
            onPress={() => setActiveFilter(f.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, activeFilter === f.id && styles.chipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Count */}
      <Text style={styles.countText}>{filtered.length} Astrologers found</Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: item.color }]}>
              <Text style={styles.avatarEmoji}>{item.emoji}</Text>
              {/* Online dot */}
              <View
                style={[styles.onlineDot, { backgroundColor: item.online ? '#22C55E' : '#9CA3AF' }]}
              />
            </View>

            {/* Info */}
            <View style={styles.cardInfo}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {item.name}
                </Text>
                <TouchableOpacity style={styles.followBtn}>
                  <Text style={styles.followBtnText}>Follow +</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.cardSpeciality}>{item.speciality}</Text>
              <Text style={styles.cardMeta}>{item.languages}</Text>
              <Text style={styles.cardMeta}>Exp: {item.exp}</Text>

              <View style={styles.cardBottomRow}>
                <View>
                  <StarRating rating={item.rating} />
                  <Text style={styles.reviewCount}>{item.reviews} reviews</Text>
                </View>

                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() =>
                    router.push({ pathname: '/(app)/astrologer-profile', params: { id: item.id } })
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.bookBtnPrice}>₹{item.price}</Text>
                  <Text style={styles.bookBtnText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F0FF' },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FF',
    elevation: 2,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoAstro: { fontSize: 22, fontWeight: '800', color: '#1A1A2E' },
  logoBookBadge: {
    backgroundColor: '#9d0399',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 1,
    marginLeft: 2,
  },
  logoBook: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  searchIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#EDE9FF',
    gap: 10,
  },
  searchBarIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A2E' },

  // Filters
  filtersRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#EDE9FF',
  },
  chipActive: {
    backgroundColor: '#9d0399',
    borderColor: '#9d0399',
  },
  chipText: { fontSize: 13, color: '#666', fontWeight: '500' },
  chipTextActive: { color: '#FFF', fontWeight: '700' },

  // Count
  countText: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  // List
  listContent: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: '#EDE9FF',
    elevation: 2,
  },

  // Avatar
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarEmoji: { fontSize: 32 },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
  },

  // Card Info
  cardInfo: { flex: 1 },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardName: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', flex: 1 },
  followBtn: {
    borderWidth: 1,
    borderColor: '#9d0399',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  followBtnText: { color: '#9d0399', fontSize: 11, fontWeight: '600' },
  cardSpeciality: { fontSize: 13, color: '#9d0399', fontWeight: '600', marginBottom: 2 },
  cardMeta: { fontSize: 12, color: '#888', marginBottom: 1 },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  reviewCount: { fontSize: 11, color: '#AAA', marginTop: 2 },
  bookBtn: {
    backgroundColor: '#9d0399',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  bookBtnPrice: { color: '#FFD700', fontSize: 11, fontWeight: '700' },
  bookBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});
