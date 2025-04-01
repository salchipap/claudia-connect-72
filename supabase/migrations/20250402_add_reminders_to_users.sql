
-- Añadir campo de recordatorios disponibles a la tabla users
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS reminders TEXT DEFAULT '5';
