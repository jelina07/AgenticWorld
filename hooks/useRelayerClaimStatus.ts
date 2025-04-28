import { useAsyncEffect } from "ahooks";
import { notification } from "antd";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

export default function useRelayerClaimStatus(
  statusRes: any,
  cancel: Function,
  afterSuccessHandler: Function,
  setLoop: Function,
  successMess: string,
  errorCodeMap: Function,
  stake: any,
  claimAmout: any
) {
  const { address } = useAccount();
  useAsyncEffect(async () => {
    if (address) {
      // have action
      if (statusRes !== undefined) {
        if (statusRes.status === "1") {
          cancel();
          await new Promise((resolve) => setTimeout(resolve, 5000));
          afterSuccessHandler();
          setLoop(false);
          notification.success({
            message: "Success",
            description: successMess,
          });
          await stake(formatEther(BigInt(claimAmout?.amount)));
        } else if (statusRes.status === "-1") {
          cancel();
          if (statusRes.message) {
            notification.warning({
              message: "Warning",
              description: statusRes.message,
            });
          } else if (statusRes.errorCode) {
            const errorMess = errorCodeMap(statusRes.errorCode);
            notification.warning({
              message: "Warning",
              description: errorMess,
            });
          }
          setLoop(false);
        } else {
          setLoop(true);
        }
      }
    }
  }, [statusRes]);
}
