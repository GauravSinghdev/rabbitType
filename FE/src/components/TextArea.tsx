import { ChangeEvent, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { paragraphs } from "../Array";
import { motion } from "framer-motion";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface TextAreaProps {
  timer: string;
  random: number;
}

const TextArea = ({ timer, random }: TextAreaProps) => {
  const navigate = useNavigate();
  const wordToType = paragraphs[random];

  const [typedText, setTypedText] = useState<string>("");
  const [startTimer, setStartTimer] = useState<boolean>(false);
  const [currentTimer, setCurrentTimer] = useState<number>(parseInt(timer, 10));
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [rawWpm, setRawWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightedTextRef = useRef<HTMLDivElement>(null);

  const timeOver = async () => {
    const postData = {
      timer: String(timer),
      wpm,
      rawWpm,
      mistakes,
      accuracy: parseFloat(accuracy.toFixed(2)),
      backspaceCount,
    };

    if (!localStorage.getItem("token")) {
      localStorage.setItem("cTyped-result", JSON.stringify(postData));
      navigate("/result");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/typing/latest-typedata-insert`,
        postData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response && response.data) {
        console.log("Data inserted successfully");
        localStorage.setItem("cTyped-result", JSON.stringify(postData));
        navigate("/result");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      alert("An error occurred while saving your data. Please try again.");
    }
  };

  useEffect(() => {
    setCurrentTimer(parseInt(timer, 10));
  }, [timer]);

  useEffect(() => {
    let timerInterval: ReturnType<typeof setInterval> | undefined;

    if (startTimer && currentTimer > 0) {
      timerInterval = setInterval(() => {
        setCurrentTimer((prev) => prev - 1);
      }, 1000);
    } else if (currentTimer === 0) {
      if (timerInterval !== undefined) {
        clearInterval(timerInterval);
      }
      calculateWpm();
      timeOver();
    }

    return () => {
      if (timerInterval !== undefined) {
        clearInterval(timerInterval);
      }
    };
  }, [startTimer, currentTimer]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentTimer]);

  useEffect(() => {
    if (highlightedTextRef.current && textareaRef.current) {
      const caretSpan = highlightedTextRef.current.querySelector(
        `span:nth-child(${currentLetterIndex + 1})`
      );
      if (caretSpan) {
        const containerRect = highlightedTextRef.current.getBoundingClientRect();
        const spanRect = caretSpan.getBoundingClientRect();
        const spanLeft = spanRect.left - containerRect.left;
        const spanRight = spanRect.right - containerRect.left;
        const containerWidth = highlightedTextRef.current.clientWidth;

        // Smooth scrolling to keep caret in view
        if (spanLeft < 50 || spanRight > containerWidth - 50) {
          const scrollTarget = highlightedTextRef.current.scrollLeft + spanLeft - 50;
          highlightedTextRef.current.scrollTo({
            left: scrollTarget,
            behavior: "smooth",
          });
        }
      }
    }
  }, [currentLetterIndex]);

  const handleTyping = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const currentWord = wordToType;

    if (value.length === currentWord.length) {
      timeOver();
      return;
    }

    const inputEvent = e.nativeEvent as InputEvent;

    if (inputEvent.inputType === "deleteContentBackward") {
      setBackspaceCount((prevCount) => prevCount + 1);
    }

    setTypedText(value);

    if (!startTimer && value.length > 0) {
      setStartTimer(true);
    }

    if (
      value[currentLetterIndex] !== currentWord[currentLetterIndex] &&
      value[currentLetterIndex] !== undefined
    ) {
      setMistakes((prevCount) => prevCount + 1);
    }

    setCurrentLetterIndex(value.length);
    calculateWpm();
    calculateAccuracy(value.length, mistakes);
  };

  const calculateWpm = () => {
    const wordsTyped = typedText.split(" ").filter((word) => word.length > 0).length;
    const timeElapsed = (parseInt(timer, 10) - currentTimer) / 60;

    if (timeElapsed > 0) {
      const rawWpmCalc = Math.round(typedText.length / 5 / timeElapsed);
      const wpmCalc = Math.round(wordsTyped / timeElapsed);

      setWpm(wpmCalc);
      setRawWpm(Math.max(wpmCalc, rawWpmCalc));
    }
  };

  const calculateAccuracy = (totalTyped: number, incorrect: number) => {
    const correctTyped = totalTyped - incorrect;
    const accuracyCalc = totalTyped > 0 ? (correctTyped / totalTyped) * 100 : 100;
    setAccuracy(accuracyCalc);
  };

  const getHighlightedText = () => {
    const currentWord = wordToType;
    const typedTextArray = typedText.split("");

    return currentWord.split("").map((letter, index) => {
      let colorClass = "";

      if (index < typedTextArray.length) {
        const typedChar = typedTextArray[index];
        if (typedChar === letter) {
          colorClass = "text-green-500";
        } else if (typedChar === " " && letter !== " ") {
          colorClass = "text-red-500";
        } else if (typedChar !== letter && typedChar !== " ") {
          colorClass = "text-red-500";
        }
      } else if (letter === " " && index < typedTextArray.length) {
        colorClass = "text-red-500";
      }

      return (
        <span key={index} className={`inline ${index === currentLetterIndex ? "relative" : ""}`}>
          <span className={colorClass}>{letter}</span>
          {index === currentLetterIndex && (
            <span className="blinking-caret absolute top-[-3px] left-[-5px] text-[30px] text-[#7cf5bd]">
              |
            </span>
          )}
        </span>
      );
    });
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className={`text-3xl ms-5 text-green-200 opacity-0 ${startTimer ? "opacity-100" : ""}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {currentTimer}
      </motion.h1>
      <div className="relative text-3xl font-cursive tracking-[3px]" style={{ wordSpacing: "10px" }}>
        <textarea
          ref={textareaRef}
          value={typedText}
          onChange={handleTyping}
          className="resize-none w-full p-4 rounded-md bg-transparent text-transparent outline-none absolute top-0 left-0 z-10"
          autoFocus
          spellCheck={false}
          style={{
            height: "auto",
            minHeight: "100px", // Ensure enough height for multiple lines
            lineHeight: "1.5em",
            overflow: "hidden",
          }}
        />
        <div
          ref={highlightedTextRef}
          className="absolute top-0 left-0 w-full p-4 pointer-events-none z-0 text-white/30 whitespace-pre-wrap"
          style={{
            lineHeight: "1.5em",
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word", // Replaces deprecated wordWrap
            scrollBehavior: "smooth", // Smooth scrolling for better UX
          }}
        >
          {getHighlightedText()}
        </div>
      </div>
    </motion.div>
  );
};

export default TextArea;