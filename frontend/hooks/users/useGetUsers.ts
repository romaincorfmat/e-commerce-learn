import { getAllUsers } from "@/app/api/user/route";
import { useQuery } from "@tanstack/react-query";

function useGetUsers() {
  //   const queryClient = useQueryClient();

  const query = useQuery({ queryKey: ["users"], queryFn: getAllUsers });
  return query;
}

export default useGetUsers;
