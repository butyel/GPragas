import React from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import { router } from 'expo-router'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Bug
} from 'lucide-react-native'
import { Colors } from '@/constants/Colors'

interface WorkOrder {
  id: string
  client: string
  address: string
  service: string
  time: string
  status: 'scheduled' | 'in_progress' | 'completed'
}

const mockWorkOrders: WorkOrder[] = [
  {
    id: 'OS-001',
    client: 'Restaurante Sabor Caseiro',
    address: 'Rua das Flores, 123',
    service: 'Desinsetização',
    time: '14:00',
    status: 'scheduled',
  },
  {
    id: 'OS-002',
    client: 'Empresa ABC Ltda',
    address: 'Av. Paulista, 1000',
    service: 'Desratização',
    time: '09:00',
    status: 'completed',
  },
  {
    id: 'OS-003',
    client: 'Casa da Família Silva',
    address: 'Rua dos Pinheiros, 456',
    service: 'Dedetização Completa',
    time: '10:00',
    status: 'in_progress',
  },
]

const getStatusConfig = (status: string) => {
  const configs: Record<string, { color: string; bg: string; label: string; icon: any }> = {
    scheduled: { 
      color: Colors.blue, 
      bg: Colors.blue + '20', 
      label: 'Agendada',
      icon: Calendar 
    },
    in_progress: { 
      color: Colors.purple, 
      bg: Colors.purple + '20', 
      label: 'Em execução',
      icon: PlayCircle
    },
    completed: { 
      color: Colors.green, 
      bg: Colors.green + '20', 
      label: 'Concluída',
      icon: CheckCircle2
    },
  }
  return configs[status] || configs.scheduled
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const todayOrders = mockWorkOrders.filter(o => o.status !== 'completed')
  const completedOrders = mockWorkOrders.filter(o => o.status === 'completed')

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, João!</Text>
          <Text style={styles.date}>Quinta-feira, 16 de Abril</Text>
        </View>
        <View style={styles.logoContainer}>
          <Bug size={28} color={Colors.primary} />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{todayOrders.length}</Text>
          <Text style={styles.statLabel}>Serviços Hoje</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedOrders.length}</Text>
          <Text style={styles.statLabel}>Concluídos</Text>
        </View>
      </View>

      {/* Today's Schedule */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Agenda de Hoje</Text>
          <TouchableOpacity onPress={() => router.push('/schedule')}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleCard}>
          <View style={styles.scheduleTime}>
            <Text style={styles.scheduleTimeText}>08:00</Text>
            <View style={styles.scheduleLine} />
            <Text style={styles.scheduleTimeText}>18:00</Text>
          </View>
          <View style={styles.scheduleList}>
            {todayOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status)
              return (
                <TouchableOpacity
                  key={order.id}
                  style={styles.scheduleItem}
                  onPress={() => router.push(`/workorders/${order.id}`)}
                >
                  <View style={styles.scheduleDot} />
                  <View style={styles.scheduleContent}>
                    <View style={styles.scheduleHeader}>
                      <Text style={styles.scheduleClient}>{order.client}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                        <statusConfig.icon size={12} color={statusConfig.color} />
                        <Text style={[styles.statusText, { color: statusConfig.color }]}>
                          {statusConfig.label}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.scheduleService}>{order.service}</Text>
                    <View style={styles.scheduleMeta}>
                      <View style={styles.scheduleMetaItem}>
                        <Clock size={12} color={Colors.text_muted} />
                        <Text style={styles.scheduleMetaText}>{order.time}</Text>
                      </View>
                      <View style={styles.scheduleMetaItem}>
                        <MapPin size={12} color={Colors.text_muted} />
                        <Text style={styles.scheduleMetaText}>{order.address}</Text>
                      </View>
                    </View>
                  </View>
                  <ChevronRight size={20} color={Colors.text_muted} />
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/workorders/new')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.blue + '20' }]}>
              <Calendar size={24} color={Colors.blue} />
            </View>
            <Text style={styles.actionText}>Nova OS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/products')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.green + '20' }]}>
              <AlertCircle size={24} color={Colors.green} />
            </View>
            <Text style={styles.actionText}>Produtos</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Completed Today */}
      {completedOrders.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Concluídos Hoje</Text>
          {completedOrders.map((order) => (
            <View key={order.id} style={styles.completedCard}>
              <CheckCircle2 size={20} color={Colors.green} />
              <View style={styles.completedContent}>
                <Text style={styles.completedClient}>{order.client}</Text>
                <Text style={styles.completedService}>{order.service}</Text>
              </View>
              <Text style={styles.completedTime}>{order.time}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface_background,
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text_primary,
  },
  date: {
    fontSize: 14,
    color: Colors.text_secondary,
    marginTop: 4,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary_light + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text_secondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text_primary,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
  },
  scheduleCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
  },
  scheduleTime: {
    width: 40,
    alignItems: 'center',
    paddingRight: 12,
  },
  scheduleTimeText: {
    fontSize: 10,
    color: Colors.text_muted,
  },
  scheduleLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  scheduleList: {
    flex: 1,
    gap: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleClient: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text_primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  scheduleService: {
    fontSize: 12,
    color: Colors.text_secondary,
    marginTop: 2,
  },
  scheduleMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  scheduleMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleMetaText: {
    fontSize: 11,
    color: Colors.text_muted,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: Colors.text_secondary,
  },
  completedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 8,
  },
  completedContent: {
    flex: 1,
  },
  completedClient: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text_primary,
  },
  completedService: {
    fontSize: 12,
    color: Colors.text_secondary,
  },
  completedTime: {
    fontSize: 12,
    color: Colors.text_muted,
  },
})