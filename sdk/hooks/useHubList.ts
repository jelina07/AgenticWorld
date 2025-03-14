import { useRequest } from "ahooks";
import { Options } from "../types";
import request from "../request";

export default function useHubList(options?: Options<unknown, []>) {
  const result = useRequest(
    async () => {
      const res = await request.get("/hub/list", {});
      return res;
    },
    {
      ...options,
    }
  );

  return result;
}
