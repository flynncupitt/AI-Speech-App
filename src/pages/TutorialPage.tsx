import React, { useState } from "react";
import { TutorialStep } from "../components/TutorialStep";

export interface Step {
  image: string;
  title: string;
  description: string;
}

export const tutorialSteps: Step[] = [
  {
    image:
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    title: "Welcome to AI Speech App",
    description: "Follow the tutorial to learn more about the platform.",
  },
  {
    image:
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    title: "Prompt",
    description: "Get a topic prompt to base your speech off of.",
  },
  {
    image:
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    title: "Record",
    description:
      "Once you're ready, begin recording to say your speech. Once finished, tap the record button again to finish.",
  },
  {
    image:
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    title: "Review",
    description:
      "See a detailed breakdown of your speech, and improvements to be made.",
  },
  {
    image:
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    title: "Revise",
    description:
      "Your past records are saved, and can be reviewed at any time on the saved recordings page.",
  },
];

export const TutorialPage = () => {
  const [tutStep, setTutStep] = useState(0);
  return (
    <div className="flex flex-row bg-gray-900">
      {tutStep != 0 && <button onClick={() => setTutStep(tutStep-1)}>Prev</button>}
      <TutorialStep
        image={tutorialSteps[tutStep].image}
        title={tutorialSteps[tutStep].title}
        description={tutorialSteps[tutStep].description}
      ></TutorialStep>
      {tutStep+1 < tutorialSteps.length && <button onClick={() => setTutStep(tutStep+1)}>Next</button>}
    </div>
  );
};
