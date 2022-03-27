import { classes } from "./imagenetClasses";

export default function getMostLikelyClassNames(classLikelihoods) {
  console.log(classLikelihoods);

  return classLikelihoods.map(getMostLikelyClassName);
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
