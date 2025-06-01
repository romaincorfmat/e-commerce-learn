import { createUser } from "@/app/api/user/route";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useCreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return mutation;
}

export default useCreateUser;
