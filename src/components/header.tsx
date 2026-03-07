import AstroLogo from '@/assets/images/astro-icon.svg';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Header() {
  return (
    <View>
      <StatusBar barStyle="dark-content" backgroundColor="#fff1ff" />
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <AstroLogo width={160} height={40} />
        </View>
        <TouchableOpacity style={styles.searchBtn}>
          <Feather name="search" size={30} color="#9d0399" />
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={['rgba(255,255,255,0.4)', '#00000050', 'rgba(255,255,255,0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 2,
          width: '100%',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
