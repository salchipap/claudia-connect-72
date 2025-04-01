
export type Reminder = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  description?: string;
  date: string;
  send_date: string;
  action?: string;
  remotejid: string;
  status: string;
  repetition?: string;
  origin: string;
  created_at: string;
  updated_at: string;
};
