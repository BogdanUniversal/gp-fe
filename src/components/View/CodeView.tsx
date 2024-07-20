import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeView = () => {
  const pythonCode = `
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
`;
  return (
    <div className="view__code">
      <SyntaxHighlighter className="view__code__syntax" language="python" style={a11yDark}>
        {pythonCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeView;
