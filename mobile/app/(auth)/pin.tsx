import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import { router } from 'expo-router'
import { Bug, ChevronLeft, Lock } from 'lucide-react-native'
import { Colors } from '@/constants/Colors'

const PIN_LENGTH = 4

export default function PinScreen() {
  const [pin, setPin] = useState('')

  const handleNumberPress = (num: string) => {
    if (pin.length < PIN_LENGTH) {
      const newPin = pin + num
      setPin(newPin)
      
      if (newPin.length === PIN_LENGTH) {
        // Verify PIN
        if (newPin === '1234') { // Demo PIN
          router.replace('/(app)/(tabs)')
        } else {
          Alert.alert('Erro', 'PIN incorreto. Tente novamente.')
          setPin('')
        }
      }
    }
  }

  const handleDelete = () => {
    setPin(pin.slice(0, -1))
  }

  const renderPinDots = () => {
    const dots = []
    for (let i = 0; i < PIN_LENGTH; i++) {
      dots.push(
        <View
          key={i}
          style={[styles.pinDot, i < pin && styles.pinDotFilled]}
        />
      )
    }
    return dots
  }

  const renderNumberPad = () => {
    const rows = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'del'],
    ]

    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.padRow}>
        {row.map((item, index) => {
          if (item === '') {
            return <View key={index} style={styles.padButton} />
          }
          
          if (item === 'del') {
            return (
              <TouchableOpacity
                key={index}
                style={styles.padButton}
                onPress={handleDelete}
              >
                <Text style={styles.padText}>⌫</Text>
              </TouchableOpacity>
            )
          }

          return (
            <TouchableOpacity
              key={index}
              style={styles.padButton}
              onPress={() => handleNumberPress(item)}
            >
              <Text style={styles.padText}>{item}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    ))
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ChevronLeft size={24} color={Colors.text_primary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Lock size={40} color={Colors.primary} />
        </View>
        
        <Text style={styles.title}>Digite seu PIN</Text>
        <Text style={styles.subtitle}>
          Use seu PIN de 4 dígitos para acessar o app
        </Text>

        <View style={styles.pinContainer}>
          {renderPinDots()}
        </View>

        <View style={styles.padContainer}>
          {renderNumberPad()}
        </View>

        <TouchableOpacity
          style={styles.emailLoginButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.emailLoginText}>Entrar com email</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface_background,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary_light + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text_primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text_secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  pinDotFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  padContainer: {
    width: '100%',
    maxWidth: 280,
  },
  padRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  padButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface_elevated,
  },
  padText: {
    fontSize: 28,
    fontWeight: '500',
    color: Colors.text_primary,
  },
  emailLoginButton: {
    marginTop: 24,
  },
  emailLoginText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
})