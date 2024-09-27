import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter

export default function Content() {
  const router = useRouter(); // Initialize router inside the component

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        {/* Removed the section header here */}
        {/* Removed the subText header here */}

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
    backgroundColor: '#f9fafb', // Light background color for better contrast
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#171717', // Primary color
  },
  section: {
    marginTop: 40,
  },
  sectionHeader: {
    fontSize: 28,
    fontWeight: '700', // Bolder header for emphasis
    color: '#069906', // Secondary color
    top: 50,
  },
  subText: {
    color: '#52525b', // Slightly darker muted color for subtext
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    top:20,
    
  },
  card: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#e2e8f0', // Softer border color for a clean look
    borderRadius: 12, // Rounded corners for modern look
    padding: 16,
    backgroundColor: '#ffffff', // Card background color
    marginBottom: 16,
    shadowColor: '#000', // Add subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // For Android shadow
    
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12, // Add space below the image
  },
  itemTitle: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 16, // Larger item title
    color: '#1f2937', // Darker text color for better readability
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
    color: '#059669', // Eye-catching price color
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    color: '#fbbf24',
    marginRight: 4,
    fontSize: 16,
  },
  buttonSmall: {
    backgroundColor: '#069906',
    paddingVertical: 6, // Adjusted padding for button
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonSmallText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14, // Slightly larger font for buttons
  },
});
