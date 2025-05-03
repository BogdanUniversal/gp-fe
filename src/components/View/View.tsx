import "./view.css";
import { createContext, useContext, useRef, useState } from "react";
import Select from "react-select";
import TreeView from "./TreeView";
import CodeView from "./CodeView";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const DocumentationContext = createContext<DocumentationProps | undefined>(
  undefined
);

export const useDocumentation = (): DocumentationProps => {
  const context = useContext(DocumentationContext);
  if (context === undefined) {
    throw new Error(
      "useDocumentation must be used within a DocumentationProvider"
    );
  }
  return context;
};

const View = () => {
  const viewOptions = [
    { value: "tree", label: "Tree" },
    { value: "algorithm", label: "Algorithm" },
  ];
  const [view, setView] = useState({ value: "tree", label: "Tree" });

  const [documentation, setDocumentation] = useState<DocumentationState>({
    show: false,
    text: `
def fibonacci(n):
    \"""
    Calculate the nth Fibonacci number.
    :param n: The position in the Fibonacci sequence.
    :return: The nth Fibonacci number.
    \"""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b

def factorial(n):
    \"""
    Calculate the factorial of a number.
    :param n: The number to calculate the factorial of.
    :return: The factorial of the number.
    \"""
    if n < 0:
        raise ValueError("Factorial is not defined for negative numbers")
    elif n == 0 or n == 1:
        return 1
    else:
        result = 1
        for i in range(2, n + 1):
            result *= i
        return result

def is_prime(n):
    \"""
    Check if a number is prime.
    :param n: The number to check.
    :return: True if the number is prime, False otherwise.
    \"""
    if n <= 1:
        return False
    elif n <= 3:
        return True
    elif n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

def gcd(a, b):
    \"""
    Calculate the greatest common divisor (GCD) of two numbers.
    :param a: The first number.
    :param b: The second number.
    :return: The GCD of the two numbers.
    \"""
    while b:
        a, b = b, a % b
    return a

def lcm(a, b):
    \"""
    Calculate the least common multiple (LCM) of two numbers.
    :param a: The first number.
    :param b: The second number.
    :return: The LCM of the two numbers.
    \"""
    return abs(a * b) // gcd(a, b)
`,
  });

  const [documentationPos, setDocumentationPos] = useState({ x: 0, y: 0 });

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setDocumentation((prev) => {
      return { ...prev, show: false };
    });
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setDocumentation((prev) => {
        return { ...prev, show: true };
      });
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setDocumentation((prev) => {
        return { ...prev, show: false };
      });
    }, 700);
  };


  return (
    <DocumentationContext.Provider value={{ documentation, setDocumentation }}>
        <div
          className="view"
          onMouseMove={(e) => {
            const left = e.currentTarget.getBoundingClientRect().right;
            if (!documentation.show)
              setDocumentationPos({ x: left - e.clientX, y: e.clientY });
          }}
        >
          <div
            className={
              documentation.show
                ? "view__documentation active"
                : "view__documentation"
            }
            style={{
              right: documentationPos.x - 260,
              top: documentationPos.y - 240,
            }}
            onMouseEnter={() => {
              if (leaveTimeoutRef.current) {
                clearTimeout(leaveTimeoutRef.current);
              }
              setDocumentation((prev) => {
                return { ...prev, show: true };
              });
            }}
            onMouseLeave={handleMouseLeave}
          >
            <SyntaxHighlighter
              className="view__documentation__syntax"
              language="python"
              style={a11yDark}
              wrapLongLines={true}
            >
              {documentation.text}
            </SyntaxHighlighter>
          </div>
          <div className="view__options">
            <div className="view__options__select">
              View mode:
              <Select
                className="view__options__select__box"
                isSearchable={false}
                options={viewOptions}
                value={view}
                onChange={(option) => {
                  setView({
                    value: option?.value as string,
                    label: option?.label as string,
                  });
                }}
              />
            </div>
          </div>
          {view.value == "tree" ? (
            <TreeView
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          ) : (
            <CodeView />
          )}
        </div>

    </DocumentationContext.Provider>
  );
};

export default View;

export interface DocumentationState {
  text: string;
  show: boolean;
}

export interface DocumentationProps {
  documentation: DocumentationState;
  setDocumentation: React.Dispatch<React.SetStateAction<DocumentationState>>;
}
