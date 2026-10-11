// ====== PASTE YOUR SUPABASE DETAILS HERE (Supabase > Project Settings > API) ======
window.WNV = {
  SUPABASE_URL: "https://jbodvtrfqcmklvdaojeb.supabase.co",
  SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impib2R2dHJmcWNta2x2ZGFvamViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MDcwMjQsImV4cCI6MjEwNzI4MzAyNH0.J9OMuoq9Dpy3YC__gjHI4_IeTp7EERgOjb4wBL0k8x4",
};
// ==================================================================================
window.sb = supabase.createClient(WNV.SUPABASE_URL, WNV.SUPABASE_KEY);
