import React from "react";

interface Props {
  image: string;
  title: string;
  description: string;
}

export const TutorialStep = ({ image, title, description }: Props) => {
  return (
      <div className="flex flex-col items-center py-8">
        <img src={image} className="w-4/12 rounded-xl"></img>
        <p className="text-lg font-bold">{title}</p>
        <p>{description}</p>
      </div>
  );
};
