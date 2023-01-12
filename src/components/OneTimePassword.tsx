import { useState, useRef } from "react";

type Props = {
  length: number;
};

const OneTimePassword: React.FC<Props> = ({ length }) => {
  const [passwordArray, setPasswordArray] = useState<string[]>(
    new Array(length).fill("")
  );

  const inputsList = useRef<HTMLInputElement[]>([]);
  const valueStack = useRef<string[]>([]);
  const stepIndex = useRef<number | null>(null);

  const selectNextFreeInput = (currentIndex: number) => {
    for (let i = currentIndex; i < length; i++) {
      if (passwordArray[i] === "") {
        inputsList.current[i].focus();
        return i;
      }
    }

    return null;
  };

  const fillPasswordLetter = (index: number, letter: string) => {
    setPasswordArray((prev) =>
      prev.map((sign, n) => {
        if (n === index) {
          return letter;
        } else {
          return sign;
        }
      })
    );
  };

  const onSignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentIndex = Number(e.target.name.replace("otp-", ""));
    const newValue = e.target.value;

    if (newValue === "") {
      fillPasswordLetter(currentIndex, "");
      if (currentIndex > 0) {
        inputsList.current[currentIndex - 1].focus();
      }
      return;
    }

    valueStack.current = [];
    for (const letter of newValue) {
      valueStack.current.push(letter);
    }

    stepIndex.current = currentIndex;

    do {
      if (stepIndex.current !== null) {
        fillPasswordLetter(stepIndex.current, valueStack.current[0]);
        valueStack.current.shift();
        stepIndex.current += 1;
      } else {
        return;
      }
      stepIndex.current = selectNextFreeInput(stepIndex.current);
    } while (valueStack.current.length > 0);
  };

  return (
    <div>
      <h2>One Time Password:</h2>
      {passwordArray.map((sign, index) => {
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
            value={sign}
            onChange={onSignChange}
          />
        );
      })}
      <h3>User password: {passwordArray.join("")}</h3>
    </div>
  );
};

export default OneTimePassword;
