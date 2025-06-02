import { Steps } from "antd";
import React from "react";

export default function UploadHealthData() {
  return (
    <div className="mt-[28px] mb-[60px] px-[28px]">
      <Steps
        current={1}
        items={[
          {
            title: "Finished",
          },
          {
            title: "In Progress",
          },
          {
            title: "Waiting",
          },
        ]}
      />
      <div>
        <div>Health Symptoms Selection</div>
      </div>
    </div>
  );
}
