import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter

export default function Content() {
  const router = useRouter(); // Initialize router inside the component

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Santa Maria Pottery</Text>
        <Text style={styles.subText}>Buy now </Text>

        <View style={styles.grid}>
          {/* Item 1 */}
          <View style={styles.card}>
            <Image
              source={{ uri: 'https://i.pinimg.com/236x/bd/2f/91/bd2f91891f7f4cb44da0473401273fd7.jpg' }}
              style={styles.image}
            />
            <Text style={styles.itemTitle}>BANGA</Text>
            <Text style={styles.subText}>Kainang ng Aso</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₱ 125</Text>
              <TouchableOpacity 
                onPress={() => router.push('auth/products')} // Use router to navigate
                style={styles.buttonSmall}>
                <Text style={styles.buttonSmallText}>View</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>★★★★★</Text>
              <Text style={styles.subText}>(10)</Text>
            </View>
          </View>

          {/* Item 2 */}
          <View style={styles.card}>
            <Image
              source={{ uri: 'https://placehold.co/300x400' }}
              style={styles.image}
            />
            <Text style={styles.itemTitle}>BANGA</Text>
            <Text style={styles.subText}>Kainang ng Aso</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₱ 195</Text>
              <TouchableOpacity 
                onPress={() => router.push('auth/')}
                style={styles.buttonSmall}>
                <Text style={styles.buttonSmallText}>View</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>★★★★★</Text>
              <Text style={styles.subText}>(10)</Text>
            </View>
          </View>

          {/* Item 3 */}
          <View style={styles.card}>
            <Image
              source={{ uri: 'https://placehold.co/300x400' }}
              style={styles.image}
            />
            <Text style={styles.itemTitle}>BANGA</Text>
            <Text style={styles.subText}>Kainang ng Aso</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₱ 145</Text>
              <TouchableOpacity 
                onPress={() => router.push('auth/')}
                style={styles.buttonSmall}>
                <Text style={styles.buttonSmallText}>View</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>★★★★★</Text>
              <Text style={styles.subText}>(2)</Text>
            </View>
          </View>

          {/* Item 4 */}
          <View style={styles.card}>
            <Image
              source={{ uri: 'https://placehold.co/300x400' }}
              style={styles.image}
            />
            <Text style={styles.itemTitle}>BANGA</Text>
            <Text style={styles.subText}>Kainang ng Aso</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₱ 180</Text>
              <TouchableOpacity 
                onPress={() => router.push('auth/products')}
                style={styles.buttonSmall}>
                <Text style={styles.buttonSmallText}>View</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>★★★★☆</Text>
              <Text style={styles.subText}>(5)</Text>
            </View>
          </View>

          {/* Item 5 */}
          <View style={styles.card}>
            <Image
              source={{ uri: 'https://placehold.co/300x400' }}
              style={styles.image}
            />
            <Text style={styles.itemTitle}>BANGA</Text>
            <Text style={styles.subText}>Kainang ng Aso</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₱ 200</Text>
              <TouchableOpacity 
                onPress={() => router.push('auth/')}
                style={styles.buttonSmall}>
                <Text style={styles.buttonSmallText}>View</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>★★★☆☆</Text>
              <Text style={styles.subText}>(7)</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#171717', // Primary color
  },
  section: {
    marginTop: 80,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: '600',
    color: '#069906', // Secondary color
  },
  subText: {
    color: '#71717a', // Muted foreground
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  card: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#069906', // Border color
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#ffffff', // Card background color
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  itemTitle: {
    marginTop: 8,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    color: '#fbbf24',
    marginRight: 4,
  },
  buttonSmall: {
    backgroundColor: '#069906',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  buttonSmallText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
