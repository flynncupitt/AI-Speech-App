import React, { useState } from "react";
import { TutorialStep } from "../components/TutorialStep";
import logo from "../assets/app-logo.png";
import tutPrompt from "../assets/tutPrompt.png";
import tutRec from "../assets/tutRec.png";
import tutReview from "../assets/tutReview.png";
import tutGoals from "../assets/tutGoals.png";
import tutDashboard from "../assets/tutDashboard.png";


export interface Step {
  image: string;
  title: string;
  description: string;
}

export const tutorialSteps: Step[] = [
  {
    image: logo,
    title: "Welcome to Clarity",
    description: "Follow the tutorial to learn more about the platform.",
  },
  {
    image:
      tutPrompt,
    title: "Prompt",
    description: "Get a topic prompt to base your speech off of. You can choose between short, medium and long prompts to determine the length of your speech.",
  },
  {
    image:
      tutRec,
    title: "Record",
    description:
      "Once you're ready, begin recording to say your speech. Once finished, tap the record button again to finish.",
  },
  {
    image:
      tutReview,
    title: "Review",
    description:
      "All your recordings are saved in your account. You can review these at any time.",
  },
  {
    image:
      tutGoals,
    title: "Goals",
    description:
      "Set goals, keep track, improve. Use the goal tracker to set yourself speech related goals, ticking off tasks as you progress.",
  },
  {
    image:
      tutDashboard,
    title: "Progress",
    description:
      "See your recording statistics on the dashboard, giving you an overview of your progress on demand.",
  },
];

export const TutorialPage = () => {
  const [tutStep, setTutStep] = useState(0);
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center">
        <button
          className={`bg-gray-500 h-[20vh] ${
            tutStep != 0 ? "opacity-100" : "opacity-20"
          }`}
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
          className={`bg-gray-500 h-[20vh] ${
            tutStep + 1 < tutorialSteps.length ? "opacity-100" : "opacity-20"
          }`}
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
