
export interface Service {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  duration: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}
