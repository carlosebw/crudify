import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type User = Database["public"]["Tables"]["users"]["Row"];
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: Omit<UserInsert, "id" | "criado_em">) => {
    try {
      const { error } = await supabase
        .from("users")
        .insert([userData]);

      if (error) throw error;
      
      toast.success("Usuário criado com sucesso!");
      await fetchUsers();
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      if (error.message?.includes("duplicate")) {
        toast.error("Este email já está cadastrado");
      } else {
        toast.error("Erro ao criar usuário");
      }
      throw error;
    }
  };

  const updateUser = async (id: string, userData: UserUpdate) => {
    try {
      const { error } = await supabase
        .from("users")
        .update(userData)
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Usuário atualizado com sucesso!");
      await fetchUsers();
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);
      if (error.message?.includes("duplicate")) {
        toast.error("Este email já está cadastrado");
      } else {
        toast.error("Erro ao atualizar usuário");
      }
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Usuário excluído com sucesso!");
      await fetchUsers();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário");
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
}