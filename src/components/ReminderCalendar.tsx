import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Reminder } from "@/types/Reminder";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CalendarClock, 
  CalendarDays, 
  Check, 
  Plus, 
  Clock, 
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronDown,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const ReminderCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [reminderDates, setReminderDates] = useState<Date[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    message: '',
    description: '',
    send_date: '',
  });
  const [creatingReminder, setCreatingReminder] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchReminders = async () => {
      setLoadingReminders(true);
      try {
        const { data, error } = await supabase
          .from('reminders')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const formattedReminders = data as Reminder[];
        setReminders(formattedReminders);

        const dates = formattedReminders.map(reminder => new Date(reminder.date));
        setReminderDates(dates);
      } catch (error: any) {
        console.error('Error fetching reminders:', error.message);
        toast({
          title: "Error",
          description: "No se pudieron cargar los recordatorios",
          variant: "destructive",
        });
      } finally {
        setLoadingReminders(false);
      }
    };

    fetchReminders();
  }, [user, toast]);

  const getRemindersForSelectedDate = () => {
    if (!selectedDate) return [];
    return reminders.filter(reminder => 
      isSameDay(new Date(reminder.date), selectedDate)
    );
  };

  const handleCreateReminder = async () => {
    if (!user || !selectedDate) return;
    
    if (!newReminder.title.trim() || !newReminder.message.trim() || !newReminder.send_date) {
      toast({
        title: "Campos obligatorios",
        description: "Por favor complete los campos requeridos",
        variant: "destructive",
      });
      return;
    }
    
    setCreatingReminder(true);
    
    try {
      const sendDate = new Date(newReminder.send_date);
      
      let phoneNumber = '';
      
      if (userProfile?.remotejid) {
        phoneNumber = userProfile.remotejid;
      } else if (user?.user_metadata?.remotejid) {
        phoneNumber = user.user_metadata.remotejid;
      } else {
        toast({
          title: "Advertencia",
          description: "No tienes un número de teléfono configurado. El recordatorio se guardará pero no podrá enviarse.",
          variant: "warning",
        });
        phoneNumber = 'sin-telefono';
      }
      
      console.log('Número de teléfono usado para el recordatorio:', phoneNumber);
      
      const reminderData = {
        user_id: user.id,
        title: newReminder.title,
        message: newReminder.message,
        description: newReminder.description || null,
        date: selectedDate.toISOString(),
        send_date: sendDate.toISOString(),
        remotejid: phoneNumber,
        status: 'pending',
        origin: 'manual',
      };
      
      console.log('Datos del recordatorio a guardar:', reminderData);
      
      const { data, error } = await supabase
        .from('reminders')
        .insert(reminderData)
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newReminderData = data[0] as Reminder;
        setReminders([...reminders, newReminderData]);
        
        setReminderDates([...reminderDates, selectedDate]);
        
        toast({
          title: "Recordatorio creado",
          description: "Tu recordatorio ha sido programado exitosamente",
        });
        
        setNewReminder({
          title: '',
          message: '',
          description: '',
          send_date: '',
        });
        setIsCreateDialogOpen(false);
      }
    } catch (error: any) {
      console.error('Error creating reminder:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el recordatorio. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setCreatingReminder(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setPopoverOpen(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'sent': return 'Enviado';
      case 'failed': return 'Fallido';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };
  
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending': 
        return 'bg-yellow-500/20 text-yellow-300';
      case 'sent': 
        return 'bg-green-500/20 text-green-300';
      case 'failed': 
        return 'bg-red-500/20 text-red-300';
      case 'cancelled': 
        return 'bg-gray-500/20 text-gray-300';
      default: 
        return 'bg-blue-500/20 text-blue-300';
    }
  };

  return (
    <div className="bg-[#1a2a30] rounded-lg shadow-xl">
      <div className="p-6 border-b border-claudia-primary/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-claudia-primary" />
            <h2 className="text-2xl font-bold text-claudia-white">Calendario de Recordatorios</h2>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-claudia-primary hover:bg-claudia-primary/80 text-claudia-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Crear Recordatorio
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1 bg-[#142126] border-claudia-primary/10 shadow-lg">
            <CardContent className="p-4">
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-left font-normal bg-[#1a2a30] border-claudia-primary/20 text-claudia-white hover:bg-[#1a2a30]/80 hover:border-claudia-primary/30"
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-5 w-5 text-claudia-primary" />
                      {selectedDate ? format(selectedDate, "PPPP", { locale: es }) : "Seleccionar fecha"}
                    </div>
                    <ChevronDown className="h-4 w-4 text-claudia-primary/70" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#1a2a30] border-claudia-primary/20">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    locale={es}
                    className="bg-[#142126] rounded-md border border-claudia-primary/10 shadow-md"
                    modifiersClassNames={{
                      selected: 'bg-claudia-primary text-claudia-white',
                      today: 'bg-claudia-primary/10 text-claudia-white',
                    }}
                    modifiers={{
                      highlighted: (date) => reminderDates.some(reminderDate => 
                        isSameDay(reminderDate, date)
                      )
                    }}
                    modifiersStyles={{
                      highlighted: { 
                        border: '2px solid rgba(36, 210, 102, 0.5)',
                        borderRadius: '100%',
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-claudia-white mb-3 flex items-center">
                  Leyenda
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-[#24D266]"></div>
                    <span className="text-claudia-white/90">Día seleccionado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-[#24D266]/20"></div>
                    <span className="text-claudia-white/90">Hoy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-[#24D266]/50"></div>
                    <span className="text-claudia-white/90">Tiene recordatorios</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-[2] bg-[#142126] border-claudia-primary/10 shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold text-claudia-white mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarClock size={20} className="text-claudia-primary mr-2" />
                  {selectedDate ? 
                    format(selectedDate, "d 'de' MMMM, yyyy", { locale: es }) : 
                    "Selecciona una fecha para ver recordatorios"}
                </div>
                
                {selectedDate && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-claudia-primary hover:text-claudia-white hover:bg-claudia-primary/20"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Nuevo
                  </Button>
                )}
              </h3>

              {loadingReminders ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-claudia-primary border-r-claudia-primary/70 border-b-claudia-primary/40 border-l-claudia-primary/20"></div>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  {getRemindersForSelectedDate().length > 0 ? (
                    getRemindersForSelectedDate().map((reminder) => (
                      <div 
                        key={reminder.id} 
                        className="p-4 bg-[#1a2a30] rounded-md border-l-4 border-claudia-primary border-y border-r hover:bg-[#1a2a30]/80 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg text-claudia-white">{reminder.title}</h4>
                            <p className="text-claudia-white/90 mt-1">{reminder.message}</p>
                            {reminder.description && (
                              <p className="text-claudia-white/70 mt-2 text-sm">{reminder.description}</p>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyles(reminder.status)}`}>
                            {getStatusText(reminder.status)}
                          </span>
                        </div>
                        <div className="mt-3 text-sm text-claudia-white/60 flex items-center gap-2">
                          <Clock size={14} className="text-claudia-primary" />
                          <span>Envío: {format(new Date(reminder.send_date), "d MMM yyyy, HH:mm", { locale: es })}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-14 px-4 border-2 border-dashed border-claudia-primary/20 rounded-lg">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-claudia-primary/10 rounded-full">
                          <CalendarClock size={32} className="text-claudia-primary" />
                        </div>
                        <h4 className="text-xl font-medium text-claudia-white">No hay recordatorios</h4>
                        <p className="text-claudia-white/60 max-w-xs">No hay recordatorios programados para esta fecha. ¿Quieres crear uno?</p>
                        <Button 
                          variant="outline" 
                          className="mt-2 border-claudia-primary text-claudia-primary hover:bg-claudia-primary/10"
                          onClick={() => setIsCreateDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Crear Recordatorio
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-[#1a2a30] text-claudia-white border-claudia-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-claudia-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-claudia-primary" />
              Crear Nuevo Recordatorio
            </DialogTitle>
            <DialogDescription className="text-claudia-white/70">
              Programa un recordatorio para {selectedDate ? format(selectedDate, "d 'de' MMMM, yyyy", { locale: es }) : "la fecha seleccionada"}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="p-3 bg-[#142126]/70 rounded-md flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-claudia-primary" />
              <span className="text-claudia-white/80">
                Número de teléfono: {userProfile?.remotejid || user?.user_metadata?.remotejid || 'No disponible'}
              </span>
              {!userProfile?.remotejid && !user?.user_metadata?.remotejid && (
                <div className="ml-auto px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                  ¡Importante!
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-claudia-white">Título</Label>
              <Input 
                id="title" 
                placeholder="Título del recordatorio" 
                className="bg-[#142126] border-claudia-primary/20 text-claudia-white"
                value={newReminder.title}
                onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-claudia-white">Mensaje</Label>
              <Textarea 
                id="message" 
                placeholder="Contenido del recordatorio" 
                className="bg-[#142126] border-claudia-primary/20 text-claudia-white"
                value={newReminder.message}
                onChange={(e) => setNewReminder({...newReminder, message: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-claudia-white">Descripción (opcional)</Label>
              <Textarea 
                id="description" 
                placeholder="Detalles adicionales" 
                className="bg-[#142126] border-claudia-primary/20 text-claudia-white"
                value={newReminder.description}
                onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="send_date" className="text-claudia-white flex items-center gap-1">
                <Clock className="h-4 w-4 text-claudia-primary" />
                Fecha y hora de envío
              </Label>
              <Input 
                id="send_date" 
                type="datetime-local" 
                className="bg-[#142126] border-claudia-primary/20 text-claudia-white"
                value={newReminder.send_date}
                onChange={(e) => setNewReminder({...newReminder, send_date: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
              className="border-claudia-primary/20 text-claudia-white hover:bg-[#142126]"
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleCreateReminder}
              className="bg-claudia-primary text-claudia-white hover:bg-claudia-primary/80"
              disabled={creatingReminder}
            >
              {creatingReminder ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-claudia-white border-t-transparent rounded-full" />
                  Creando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Crear Recordatorio
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReminderCalendar;
