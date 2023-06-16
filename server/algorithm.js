
export default function resultFunc({a, b, operation}) {
  if (operation === "sum") {
    return a + b;
  } else if (operation === "subtract") {
    return a - b;
  } else {
    throw new Error("Invalid operation");
  }
}
