export const useFormWizard = () => {
  const handleComplete = () => {
    console.log("Form completed!");
  };
  const tabChanged = ({
    prevIndex,
    nextIndex,
  }: {
    prevIndex: number;
    nextIndex: number;
  }) => {
    console.log("prevIndex", prevIndex);
    console.log("nextIndex", nextIndex);
  };

  return { handleComplete, tabChanged };
};
