import { classes } from "./imagenetClasses";

export default function getMostLikelyClassNames(classLikelihoods) {
  return classLikelihoods.map(getMostLikelyClassName).filter(Boolean);
}

function getMostLikelyClassName(classLikelihoods) {
  let maxIndex = -1;
  let maxValue = -1;
  for (let i = 1; i < classLikelihoods.length; i++) {
    const className = classes[i];
    const allowable =
      ["bottle", "can", "plastic bag"].includes(className) ||
      className.includes("plastic");
    if (classLikelihoods[i] > maxValue && allowable) {
      maxIndex = i;
      maxValue = classLikelihoods[i];
    }
  }

  if (maxIndex === -1) {
    return null;
  }

  return classes[maxIndex];
}
