import { useAsyncEffect } from "ahooks";
import { notification } from "antd";
import { ReactNode } from "react";
import { useAccount } from "wagmi";

export default function useRelayerStatusHandler(
  statusRes: any,
  cancel: Function,
  afterSuccessHandler: Function,
  setLoop: Function,
  successMess: string | ReactNode,
  errorCodeMap: Function,
  helperFun?: Function,
  tipManualClose?: boolean
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
          tipManualClose
            ? notification.warning({
                message: "Warning",
                description: successMess,
                duration: null,
              })
            : notification.success({
                message: "Success",
                description: successMess,
              });
        } else if (statusRes.status === "-1") {
          cancel();
          afterSuccessHandler();
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
