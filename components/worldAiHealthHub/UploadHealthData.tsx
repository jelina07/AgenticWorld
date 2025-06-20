import useAgentGetTokenIdStore from "@/store/useAgentGetTokenId";
import {
  Button,
  Checkbox,
  CheckboxOptionType,
  Collapse,
  CollapseProps,
  message,
  Modal,
  notification,
  Radio,
  RadioChangeEvent,
  Steps,
} from "antd";
import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import Encrypt from "@/public/icons/encrypt.svg";
import Verify from "@/public/icons/verify.svg";
import Send from "@/public/icons/send.svg";
import {
  useEncryptData,
  useGetUploadStatus,
  useGetVerifyQueue,
  useGetVerifyStatus,
  useHubGetBnbCurrentExp,
  useHubGetCurrentExp,
  useHubList,
  useIsVoted,
  useSendTxn,
  useVanaSend,
  useVerify,
} from "@/sdk";
import Link from "next/link";
import { useAsyncEffect } from "ahooks";
import { bnb, bnbtestnet, mokshaTestnet, vanaMainnet } from "@/sdk/wagimConfig";
import { isDev, isProd } from "@/sdk/utils";
import { useAccount, useSwitchChain } from "wagmi";
import useHubLearningTime from "@/store/useHubLearningTime";
const optionsGeneralConcerns: CheckboxOptionType<string>[] = [
  { label: "Acute Liver Failure", value: "Acute Liver Failure" },
  { label: "Altered Sensorium", value: "Altered Sensorium" },
  { label: "Anxiety", value: "Anxiety" },
  { label: "Chills", value: "Chills" },
  { label: "Chronic Alcohol Abuse", value: "Chronic Alcohol Abuse" },
  { label: "Dehydration", value: "Dehydration" },
  { label: "Drying And Tingling Lips", value: "Drying And Tingling Lips" },
  { label: "Excess Body Fat", value: "Excess Body Fat" },
  { label: "Excessive Hunger", value: "Excessive Hunger" },
  { label: "Family History", value: "Family History" },
  { label: "Fatigue", value: "Fatigue" },
  {
    label: "Frequent Unprotected Sexual Intercourse With Multiple Partners",
    value: "Frequent Unprotected Sexual Intercourse With Multiple Partners",
  },
  {
    label: "Headache",
    value: "Headache",
  },
  {
    label: "High Fever",
    value: "High Fever",
  },
  {
    label: "Increased Appetite",
    value: "Increased Appetite",
  },
  {
    label: "Internal Itching",
    value: "Internal Itching",
  },
  {
    label: "Irregular Sugar Level",
    value: "Irregular Sugar Level",
  },
  {
    label: "Irritability",
    value: "Irritability",
  },
  {
    label: "Lack Of Concentration",
    value: "Lack Of Concentration",
  },
  {
    label: "Lethargy",
    value: "Lethargy",
  },
  {
    label: "Loss Of Appetite",
    value: "Loss Of Appetite",
  },
  {
    label: "Malaise",
    value: "Malaise",
  },
  {
    label: "Mild Fever",
    value: "Mild Fever",
  },
  {
    label: "Mood Swings",
    value: "Mood Swings",
  },
  {
    label: "Receiving Blood Transfusion",
    value: "Receiving Blood Transfusion",
  },
  {
    label: "Receiving Unsterile Injections",
    value: "Receiving Unsterile Injections",
  },
  {
    label: "Restlessness",
    value: "Restlessness",
  },
  {
    label: "Shivering",
    value: "Shivering",
  },
  {
    label: "Slurred Speech",
    value: "Slurred Speech",
  },
  {
    label: "Sweating",
    value: "Sweating",
  },
  {
    label: "Ulcers On Tongue",
    value: "Ulcers On Tongue",
  },
  {
    label: "Weight Gain",
    value: "Weight Gain",
  },
  {
    label: "Weight Loss",
    value: "Weight Loss",
  },
];
const optionsDigestiveSystemConcerns: CheckboxOptionType<string>[] = [
  { label: "Abdominal Pain", value: "Abdominal Pain" },
  { label: "Acidity", value: "Acidity" },
  { label: "Bloody Stool", value: "Bloody Stool" },
  { label: "Constipation", value: "Constipation" },
  { label: "Diarrhea", value: "Diarrhea" },
  { label: "Distention Of Abdomen", value: "Distention Of Abdomen" },
  { label: "Indigestion", value: "Indigestion" },
  { label: "Irritation In Anus", value: "Irritation In Anus" },
  { label: "Nausea", value: "Nausea" },
  {
    label: "Pain During Bowel Movements",
    value: "Pain During Bowel Movements",
  },
  {
    label: "Pain In Anal Region",
    value: "Pain In Anal Region",
  },
  {
    label: "Passage Of Gases",
    value: "Passage Of Gases",
  },
  {
    label: "Red Spots Over Body",
    value: "Red Spots Over Body",
  },
  {
    label: "Stomach Bleeding",
    value: "Stomach Bleeding",
  },
  {
    label: "Stomach Pain",
    value: "Stomach Pain",
  },
  {
    label: "Swelling Of Stomach",
    value: "Swelling Of Stomach",
  },
  {
    label: "Vomiting",
    value: "Vomiting",
  },
];
const optionsDermatologicalConcerns: CheckboxOptionType<string>[] = [
  { label: "Blackheads", value: "Blackheads" },
  { label: "Blister", value: "Blister" },
  { label: "Brittle Nails", value: "Brittle Nails" },
  { label: "Bruising", value: "Bruising" },
  { label: "Dichromic Patches", value: "Dichromic Patches" },
  { label: "Inflammatory Nails", value: "Inflammatory Nails" },
  { label: "Itching", value: "Itching" },
  { label: "Nodal Skin Eruptions", value: "Nodal Skin Eruptions" },
  { label: "Pus Filled Pimples", value: "Pus Filled Pimples" },
  { label: "Red Sore Around Nose", value: "Red Sore Around Nose" },
  { label: "Scarring", value: "Scarring" },
  { label: "Silver Like Dusting", value: "Silver Like Dusting" },
  { label: "Skin Peeling", value: "Skin Peeling" },
  { label: "Skin Rash", value: "Skin Rash" },
  { label: "Small Dents In Nails", value: "Small Dents In Nails" },
  { label: "Yaesik Look (Typhus)", value: "Yaesik Look (Typhus)" },
  { label: "Yellow Crust Ooze", value: "Yellow Crust Ooze" },
  { label: "Yellowish Skin", value: "Yellowish Skin" },
];
const optionsENTConcerns: CheckboxOptionType<string>[] = [
  { label: "Continuous Sneezing", value: "Continuous Sneezing" },
  { label: "Dizziness", value: "Dizziness" },
  { label: "Enlarged Thyroid", value: "Enlarged Thyroid" },
  { label: "Loss Of Balance", value: "Loss Of Balance" },
  { label: "Loss Of Smell", value: "Loss Of Smell" },
  { label: "Patches In Throat", value: "Patches In Throat" },
  { label: "Runny Nose", value: "Runny Nose" },
  { label: "Sinus Pressure", value: "Sinus Pressure" },
  { label: "Spinning Movements", value: "Spinning Movements" },
  { label: "Throat Irritation", value: "Throat Irritation" },
  { label: "Unsteadiness", value: "Unsteadiness" },
];
const optionsOphthalmologicalConcerns: CheckboxOptionType<string>[] = [
  {
    label: "Blurred And Distorted Vision",
    value: "Blurred And Distorted Vision",
  },
  { label: "Blurred Vision", value: "Blurred Vision" },
  { label: "Eye Pain", value: "Eye Pain" },
  { label: "Light Sensitivity", value: "Light Sensitivity" },
  { label: "Pain Behind The Eyes", value: "Pain Behind The Eyes" },
  { label: "Red Eyes", value: "Red Eyes" },
  { label: "Redness Of Eyes", value: "Redness Of Eyes" },
  { label: "Sunken Eyes", value: "Sunken Eyes" },
  { label: "Visual Disturbances", value: "Visual Disturbances" },
  { label: "Watering From Eyes", value: "Watering From Eyes" },
];
const optionsUrologicalConcerns: CheckboxOptionType<string>[] = [
  {
    label: "Bladder Discomfort",
    value: "Bladder Discomfort",
  },
  { label: "Burning Micturition", value: "Burning Micturition" },
  { label: "Continuous Feel Of Urine", value: "Continuous Feel Of Urine" },
  { label: "Dark Urine", value: "Dark Urine" },
  { label: "Foul Smell Of Urine", value: "Foul Smell Of Urine" },
  { label: "Polyuria", value: "Polyuria" },
  { label: "Spotting Urination", value: "Spotting Urination" },
  { label: "Yellow Urine", value: "Yellow Urine" },
];
const optionsMusculoskeletalConcerns: CheckboxOptionType<string>[] = [
  {
    label: "Back Pain",
    value: "Back Pain",
  },
  { label: "Cramps", value: "Cramps" },
  { label: "Hip Joint Pain", value: "Hip Joint Pain" },
  { label: "Joint Pain", value: "Joint Pain" },
  { label: "Knee Pain", value: "Knee Pain" },
  { label: "Movement Stiffness", value: "Movement Stiffness" },
  { label: "Muscle Pain", value: "Muscle Pain" },
  { label: "Muscle Wasting", value: "Muscle Wasting" },
  { label: "Muscle Weakness", value: "Muscle Weakness" },
  { label: "Neck Pain", value: "Neck Pain" },
  { label: "Painful Walking", value: "Painful Walking" },
  { label: "Stiff Neck", value: "Stiff Neck" },
  { label: "Swelling Joints", value: "Swelling Joints" },
  { label: "Weakness In Limbs", value: "Weakness In Limbs" },
  { label: "Weakness Of One Body Side", value: "Weakness Of One Body Side" },
];
const content = (
  <Link
    href="/agentlaunch"
    className="inline-block text-black hover:text-black underline text-[14px]"
  >
    Go to create an Agent first !
  </Link>
);

