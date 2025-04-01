
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
import { CalendarClock, CalendarDays, Check, Plus, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ReminderCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [reminderDates, setReminderDates] = useState<Date[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    message: '',
    description: '',
    send_date: '',
  });
  const [creatingReminder, setCreatingReminder] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch reminders from Supabase
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

        // Extract unique dates for highlighting in calendar
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

  // Get reminders for the selected date
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
      
      const reminderData = {
        user_id: user.id,
        title: newReminder.title,
        message: newReminder.message,
        description: newReminder.description || null,
        date: selectedDate.toISOString(),
        send_date: sendDate.toISOString(),
        remotejid: user.email || '', // Use email as fallback
        status: 'pending',
        origin: 'manual',
      };
      
      const { data, error } = await supabase
        .from('reminders')
        .insert(reminderData)
        .select();
        
      if (error) throw error;
      
      // Add the new reminder to state
      if (data && data.length > 0) {
        const newReminderData = data[0] as Reminder;
        setReminders([...reminders, newReminderData]);
        
        // Update calendar highlighted dates
        setReminderDates([...reminderDates, selectedDate]);
        
        toast({
          title: "Recordatorio creado",
          description: "Tu recordatorio ha sido programado exitosamente",
        });
        
        // Reset form and close dialog
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

  return (
    <div className="bg-[#1a2a30] rounded-lg shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-claudia-primary" />
          <h2 className="text-xl font-bold text-claudia-white">Calendario de Recordatorios</h2>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-claudia-primary hover:bg-claudia-primary/80 text-claudia-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Crear Recordatorio
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-[#142126] rounded-lg p-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-transparent border-claudia-primary/20 text-claudia-white"
              >
                <CalendarClock className="mr-2 h-4 w-4 text-claudia-primary" />
                {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#1a2a30] border-claudia-primary/20">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={es}
                className="pointer-events-auto p-3"
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
                    backgroundColor: 'rgba(var(--claudia-primary), 0.4)',
                    borderRadius: '100%',
                    color: 'var(--claudia-white)'
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-[2] bg-[#142126] rounded-lg p-4">
          <h3 className="text-lg font-medium text-claudia-white mb-3 flex items-center">
            {selectedDate ? 
              `Recordatorios para ${format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}` : 
              "Selecciona una fecha para ver recordatorios"}
            
            {selectedDate && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 text-claudia-primary hover:text-claudia-white hover:bg-claudia-primary/20"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </h3>

          {loadingReminders ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-claudia-primary"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {getRemindersForSelectedDate().length > 0 ? (
                getRemindersForSelectedDate().map((reminder) => (
                  <div 
                    key={reminder.id} 
                    className="p-3 bg-[#1a2a30] rounded-md border border-claudia-primary/20 hover:border-claudia-primary/40 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-claudia-white">{reminder.title}</h4>
                        <p className="text-sm text-claudia-white/70">{reminder.message}</p>
                        {reminder.description && (
                          <p className="text-xs text-claudia-white/50 mt-1">{reminder.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          reminder.status === 'pending' 
                            ? 'bg-yellow-500/20 text-yellow-300' 
                            : reminder.status === 'sent' 
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-red-500/20 text-red-300'
                        }`}>
                          {reminder.status === 'pending' ? 'Pendiente' : 
                           reminder.status === 'sent' ? 'Enviado' : 'Cancelado'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-claudia-white/60 flex items-center gap-2">
                      <CalendarClock size={14} className="text-claudia-primary" />
                      <span>Envío: {format(new Date(reminder.send_date), "d MMM yyyy, HH:mm", { locale: es })}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 flex flex-col items-center gap-3">
                  <CalendarClock size={40} className="text-claudia-primary/30" />
                  <p className="text-claudia-white/50">No hay recordatorios para esta fecha</p>
                  <Button 
                    variant="outline" 
                    className="mt-2 border-claudia-primary/30 text-claudia-primary hover:bg-claudia-primary/10"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Crear Recordatorio
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Reminder Dialog */}
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
