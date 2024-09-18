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
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center">
        <button
        className={`bg-gray-500 h-[20vh] ${tutStep != 0 ? "opacity-100" : "opacity-20"}`}
        onClick={() => setTutStep(tutStep - 1)}
        disabled={!(tutStep != 0)}
        >
          {
            <img
              src="https://www.svgrepo.com/show/67833/left-arrow.svg"
              className="w-10 h-10"
            ></img>
          }
        </button>
      <TutorialStep
        image={tutorialSteps[tutStep].image}
        title={tutorialSteps[tutStep].title}
        description={tutorialSteps[tutStep].description}
      ></TutorialStep>
        <button
          className={`bg-gray-500 h-[20vh] ${tutStep + 1 < tutorialSteps.length ? "opacity-100" : "opacity-20"}`}
          onClick={() => setTutStep(tutStep + 1)}
          disabled={!(tutStep + 1 < tutorialSteps.length)}
        >
          {
            <img
              src="https://www.svgrepo.com/show/27797/right-arrow.svg"
              className="w-10 h-10"
            ></img>
          }
        </button>
    </div>
    </div>
  );
};
