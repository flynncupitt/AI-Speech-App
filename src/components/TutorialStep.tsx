import React from "react";

interface Props {
  image: string;
  title: string;
  description: string;
}

export const TutorialStep = ({ image, title, description }: Props) => {
  return (
    <div className="flex flex-col items-center py-8">
      {(image != "none") && 
      <img
      src={image}
      className="w-full max-w-[600px] h-auto object-cover rounded-xl drop-shadow-[0_10px_10px_rgba(255,255,255,0.05)]"
      alt={title}
    />
      }
      
      <p className="text-lg sm:text-xl font-bold pt-4 sm:pt-8 text-center">{title}</p>
      <p className="text-sm sm:text-base text-center px-4">{description}</p>
    </div>
  );
};

