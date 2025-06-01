import { deleteUser } from "@/app/api/user/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useDeleteUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return mutation;
}

export default useDeleteUser;
