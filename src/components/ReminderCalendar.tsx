
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
import { CalendarClock, CalendarDays, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ReminderCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [reminderDates, setReminderDates] = useState<Date[]>([]);
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

  // Custom day renderer for the calendar to highlight days with reminders
  const dayWithRemindersClassname = (date: Date) => {
    return reminderDates.some(reminderDate => 
      isSameDay(reminderDate, date)
    ) ? 'bg-claudia-primary/40 text-claudia-white rounded-full' : '';
  };

  return (
    <div className="bg-[#1a2a30] rounded-lg shadow-xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-5 w-5 text-claudia-primary" />
        <h2 className="text-xl font-bold text-claudia-white">Calendario de Recordatorios</h2>
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
          <h3 className="text-lg font-medium text-claudia-white mb-3">
            {selectedDate ? 
              `Recordatorios para ${format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })}` : 
              "Selecciona una fecha para ver recordatorios"}
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
                    className="p-3 bg-[#1a2a30] rounded-md border border-claudia-primary/20"
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
                <div className="text-center py-8 text-claudia-white/50">
                  No hay recordatorios para esta fecha
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReminderCalendar;
