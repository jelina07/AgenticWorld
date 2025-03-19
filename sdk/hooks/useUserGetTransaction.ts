import { usePagination } from "ahooks";
import { Options } from "../types";
import { useRef } from "react";
import request from "../request";

export default function useUserTransaction(options?: Options<unknown, []> & { address: string }) {
  const total = useRef<number>(0);
  const totalFetched = useRef<boolean>(false);

  const { address } = options || {};

  const result = usePagination(
    async ({ current, pageSize }) => {
      if (!address) {
        return { list: [], total: 0 };
      }
      if (!totalFetched.current) {
        const totalCount = (await request.get("/user-transaction/total", { params: { user: address } })) as number;
        total.current = totalCount || 0;
        totalFetched.current = true;
      }
      const list = (await request.get("/user-transaction/list", {
        params: { user: address, page: current, limit: pageSize },
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
