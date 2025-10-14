-- Create users table
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for portfolio demo purposes)
CREATE POLICY "Anyone can view users" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create users" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update users" 
ON public.users 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete users" 
ON public.users 
FOR DELETE 
USING (true);

-- Insert sample data
INSERT INTO public.users (nome, email, telefone, status, criado_em) VALUES
('João Silva', 'joao@example.com', '(11) 99999-9999', 'ativo', '2024-01-01'),
('Maria Santos', 'maria@example.com', '(11) 98888-8888', 'ativo', '2024-01-15'),
('Pedro Oliveira', 'pedro@example.com', '(11) 97777-7777', 'inativo', '2024-02-01');