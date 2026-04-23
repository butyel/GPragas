"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  GripVertical,
  Loader2,
} from "lucide-react"
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getWorkOrders, getTechnicians } from "@/lib/data"

const MOCK_COMPANY_ID = "demo-company"

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8 // Start at 8 AM
  return `${hour.toString().padStart(2, "0")}:00`
})

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTechnician, setSelectedTechnician] = useState("all")
  const [view, setView] = useState<"day" | "week" | "month">("week")
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scheduleItems, setScheduleItems] = useState<any[]>([])
  const [techniciansList, setTechniciansList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [ordersData, techniciansData] = await Promise.all([
          getWorkOrders(MOCK_COMPANY_ID),
          getTechnicians(MOCK_COMPANY_ID)
        ])
        setScheduleItems(ordersData || [])
        setTechniciansList([{ id: "all", name: "Todos os Técnicos" }, ...(techniciansData || [])])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setTechniciansList([{ id: "all", name: "Todos os Técnicos" }])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const handlePrev = () => {
    if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      setCurrentDate(addDays(currentDate, -1))
    }
  }

  const handleNext = () => {
    if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(addDays(currentDate, 1))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const getEventsForDay = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd")
    return scheduleItems.filter((item) => item.scheduled_date === dateStr)
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const getEventColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-blue-500",
      in_transit: "bg-yellow-500",
      in_progress: "bg-purple-500",
      completed: "bg-green-500",
      pending_report: "bg-orange-500",
      cancelled: "bg-red-500",
    }
    return colors[status] || "bg-blue-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-muted-foreground">Gerencie o cronograma de serviços</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Controls */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleToday}>
                Hoje
              </Button>
              <Button variant="outline" size="icon" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium ml-4">
                {format(currentDate, "MMMM yyyy", { locale: ptBR })}
              </span>
            </div>

              <div className="flex items-center gap-4">
              <Select
                options={techniciansList.map((t: any) => ({ value: t.id, label: t.name }))}
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
                className="w-48"
              />
              <div className="flex border rounded-md">
                <Button
                  variant={view === "day" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("day")}
                >
                  Dia
                </Button>
                <Button
                  variant={view === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("week")}
                >
                  Semana
                </Button>
                <Button
                  variant={view === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("month")}
                >
                  Mês
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground w-16">
                      Horário
                    </th>
                    {weekDays.map((day) => (
                      <th
                        key={day.toISOString()}
                        className={`p-4 text-center border-l ${
                          isSameDay(day, new Date())
                            ? "bg-primary-50"
                            : ""
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {format(day, "EEE", { locale: ptBR })}
                        </div>
                        <div
                          className={`text-lg ${
                            isSameDay(day, new Date())
                              ? "text-primary font-bold"
                              : ""
                          }`}
                        >
                          {format(day, "d")}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time) => (
                    <tr key={time} className="border-b hover:bg-surface-elevated">
                      <td className="p-2 text-sm text-muted-foreground align-top">
                        {time}
                      </td>
                      {weekDays.map((day) => {
                        const dayEvents = getEventsForDay(day).filter(
                          (e) => e.scheduled_time?.substring(0, 5) === time
                        )
                        return (
                          <td
                            key={day.toISOString() + time}
                            className={`p-2 border-l align-top min-h-[80px] ${
                              isSameDay(day, new Date()) ? "bg-primary-50/50" : ""
                            }`}
                          >
                            <div className="space-y-1">
                              {dayEvents.map((event) => (
                                <div
                                  key={event.id}
                                  className={`${getEventColor(event.status)} text-white text-xs p-2 rounded cursor-pointer hover:opacity-90 transition-opacity`}
                                  onClick={() => handleEventClick(event)}
                                >
                                  <div className="font-medium truncate">
                                    {event.client?.name || "Cliente"}
                                  </div>
                                  <div className="opacity-90 truncate">
                                    {event.service_type?.name || "Serviço"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
            <DialogDescription>
              OS {selectedEvent?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Cliente
                  </label>
                  <p className="font-medium">{selectedEvent.client?.name || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Serviço
                  </label>
                  <p className="font-medium">{selectedEvent.service_type?.name || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Técnico
                  </label>
                  <div className="flex items-center mt-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    {selectedEvent.technician?.name || "Não atribuído"}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Horário
                  </label>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    {selectedEvent.scheduled_time || "—"}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1">
                  <Badge
                    variant={
                      selectedEvent.status === "completed"
                        ? "success"
                        : selectedEvent.status === "scheduled"
                        ? "info"
                        : "warning"
                    }
                  >
                    {selectedEvent.status === "scheduled" && "Agendada"}
                    {selectedEvent.status === "in_transit" && "Em deslocamento"}
                    {selectedEvent.status === "in_progress" && "Em execução"}
                    {selectedEvent.status === "completed" && "Concluída"}
                    {selectedEvent.status === "pending_report" && "Aguardando laudo"}
                    {selectedEvent.status === "cancelled" && "Cancelada"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            <Button>Editar OS</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}