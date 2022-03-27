import { classes } from "./imagenetClasses";

export default function getMostLikelyClassNames(classLikelihoods) {
  return classLikelihoods.map(getMostLikelyClassName).filter((className) => {
    return (
      ["bottle", "can", "plastic bag"].includes(className) ||
      className.includes("plastic")
    );
  });
}

function getMostLikelyClassName(classLikelihoods) {
  let maxIndex = 0;
  let maxValue = classLikelihoods[0];
  for (let i = 1; i < classLikelihoods.length; i++) {
    if (classLikelihoods[i] > maxValue) {
      maxIndex = i;
      maxValue = classLikelihoods[i];
    }
  }

  return classes[maxIndex];
}
