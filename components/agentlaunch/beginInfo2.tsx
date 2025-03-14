"use client";
import * as React from "react";
import { useTypewriter } from "use-typewriter-hook";

const BasicTypewriter: React.FC = () => {
  const targetText =
    "Welcome to React useTypewriter. This is a basic typewriter. You can also display emojis, like this 😜 🤩 🥳 😍 !";
  const { textValue: typedText, start } = useTypewriter({
    targetText: targetText,
    typingDelayMillis: 50,
    autoStartDelay: 0,
  });
  return (
    <div className="basic-typewriter-wrapper">
      <button onClick={start}>start</button>
      <div className="example-typewriter-wrapper">
        <div className="text-red-500" id="basic-typewriter">
          {typedText}
        </div>
      </div>
    </div>
  );
};

export default BasicTypewriter;
