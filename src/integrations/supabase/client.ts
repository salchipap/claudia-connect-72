
import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno de Supabase
const supabaseUrl = 'https://kdjtdlxotikkmzyvjmxb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkanRkbHhvdGlra216eXZqbXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NzM2NDEsImV4cCI6MjAyODM0OTY0MX0.BtxA6MKpKnwAu7P0SLqgQL4n6bMQkqnqM76c0lmWkJ8';

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
