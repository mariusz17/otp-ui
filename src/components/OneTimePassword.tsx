import React, { useState, useRef } from "react";

type Props = {
  length: number;
};

const OneTimePassword: React.FC<Props> = ({ length }) => {
  const [password, setPassword] = useState<string[]>(
    new Array(length).fill("")
  );

  const inputsList = useRef<HTMLInputElement[]>([]);
  const activeIndex = useRef<number>(0);

  const fillPasswordChar = (index: number, newChar: string) => {
    setPassword((prev) =>
      prev.map((char, n) => {
        if (n === index) {
          return newChar;
        } else {
          return char;
        }
      })
    );
  };

  const onSignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    activeIndex.current = Number(e.target.name.replace("otp-", ""));
    const newValue = e.target.value;

    if (newValue === "") {
      fillPasswordChar(activeIndex.current, "");
      if (activeIndex.current > 0) {
        // activeIndex.current--;
        inputsList.current[activeIndex.current - 1].focus();
      }
      return;
    }

    for (const char of newValue) {
      fillPasswordChar(activeIndex.current, char);
      // activeIndex.current++;
      if (activeIndex.current + 1 >= length) return;
      inputsList.current[activeIndex.current + 1].focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" &&
      password[activeIndex.current] === "" &&
      activeIndex.current > 0
    ) {
      // activeIndex.current--;
      fillPasswordChar(activeIndex.current - 1, "");
      inputsList.current[activeIndex.current - 1].focus();
    }
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    activeIndex.current = Number(e.target.name.replace("otp-", ""));
  };

  return (
    <div>
      <h2>One Time Password:</h2>
      {password.map((char, index) => {
        return (
          <input
            ref={(input) => {
              if (input) {
                inputsList.current[index] = input;
              }
            }}
            key={index}
            name={`otp-${index}`}
            type="text"
            value={char}
            onChange={onSignChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
          />
        );
      })}
      <h3>User password: {password.join("")}</h3>
    </div>
  );
};

export default OneTimePassword;
