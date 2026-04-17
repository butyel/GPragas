import React from 'react'
import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { Home, Calendar, ClipboardList, User, MoreHorizontal } from 'lucide-react-native'
import { Colors } from '@/constants/Colors'

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, any> = {
    home: Home,
    calendar: Calendar,
    workorders: ClipboardList,
    profile: User,
    more: MoreHorizontal,
  }
  const Icon = icons[name]
  
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      <Icon size={22} color={focused ? Colors.primary : Colors.text_muted} />
    </View>
  )
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text_muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="workorders"
        options={{
          title: 'OSs',
          tabBarIcon: ({ focused }) => <TabIcon name="workorders" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabIcon: {
    padding: 4,
    borderRadius: 8,
  },
  tabIconFocused: {
    backgroundColor: Colors.primary_light + '20',
  },
})