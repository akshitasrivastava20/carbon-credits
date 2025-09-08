import { TypewriterEffectSmooth } from '@/components/ui/typewriter-effect';

export default function TypewriterEffectSection() {
  const greenWords = [
    {
      text: "Start",
      className: "text-green-800 dark:text-green-800 text-2xl md:text-4xl lg:text-5xl font-bold",
    },
    {
      text: "Your",
      className: "text-green-800 dark:text-green-800 text-2xl md:text-4xl lg:text-5xl font-bold",
    },
    {
      text: "Sustainability",
      className: "text-green-800 dark:text-green-800 text-2xl md:text-4xl lg:text-5xl font-bold",
    },
    {
      text: "Journey",
      className: "text-green-800 dark:text-green-800 text-2xl md:text-4xl lg:text-5xl font-bold",
    },
  ];

  const blueWords = [
    {
      text: "Get",
      className: "text-blue-800 dark:text-blue-800 text-2xl md:text-4xl lg:text-5xl font-bold",
    },
    {
      text: "Your",
      className: "text-blue-800 dark:text-blue-800 text-2xl md:text-4xl lg:text-5xl font-bold",
    },
    {
      text: "Credit",
      className: "text-blue-800 dark:text-blue-800 text-2xl md:text-4xl lg:text-5xl font-bold",
    },
    {
      text: "Estimate!",
      className: "text-blue-800 dark:text-blue-800 text-2xl md:text-4xl lg:text-5xl font-bold",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="text-center space-y-2">
        <TypewriterEffectSmooth words={greenWords} />
        <TypewriterEffectSmooth words={blueWords} />
      </div>
    </div>
  );
}