export default function UploadHealthData() {
  const { switchChain } = useSwitchChain();
  const { address, isConnected, chainId } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBnb, setIsBnb] = useState(true);
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [showEncryptData, setShowEncryptData] = useState("");
  const [checkedList1, setCheckedList1] = useState<string[]>([]);
  const [checkedList2, setCheckedList2] = useState<string[]>([]);
  const [checkedList3, setCheckedList3] = useState<string[]>([]);
  const [checkedList4, setCheckedList4] = useState<string[]>([]);
  const [checkedList5, setCheckedList5] = useState<string[]>([]);
  const [checkedList6, setCheckedList6] = useState<string[]>([]);
  const [checkedList7, setCheckedList7] = useState<string[]>([]);
  const [generalConcerns, setGeneralConcerns] = useState(0);
  const [digestiveSystemConcerns, setDigestiveSystemConcerns] = useState(0);
  const [dermatologicalConcerns, setDermatologicalConcerns] = useState(0);
  const [eNTConcerns, setENTConcerns] = useState(0);
  const [ophthalmologicalConcerns, setOphthalmologicalConcerns] = useState(0);
  const [urologicalConcerns, setUrologicalConcerns] = useState(0);
  const [musculoskeletalConcerns, setMusculoskeletalConcerns] = useState(0);

  const [binaryGeneralConcerns, setBinaryGeneralConcerns] = useState(
    Array(optionsGeneralConcerns.length).fill(0)
  );
  const [binaryDigestiveSystemConcerns, setBinaryDigestiveSystemConcerns] =
    useState(Array(optionsDigestiveSystemConcerns.length).fill(0));
  const [binaryDermatologicalConcerns, setBinaryDermatologicalConcerns] =
    useState(Array(optionsDermatologicalConcerns.length).fill(0));
  const [binaryENTConcerns, setBinaryENTConcerns] = useState(
    Array(optionsENTConcerns.length).fill(0)
  );
  const [binaryOphthalmologicalConcerns, setBinaryOphthalmologicalConcerns] =
    useState(Array(optionsOphthalmologicalConcerns.length).fill(0));
  const [binaryUrologicalConcerns, setBinaryUrologicalConcerns] = useState(
    Array(optionsUrologicalConcerns.length).fill(0)
  );
  const [binaryMusculoskeletalConcerns, setBinaryMusculoskeletalConcerns] =
    useState(Array(optionsMusculoskeletalConcerns.length).fill(0));

  const refresh = () => {
    setCheckedList1([]);
    setCheckedList2([]);
    setCheckedList3([]);
    setCheckedList4([]);
    setCheckedList5([]);
    setCheckedList6([]);
    setCheckedList7([]);
    setGeneralConcerns(0);
    setDigestiveSystemConcerns(0);
    setDermatologicalConcerns(0);
    setENTConcerns(0);
    setOphthalmologicalConcerns(0);
    setUrologicalConcerns(0);
    setMusculoskeletalConcerns(0);
    setBinaryGeneralConcerns(Array(optionsGeneralConcerns.length).fill(0));
    setBinaryDigestiveSystemConcerns(
      Array(optionsDigestiveSystemConcerns.length).fill(0)
    );
    setBinaryDermatologicalConcerns(
      Array(optionsDermatologicalConcerns.length).fill(0)
    );
    setBinaryENTConcerns(Array(optionsENTConcerns.length).fill(0));
    setBinaryOphthalmologicalConcerns(
      Array(optionsOphthalmologicalConcerns.length).fill(0)
    );
    setBinaryUrologicalConcerns(
      Array(optionsUrologicalConcerns.length).fill(0)
    );
    setBinaryMusculoskeletalConcerns(
      Array(optionsMusculoskeletalConcerns.length).fill(0)
    );
    setShowEncryptData("");
  };
  const clickRestart = () => {
    refresh();
    setIsRestart(true);
  };
  const onChangeOptions = (
    checkedValues: any,
    options: Array<any>,
    setSelectedNumber: Function,
    setBinaryFormat: Function,
    setCheckedList: Function
  ) => {
    setCheckedList(checkedValues);
    setSelectedNumber(checkedValues.length);
    const nowBinaryFormat = Array(options.length).fill(0);
    for (const item of checkedValues) {
      const currentIndex = options.findIndex((obj: any) => obj.value === item);
      nowBinaryFormat[currentIndex] = 1;
    }
    setBinaryFormat(nowBinaryFormat);
  };

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: "#0c1110",
    borderRadius: 8,
    border: "1px solid #28A57F",
    padding: "20px",
  };
  const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle
  ) => [
    {
      key: "1",
      label: (
        <div className="flex items-center flex-wrap gap-[10px]">
          <span>General Concerns</span>
          <span
            className={`px-[20px] py-[5px] border rounded-[95px] text-[12px] ${
              generalConcerns > 0 ? "border-[var(--mind-brand)]" : ""
            } ${generalConcerns > 0 ? "text-[var(--mind-brand)]" : ""}`}
          >
            {generalConcerns} selected
          </span>
        </div>
      ),
      children: (
        <div className="mt-[30px]">
          <Checkbox.Group
            options={optionsGeneralConcerns}
            onChange={(checkedValues) =>
              onChangeOptions(
                checkedValues,
                optionsGeneralConcerns,
                setGeneralConcerns,
                setBinaryGeneralConcerns,
                setCheckedList1
              )
            }
            value={checkedList1}
            className="healthCheckBox"
          />
        </div>
      ),
      style: panelStyle,
    },
    {
      key: "2",
      label: (
        <div className="flex items-center flex-wrap gap-[10px]">
          <span>Digestive System Concerns</span>
          <span
            className={`px-[20px] py-[5px] border rounded-[95px] text-[12px] ${
              digestiveSystemConcerns > 0 ? "border-[var(--mind-brand)]" : ""
            } ${digestiveSystemConcerns > 0 ? "text-[var(--mind-brand)]" : ""}`}
          >
            {digestiveSystemConcerns} selected
          </span>
        </div>
      ),
      children: (
        <div className="mt-[30px]">
          <Checkbox.Group
            options={optionsDigestiveSystemConcerns}
            onChange={(checkedValues) =>
              onChangeOptions(
                checkedValues,
                optionsDigestiveSystemConcerns,
                setDigestiveSystemConcerns,
                setBinaryDigestiveSystemConcerns,
                setCheckedList2
              )
            }
            className="healthCheckBox"
            value={checkedList2}
          />
        </div>
      ),
      style: panelStyle,
    },
    {
      key: "3",
      label: (
        <div className="flex items-center flex-wrap gap-[10px]">
          <span>Dermatological Concerns</span>
          <span
            className={`px-[20px] py-[5px] border rounded-[95px] text-[12px] ${
              dermatologicalConcerns > 0 ? "border-[var(--mind-brand)]" : ""
            } ${dermatologicalConcerns > 0 ? "text-[var(--mind-brand)]" : ""}`}
          >
            {dermatologicalConcerns} selected
          </span>
        </div>
      ),
      children: (
        <div className="mt-[30px]">
          <Checkbox.Group
            options={optionsDermatologicalConcerns}
            onChange={(checkedValues) =>
              onChangeOptions(
                checkedValues,
                optionsDermatologicalConcerns,
                setDermatologicalConcerns,
                setBinaryDermatologicalConcerns,
                setCheckedList3
              )
            }
            className="healthCheckBox"
            value={checkedList3}
          />
        </div>
      ),
      style: panelStyle,
    },
    {
      key: "4",
      label: (
        <div className="flex items-center flex-wrap gap-[10px]">
          <span>ENT (Ear Nose Throat) Concerns</span>
          <span
            className={`px-[20px] py-[5px] border rounded-[95px] text-[12px] ${
              eNTConcerns > 0 ? "border-[var(--mind-brand)]" : ""
            } ${eNTConcerns > 0 ? "text-[var(--mind-brand)]" : ""}`}
          >
            {eNTConcerns} selected
          </span>
        </div>
      ),
      children: (
        <div className="mt-[30px]">
          <Checkbox.Group
            options={optionsENTConcerns}
            onChange={(checkedValues) =>
              onChangeOptions(
                checkedValues,
                optionsENTConcerns,
                setENTConcerns,
                setBinaryENTConcerns,
                setCheckedList4
              )
            }
            className="healthCheckBox"
            value={checkedList4}
          />
        </div>
      ),
      style: panelStyle,
    },
    {
      key: "5",
      label: (
        <div className="flex items-center flex-wrap gap-[10px]">
          <span>Ophthalmological Concerns</span>
          <span
            className={`px-[20px] py-[5px] border rounded-[95px] text-[12px] ${
              ophthalmologicalConcerns > 0 ? "border-[var(--mind-brand)]" : ""
            } ${
              ophthalmologicalConcerns > 0 ? "text-[var(--mind-brand)]" : ""
            }`}
          >
            {ophthalmologicalConcerns} selected
          </span>
        </div>
      ),
      children: (
        <div className="mt-[30px]">
          <Checkbox.Group
            options={optionsOphthalmologicalConcerns}
            onChange={(checkedValues) =>
              onChangeOptions(
                checkedValues,
                optionsOphthalmologicalConcerns,
                setOphthalmologicalConcerns,
                setBinaryOphthalmologicalConcerns,
                setCheckedList5
              )
            }
            className="healthCheckBox"
            value={checkedList5}
          />
        </div>
      ),
      style: panelStyle,
    },
    {
      key: "6",
      label: (
        <div className="flex items-center flex-wrap gap-[10px]">
          <span>Urological Concerns</span>
          <span
            className={`px-[20px] py-[5px] border rounded-[95px] text-[12px] ${
              urologicalConcerns > 0 ? "border-[var(--mind-brand)]" : ""
            } ${urologicalConcerns > 0 ? "text-[var(--mind-brand)]" : ""}`}
          >
            {urologicalConcerns} selected
          </span>
        </div>
      ),
      children: (
        <div className="mt-[30px]">
          <Checkbox.Group
            options={optionsUrologicalConcerns}
            onChange={(checkedValues) =>
              onChangeOptions(
                checkedValues,
                optionsUrologicalConcerns,
                setUrologicalConcerns,
                setBinaryUrologicalConcerns,
                setCheckedList6
              )
            }
            className="healthCheckBox"
            value={checkedList6}
          />
        </div>
      ),
      style: panelStyle,
    },
    {
      key: "7",
      label: (
        <div className="flex items-center flex-wrap gap-[10px]">
          <span>Musculoskeletal Concerns</span>
          <span
            className={`px-[20px] py-[5px] border rounded-[95px] text-[12px] ${
              musculoskeletalConcerns > 0 ? "border-[var(--mind-brand)]" : ""
            } ${musculoskeletalConcerns > 0 ? "text-[var(--mind-brand)]" : ""}`}
          >
            {musculoskeletalConcerns} selected
          </span>
        </div>
      ),
      children: (
        <div className="mt-[30px]">
          <Checkbox.Group
            options={optionsMusculoskeletalConcerns}
            onChange={(checkedValues) =>
              onChangeOptions(
                checkedValues,
                optionsMusculoskeletalConcerns,
                setMusculoskeletalConcerns,
                setBinaryMusculoskeletalConcerns,
                setCheckedList7
              )
            }
            className="healthCheckBox"
            value={checkedList7}
          />
        </div>
      ),
      style: panelStyle,
    },
  ];
  const binaryFormatString = useMemo(
    () =>
      binaryGeneralConcerns.join() +
      "," +
      binaryDigestiveSystemConcerns.join() +
      "," +
      binaryDermatologicalConcerns.join() +
      "," +
      binaryENTConcerns.join() +
      "," +
      binaryOphthalmologicalConcerns.join() +
      "," +
      binaryUrologicalConcerns.join() +
      "," +
      binaryMusculoskeletalConcerns.join(),
    [
      binaryGeneralConcerns,
      binaryDigestiveSystemConcerns,
      binaryDermatologicalConcerns,
      binaryENTConcerns,
      binaryOphthalmologicalConcerns,
      binaryUrologicalConcerns,
      binaryMusculoskeletalConcerns,
    ]
  );

  const selectedNumMin5 = useMemo(
    () =>
      generalConcerns +
        digestiveSystemConcerns +
        dermatologicalConcerns +
        eNTConcerns +
        ophthalmologicalConcerns +
        urologicalConcerns +
        musculoskeletalConcerns <
      5,
    [
      generalConcerns,
      digestiveSystemConcerns,
      dermatologicalConcerns,
      eNTConcerns,
      ophthalmologicalConcerns,
      urologicalConcerns,
      musculoskeletalConcerns,
    ]
  );

  const agentTokenId = useAgentGetTokenIdStore((state) => state.agentTokenId);
  const {
    data: encryptData,
    runAsync: encryptDataRunAsync,
    loading,
  } = useEncryptData();
  const { runAsync: verify, loading: verifyLoading } = useVerify();
  const {
    data: verifyStatus,
    runAsync: getVerifyStatus,
    refresh: getVerifyRefresh,
    loading: verifyStatusLoading,
  } = useGetVerifyStatus();
  const {
    data: verifyQueue,
    runAsync: getVerifyQueue,
    refresh: getVerifyQueueRefresh,
    loading: verifyQueueLoading,
  } = useGetVerifyQueue();
  const {
    data: uploadStatus,
    runAsync: getUploadStatus,
    refresh: getUploadStatusRefresh,
    loading: uploadStatusLoading,
  } = useGetUploadStatus();
  const { runAsync: sendTxn, loading: sendTxnLoading } = useSendTxn();
  const { data: isVoted, refresh: isVotedRefresh } = useIsVoted();
  const [isRestart, setIsRestart] = useState(false);
  const { hubLearningTime, refreshGetHubLearningTime } = useHubLearningTime();

  const { runAsync: vanaSend, loading: vanaSendLoading, step } = useVanaSend();

  const { data: hubList } = useHubList();
  const ids = useMemo(() => {
    return hubList?.map((item: any) => item.id) || [];
  }, [hubList]);
  const {
    learnSecond,
    loading: learnSecondLoading,
    refresh: refreshHubGetCurrentExp,
  } = useHubGetBnbCurrentExp({
    tokenId: agentTokenId,
    hubIds: ids,
  });

  const isLearned = useMemo(() => {
    const index = ids.indexOf(5);
    return learnSecond !== undefined && learnSecond[index] > 0;
  }, [learnSecond]);

  console.log("isLearned", isLearned);

  console.log("lll", uploadStatus);

  const setpCurrent = useMemo(() => {
    if (
      !selectedNumMin5 &&
      !showEncryptData &&
      !verifyStatus?.isVerifying &&
      (!verifyStatus?.isVerified || verifyStatus?.isVerified === -1)
    ) {
      return 1;
    } else if (
      (uploadStatus || verifyStatus?.isVerifying) &&
      (!verifyStatus?.isVerified || verifyStatus?.isVerified === -1)
    ) {
      return 2;
      // if verify success return 3
    } else if (verifyStatus?.isVerified === 1 && !isVoted) {
      return 3;
    } else if (isVoted) {
      return 4;
    }
    // if send to bsc return 4
  }, [selectedNumMin5, showEncryptData, uploadStatus, isVoted, verifyStatus]);

  console.log("setpCurrent", setpCurrent);

  const clickencryptData = async () => {
    if (isLearned) {
      try {
        const res = await encryptDataRunAsync(
          binaryFormatString.replace(/,/g, ""),
          content
        );
        if (res)
          notification.success({
            message: "Success",
            description: "Encrypt Success",
          });
        setIsRestart(false);
        getUploadStatusRefresh();
      } catch (error) {}
    } else {
      message.open({
        type: "warning",
        content: `You need to work on this hub first.`,
        duration: 5,
      });
    }
  };
  const clickVerify = async () => {
    try {
      await verify();
      await getVerifyStatus();
      await getVerifyQueue();
    } catch (error) {}
  };
  const refreshVerifyStatus = () => {
    getVerifyQueueRefresh();
    getVerifyRefresh();
  };
  const send = async () => {
    setIsModalOpen(false);
    if (isBnb && chainId !== bnb.id && chainId !== bnbtestnet.id) {
      switchChain({
        chainId: isDev() || isProd() ? bnbtestnet.id : bnb.id,
      });
    } else if (isBnb) {
      await sendTxn();
      isVotedRefresh();
      notification.success({
        message: "Success",
        description: "Send success",
      });
    } else if (
      !isBnb &&
      chainId !== vanaMainnet.id &&
      chainId !== mokshaTestnet.id
    ) {
      switchChain({
        chainId: isDev() || isProd() ? mokshaTestnet.id : vanaMainnet.id,
      });
    } else {
      await vanaSend(address as string);
      isVotedRefresh();
      notification.success({
        message: "Success",
        description: "Send success",
      });
    }
  };
  const selectChain = (e: RadioChangeEvent) => {
    console.log(`radio checked:${e.target.value}`);
    if (e.target.value === "bnb") {
      setIsBnb(true);
    } else {
      setIsBnb(false);
    }
  };

  useAsyncEffect(async () => {
    try {
      await getUploadStatus();
      await getVerifyStatus();
      await getVerifyQueue();
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (encryptData) setShowEncryptData(encryptData.proofs);
  }, [encryptData?.proofs]);

  return (
    <div className="mt-[40px] pt-[28px] pb-[60px] px-[28px] bg-[#181818] rounded-[20px]">
      <div className="text-[18px] font-[800] mb-[0px]">
        Upload Health Data with FHE
      </div>
      <div className="mb-[20px]">
        <div className="font-[700]">
          Recommend uploading health data on a PC.
        </div>
        <div className="text-[14px]">
          Encryption is resource-intensive and may take longer time on mobile
          devices.
        </div>
      </div>
      <Steps
        current={setpCurrent}
        className="mind-step"
        size="small"
        items={[
          {
            title: "Select Symptoms",
          },
          {
            title: "Encrypt Data",
          },
          {
            title: `Verify Data ${
              verifyQueue ? "(Queue: " + verifyQueue + " )" : ""
            }`,
          },
          {
            title: "Send Data",
          },
        ]}
      />
      {uploadStatusLoading ? (
        <div className="text-center">loading...</div>
      ) : uploadStatus &&
        !isRestart &&
        verifyStatus?.isVerified !== 1 &&
        !verifyStatus?.isVerifying ? (
        <div className="text-center mt-[30px]">
          <span
            className="text-[var(--mind-brand)] px-[10px] py-[4px] cursor-pointer border border-[var(--mind-brand)] rounded-[10px]"
            onClick={clickRestart}
          >
            Restart
          </span>
        </div>
      ) : verifyStatus?.isVerified === 1 || verifyStatus?.isVerifying ? (
        <></>
      ) : (
        <div>
          <div className="flex items-center gap-[10px] mt-[50px] font-[700]">
            <div>Health Symptoms Selection</div>
            <img
              src="/icons/refresh.svg"
              alt="refresh"
              onClick={refresh}
              width={15}
              className={`cursor-pointer`}
            />
          </div>
          <div className="text-[14px] mt-[10px]">
            Select at least 5 symptoms that apply to your last condition
          </div>
          <div className="mt-[20px]">
            <Collapse
              accordion
              items={getItems(panelStyle)}
              bordered={false}
              className="mind-collapse world-health-hub"
              expandIconPosition="end"
            />
          </div>
        </div>
      )}

      <div className="mt-[40px] font-[700]">Encrypt Data with FHE</div>
      <div className="text-[14px] mt-[10px]">
        Transform your symptom data into encrypted format
      </div>
      <div className="mt-[30px] flex gap-[10px] items-center">
        <span>User Symptoms Vector</span>
        <span className="bg-[#1f1f1f] inline-block py-[5px] px-[20px] border border-[#484848] rounded-[15px] text-[#888e8d]">
          Binary Format
        </span>
      </div>
      <div className="sm:flex justify-between mt-[20px] gap-[20px]">
        <div className="flex-1">
          <div className="bg-[#1f1f1f] border border-[#484848] rounded-[12px] p-[26px] h-[200px] break-all overflow-y-auto">
            {`【 ${binaryFormatString} 】`}
          </div>
          <div className="mt-[15px] text-[14px] text-center text-[#888e8d]">
            Each position represents a symptom (0 = not selected, 1 = selected)
          </div>
        </div>
        <div className="flex-1 sm:mt-[0px] mt-[30px]">
          <div className="bg-[#1f1f1f] border border-[#484848] rounded-[12px] p-[26px] h-[200px] break-all overflow-y-auto">
            {!showEncryptData ? (
              <span className="text-[#626262]">
                Encrypted ciphertext will appear here after encryption
              </span>
            ) : (
              showEncryptData.slice(0, 50) + "..." + showEncryptData.slice(-50)
            )}
          </div>
          <div className="mt-[15px] text-[14px] text-center text-[#888e8d]">
            Homomorphically encrypted data using FHE algorithms
          </div>
        </div>
      </div>

      <div className="mt-[37px] text-center">
        <Button
          icon={<Encrypt />}
          className="encrypt-btn"
          disabled={
            selectedNumMin5 ||
            verifyStatus?.isVerified === 1 ||
            verifyStatus?.isVerifying ||
            (uploadStatus && !isRestart)
          }
          loading={loading}
          onClick={clickencryptData}
        >
          <span className="text-[14px] whitespace-normal">
            {(verifyStatus?.isVerified === 1 ||
              verifyStatus?.isVerifying ||
              (uploadStatus && !isRestart)) &&
            verifyStatus?.isVerified !== -1
              ? "Encrypted"
              : `Encrypt ${
                  selectedNumMin5 ? " (Select at least 5 symptoms)" : ""
                }`}
          </span>
        </Button>
        <div
          className={`flex text-[14px] text-center justify-center gap-[5px] mt-[10px] ${
            !isConnected || isLearned ? "hidden" : ""
          }`}
        >
          Refresh the learning status of this hub:
          <img
            src="/icons/refresh.svg"
            alt="refresh"
            onClick={() => refreshHubGetCurrentExp()}
            width={15}
            className={`cursor-pointer ${learnSecondLoading ? "refresh" : ""} `}
          />
        </div>
      </div>

      <div className="mt-[26px]">
        <div className="font-[600]">
          Verify encrypted data status before on-chain submission.
        </div>
        <div className="text-center mt-[26px]">
          <Button
            icon={<Verify />}
            className="encrypt-btn"
            onClick={clickVerify}
            loading={verifyLoading}
            disabled={
              verifyStatus?.isVerified === 1 ||
              verifyStatus?.isVerifying ||
              !uploadStatus
            }
          >
            {verifyStatus?.isVerified === 1
              ? "Verified"
              : verifyStatus?.isVerifying || verifyLoading
              ? "Verifying..."
              : "Verify"}
          </Button>
          {verifyStatus?.isVerified === -1 ? (
            <div className="text-[var(--mind-red)] hover:text-[var(--mind-red)] text-[12px] mt-[15px]">
              Verify failed, Please re-encrypt and verify
            </div>
          ) : (
            <></>
          )}
          {verifyQueue ? (
            <>
              <div className="text-[14px] text-[var(--mind-brand)] mt-[15px]">
                {verifyQueueLoading
                  ? "loading..."
                  : `Queue:${" " + verifyQueue}`}
              </div>
              <div className="text-[14px] font-[600] text-[#888E8D] flex gap-[5px] justify-center">
                <span className="leading-5">
                  Come back later or refresh to check the verifying status and
                  continue to next step
                </span>
                <img
                  src="/icons/refresh.svg"
                  alt="refresh"
                  onClick={refreshVerifyStatus}
                  width={15}
                  className={`cursor-pointer ${
                    verifyStatusLoading || verifyQueueLoading ? "refresh" : ""
                  }`}
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="mt-[40px] ">
        <div className="font-[600]">Send the FHE Encrypted Data on-chain</div>
        <div className="text-[14px] text-[#A3A3A3] mt-[10px]">
          Securely transmit your encrypted health data
        </div>
        <div className="text-center mt-[26px]">
          <Button
            icon={<Send />}
            className="send-btn"
            disabled={
              !verifyStatus?.isVerified ||
              verifyStatus?.isVerified === -1 ||
              isVoted
            }
            loading={sendTxnLoading || vanaSendLoading}
            onClick={() => setIsModalOpen(true)}
          >
            {isVoted ? "Sent" : "Send"}
          </Button>
          {isVoted ? (
            <a
              href={
                isDev() || isProd()
                  ? bnbtestnet.blockExplorers.default.url +
                    `/address/${address}`
                  : bnb.blockExplorers.default.url + `/address/${address}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--mind-brand)] underline hover:underline hover:text-[var(--mind-brand)] text-[12px] sm:ml-[15px] ml-[0px] sm:mt-[0px] mt-[15px] sm:inline-block block"
            >
              View Transaction
            </a>
          ) : (
            <></>
          )}
        </div>
        {vanaSendLoading ? (
          <div className="text-[14px] text-[#A3A3A3] mt-[10px] text-center">
            current step:{" "}
            {step === 1
              ? "Recording encrypted data on the VANA network"
              : step === 2
              ? "Running proof-of-contribution in trusted environment"
              : step === 3
              ? "Recording validation proof on-chain"
              : ""}
            {/* <Steps
            progressDot
            current={step}
            items={[
              {
                title: "1",
                description: "Recording encrypted data on the VANA network",
              },
              {
                title: "2",
                description:
                  "Running proof-of-contribution in trusted environment",
              },
              {
                title: "3",
                description: "Recording validation proof on-chain",
              },
            ]}
          /> */}
          </div>
        ) : (
          <></>
        )}

        <div className="text-[12px] text-[var(--mind-brand)] mt-[30px] text-center">
          Your encrypted data will be securely transmitted and stored with
          end-to-end encryption
        </div>
        <Modal
          title="Select your preferred chain to send the data"
          open={isModalOpen}
          onCancel={handleCancel}
          className="mind-madal"
          footer={null}
        >
          <div>
            <Radio.Group
              onChange={selectChain}
              defaultValue="bnb"
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "space-around",
                marginTop: "50px",
              }}
            >
              <Radio.Button
                value="bnb"
                style={{
                  borderRadius: "8px",
                  paddingRight: "40px",
                  paddingLeft: "40px",
                  background: "transparent",
                  color: "#878c8b",
                  border: "1px solid #878c8b",
                }}
              >
                BNB Chain
              </Radio.Button>
              <Radio.Button
                value="vana"
                style={{
                  borderRadius: "8px",
                  paddingRight: "40px",
                  paddingLeft: "40px",
                  background: "transparent",
                  color: "#878c8b",
                  border: "1px solid #878c8b",
                }}
              >
                VANA Chain
              </Radio.Button>
            </Radio.Group>
            <div className="mt-[10px] text-right">
              <a
                href="https://www.datadex.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:underline hover:text-white text-[12px]"
              >
                Get $VANA
              </a>
            </div>
            <Button
              type="primary"
              className="button-brand-border-white-font mt-[30px]"
              onClick={send}
            >
              Confirm
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
