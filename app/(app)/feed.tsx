import Header from '@/src/components/header';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import { useAuthStore } from '@/src/features/auth/store/authstore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Dummy Data ──────────────────────────────────────────────
const STORIES = [
  { id: '1', name: 'Suprio', emoji: '🔮', color: '#7C3AED' },
  { id: '2', name: 'Ananya', emoji: '⭐', color: '#9D174D' },
  { id: '3', name: 'Rohit', emoji: '🌙', color: '#1E40AF' },
  { id: '4', name: 'Priya', emoji: '☀️', color: '#065F46' },
  { id: '5', name: 'Vikash', emoji: '🪐', color: '#92400E' },
  { id: '6', name: 'Meera', emoji: '✨', color: '#6B21A8' },
];

const POSTS = [
  {
    id: '1',
    author: 'Suprio Karmakar',
    role: 'Vedic',
    time: '2h ago',
    content:
      'দুর্গতি নাশিনী\nইয়া দেবী সর্বভূতেষু, শক্তি রূপেণ সংস্থিতা!\nনমস্তে নমস্তে নমস্তে নমো নমঃ ॥',
    footer: 'মহালয়া শুভেচ্ছা',
    bgColor: '#6B21A8',
    emoji: '🙏',
    likes: 248,
    comments: 42,
    shares: 18,
    liked: false,
  },
  {
    id: '2',
    author: 'Ananya Sharma',
    role: 'Tarot Expert',
    time: '4h ago',
    content:
      'Mercury Retrograde ends today! Time to move forward with clarity and renewed purpose. ✨',
    footer: 'Cosmic Update',
    bgColor: '#1E3A5F',
    emoji: '🌟',
    likes: 156,
    comments: 28,
    shares: 12,
    liked: false,
  },
  {
    id: '3',
    author: 'Rohit Astro',
    role: 'Numerology',
    time: '6h ago',
    content:
      'आज का राशिफल 🪐\nमेष राशि के जातकों के लिए आज का दिन विशेष शुभ है। नए कार्यों की शुरुआत के लिए उत्तम समय।',
    footer: 'Daily Horoscope',
    bgColor: '#164E63',
    emoji: '♈',
    likes: 312,
    comments: 67,
    shares: 45,
    liked: false,
  },
];

// ── Component ───────────────────────────────────────────────
export default function FeedScreen() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState(POSTS);
  const { logout } = useAuth();

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p,
      ),
    );
  };

  return (
    <View style={styles.root}>
      <Header />
      <TouchableOpacity onPress={() => logout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* ── Stories Row ── */}
        <FlatList
          data={STORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContainer}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.storyItem} activeOpacity={0.8}>
              <View style={[styles.storyRing, { borderColor: item.color }]}>
                <View style={[styles.storyAvatar, { backgroundColor: item.color }]}>
                  <Text style={styles.storyEmoji}>{item.emoji}</Text>
                </View>
              </View>
              <Text style={styles.storyName} numberOfLines={1}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* ── Posts ── */}
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Post Header */}
            <LinearGradient
              colors={['rgba(255,255,255,0.4)', '#00000050', 'rgba(255,255,255,0.4)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 2,
                width: '100%',
              }}
            />
            <View style={styles.postHeader}>
              <View style={styles.postAuthorRow}>
                <View style={[styles.postAvatar, { backgroundColor: post.bgColor }]}>
                  <Text style={styles.postAvatarEmoji}>{post.emoji}</Text>
                </View>
                <View style={styles.postAuthorInfo}>
                  <Text style={styles.postAuthorName}>{post.author}</Text>
                  <Text style={styles.postRole}>{post.role}</Text>
                </View>
              </View>
              <View style={styles.postHeaderRight}>
                <TouchableOpacity style={styles.followBtn}>
                  <Text style={styles.followBtnText}>Follow +</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={35}
                    color="black"
                    style={{ marginTop: 5 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Post Image/Content */}
            <View style={[styles.postImageArea, { backgroundColor: post.bgColor }]}>
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postFooterRow}>
                <View style={styles.postLogoSmall}>
                  <Text style={styles.postLogoAstro}>Astro</Text>
                  <View style={styles.postLogoBadge}>
                    <Text style={styles.postLogoBook}>Book</Text>
                  </View>
                </View>
                <Text style={styles.postFooterText}>{post.footer}</Text>
              </View>
            </View>
            <View style={styles.postBottom}>
              {/* Post Text */}
              <Text style={styles.postText}>
                মােয়র আগমেন েহাক সকল বাধার অবসান...
                <Text style={styles.moreText}> more</Text>
              </Text>

              {/* Row: Actions + Book Now */}
              <View style={styles.actionsRow}>
                <View style={styles.leftActions}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.icon}>👍</Text>
                    <Text style={styles.count}>121</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.icon}>💬</Text>
                    <Text style={styles.count}>22</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.icon}>↗</Text>
                    <Text style={styles.count}>3</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.bookBtn}>
                  <Text style={styles.bookText}>Book Now</Text>
                </TouchableOpacity>
              </View>

              {/* Date */}
              <Text style={styles.dateText}>01 Nov, 2025</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffffff' },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: '#fff1ff',
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
  searchBtn: {
    borderRadius: 19,
    backgroundColor: '#f5f0ff04',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: { fontSize: 18 },

  scroll: { flex: 1 },

  // Stories
  storiesContainer: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    gap: 40,
    backgroundColor: '#FFF',
  },
  storyItem: { alignItems: 'center', width: 64 },
  storyRing: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 2.5,
    padding: 2,
    marginBottom: 5,
  },
  storyAvatar: {
    flex: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyEmoji: { fontSize: 24 },
  storyName: { fontSize: 11, color: '#444', textAlign: 'center', width: 60 },

  // Post Card
  postCard: {
    backgroundColor: '#FFF',
    marginTop: 0,
    marginHorizontal: 0,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  postAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  postAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  postAvatarEmoji: { fontSize: 20 },
  postAuthorInfo: {},
  postAuthorName: { fontSize: 16, fontWeight: '700', color: '#0b1d5b' },
  postRole: { fontSize: 12, color: '#0b1d5b' },
  postHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  followBtn: {},
  followBtnText: { color: '#9d0399', fontSize: 12, fontWeight: '600' },

  // Post Image Area
  postImageArea: {
    width: SCREEN_WIDTH,
    minHeight: 380,
    padding: 24,
    justifyContent: 'space-between',
  },
  postContent: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    marginTop: 16,
  },
  postFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  postLogoSmall: { flexDirection: 'row', alignItems: 'center' },
  postLogoAstro: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  postLogoBadge: {
    backgroundColor: '#FFFFFF30',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 2,
  },
  postLogoBook: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  postFooterText: { color: '#FFFFFFCC', fontSize: 13 },
  postBottom: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  postText: {
    fontSize: 14,
    color: '#222',
    marginBottom: 6,
  },

  moreText: {
    color: '#8B8BA5',
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },

  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  icon: {
    fontSize: 16,
    color: '#9d0399',
  },

  count: {
    fontSize: 13,
    color: '#9d0399',
  },

  bookBtn: {
    backgroundColor: '#9d0399',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },

  bookText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  dateText: {
    fontSize: 12,
    color: '#8B8BA5',
    marginTop: 6,
  },
});
