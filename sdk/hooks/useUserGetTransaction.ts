import { usePagination } from "ahooks";
import { Options } from "../types";
import { useRef } from "react";
import request from "../request";
import { useAccount } from "wagmi";

export default function useUserTransaction(
  agentId: number,
  options?: Options<unknown, []>
) {
  const total = useRef<number>(0);
  const totalFetched = useRef<boolean>(false);

  const { address } = useAccount();

  const result = usePagination(
    async ({ current, pageSize }) => {
      if (!address) {
        return { list: [], total: 0 };
      }
      if (!totalFetched.current) {
        const totalCount = (await request.get("/user-transaction/total", {
          params: { user: address, agentId: agentId },
        })) as number;
        total.current = totalCount || 0;
        totalFetched.current = true;
      }
      const list = (await request.get("/user-transaction/list", {
        params: {
          user: address,
          page: current,
          limit: pageSize,
          agentId: agentId,
        },
      })) as any[];
      return { list, total: total.current };
    },
    {
      defaultPageSize: 5,
      refreshDeps: [address],
    }
  );
  return result;
}
