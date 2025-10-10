// // // pages/index.tsx
// // import React, { useState, useEffect } from 'react';
// // import { useRouter } from 'next/router';
// // import type { NextPage } from 'next';

// // type Language = 'hindi' | 'english';

// // interface LanguageContent {
// //   title: string;
// //   description: string;
// //   button: string;
// // }

// // // Home Page Component
// // function HomePage() {
// //   const [logoAnimated, setLogoAnimated] = useState<boolean>(false);
// //   const [showCards, setShowCards] = useState<boolean>(false);
// //   const router = useRouter();

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       setLogoAnimated(true);
// //       setTimeout(() => setShowCards(true), 400);
// //     }, 300);

// //     return () => clearTimeout(timer);
// //   }, []);

// //   const handleLanguageSelect = (language: Language) => {
// //     router.push(`/?language=${language}`);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
// //       <div
// //         className={`transition-all duration-700 ease-out 
          
// //           ${
// //           logoAnimated
// //             ? 'transform -translate-y-[0px]'
// //             : 'transform translate-y-[calc(50vh-100px)]'
// //         }
        
// //         `}
// //       >
// //         <div className="bg-gradient-to-br from-purple-500 to-blue-600 w-32 h-32 rounded-2xl flex items-center justify-center shadow-2xl">
// //           <span className="text-white text-4xl font-bold">L</span>
// //         </div>
// //       </div>

// //       <div
// //         className={`mt-auto  mb-32 transition-all duration-500 ${
// //           showCards
// //             ? 'opacity-100 -translate-y-16'
// //             : 'opacity-0 translate-y-0'
// //         }`}
// //       >
// //         <h2 className="text-white text-2xl font-semibold text-center mb-6">
// //           Choose Your Language
// //         </h2>
// //         <div className="flex gap-6">
// //           <button
// //             onClick={() => handleLanguageSelect('hindi')}
// //             className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700 min-w-[140px]"
// //           >
// //             <div className="text-3xl mb-2">🇮🇳</div>
// //             <div className="font-semibold text-lg">हिंदी</div>
// //             <div className="text-gray-400 text-sm mt-1">Hindi</div>
// //           </button>

// //           <button
// //             onClick={() => handleLanguageSelect('english')}
// //             className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700 min-w-[140px]"
// //           >
// //             <div className="text-3xl mb-2">🇬🇧</div>
// //             <div className="font-semibold text-lg">English</div>
// //             <div className="text-gray-400 text-sm mt-1">English</div>
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Second Screen Component
// // interface SecondScreenProps {
// //   language: string;
// // }

// // function SecondScreen({ language }: SecondScreenProps) {
// //   const router = useRouter();

// //   const content: Record<Language, LanguageContent> = {
// //     hindi: {
// //       title: 'स्वागत है',
// //       description: 'आपने हिंदी भाषा चुनी है',
// //       button: 'वापस जाएं'
// //     },
// //     english: {
// //       title: 'Welcome',
// //       description: 'You have selected English language',
// //       button: 'Go Back'
// //     }
// //   };

// //   const selectedContent = content[language as Language] || content.english;

// //   return (
// //     <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
// //       <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 max-w-md w-full text-center shadow-2xl">
// //         <div className="bg-gradient-to-br from-purple-500 to-blue-600 w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6">
// //           <span className="text-white text-3xl font-bold">L</span>
// //         </div>
        
// //         <h1 className="text-white text-4xl font-bold mb-4">
// //           {selectedContent.title}
// //         </h1>
        
// //         <p className="text-gray-400 text-lg mb-8">
// //           {selectedContent.description}
// //         </p>

// //         <div className="bg-gray-700 rounded-lg p-4 mb-8">
// //           <p className="text-gray-300 text-sm">
// //             Language: <span className="text-purple-400 font-semibold">{language}</span>
// //           </p>
// //         </div>
        
// //         <button
// //           onClick={() => router.push('/')}
// //           className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 font-semibold"
// //         >
// //           {selectedContent.button}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // // Main Page Component
// // const Home: NextPage = () => {
// //   const router = useRouter();
// //   const { language } = router.query;

// //   if (language && typeof language === 'string') {
// //     return <SecondScreen language={language} />;
// //   }

// //   return <HomePage />;
// // };

// // export default Home;



// // pages/index.tsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/router';
// import type { NextPage } from 'next';
// import Image from 'next/image';

// type Language = 'hindi' | 'english';

// interface LanguageContent {
//   title: string;
//   description: string;
//   button: string;
// }

// interface Option {
//   label: string;
//   text: string;
//   isCorrect: boolean;
// }

// interface Question {
//   question_id: number;
//   question: string;
//   options: Option[];
//   duration: string;
// }

// const quizData: Question[] = [
//   {
//     question_id: 1,
//     question: "How much salt should we eat every day?",
//     options: [
//       { label: "A", text: "One cup", isCorrect: false },
//       { label: "B", text: "One teaspoon", isCorrect: true },
//       { label: "C", text: "One tablespoon", isCorrect: false },
//       { label: "D", text: "As much as we like", isCorrect: false }
//     ],
//     duration: "17 sec"
//   },
//   {
//     question_id: 2,
//     question: "How many teaspoons of sugar should we have daily?",
//     options: [
//       { label: "A", text: "2–3 teaspoons", isCorrect: false },
//       { label: "B", text: "4–5 teaspoons", isCorrect: true },
//       { label: "C", text: "10 teaspoons", isCorrect: false },
//       { label: "D", text: "No limit", isCorrect: false }
//     ],
//     duration: "26 sec"
//   },
//   {
//     question_id: 3,
//     question: "What is a healthy amount of oil to use each day?",
//     options: [
//       { label: "A", text: "5–6 teaspoons", isCorrect: true },
//       { label: "B", text: "10–12 teaspoons", isCorrect: false },
//       { label: "C", text: "Just one teaspoon", isCorrect: false },
//       { label: "D", text: "Any amount you want", isCorrect: false }
//     ],
//     duration: "33 sec"
//   },
//   {
//     question_id: 4,
//     question: "What should fill half of your thali (plate)?",
//     options: [
//       { label: "A", text: "Rice and rotis", isCorrect: false },
//       { label: "B", text: "Fruits and vegetables", isCorrect: true },
//       { label: "C", text: "Chocolates", isCorrect: false },
//       { label: "D", text: "Chips", isCorrect: false }
//     ],
//     duration: "1:29"
//   },
//   {
//     question_id: 5,
//     question: "Which is a better snack choice for good health?",
//     options: [
//       { label: "A", text: "Packaged chips", isCorrect: false },
//       { label: "B", text: "Soft drinks", isCorrect: false },
//       { label: "C", text: "Roasted chana or makhana", isCorrect: true },
//       { label: "D", text: "Candies", isCorrect: false }
//     ],
//     duration: "1:54"
//   }
// ];

// // Convert duration string to seconds
// function durationToSeconds(duration: string): number {
//   const parts = duration.toLowerCase().replace('sec', '').trim().split(':');
//   if (parts.length === 2) {
//     return parseInt(parts[0]) * 60 + parseInt(parts[1]);
//   }
//   return parseInt(parts[0]);
// }

// // Home Page Component
// function HomePage() {
//   const [logoAnimated, setLogoAnimated] = useState<boolean>(false);
//   const [showCards, setShowCards] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLogoAnimated(true);
//       setTimeout(() => setShowCards(true), 400);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleLanguageSelect = (language: Language) => {
//     router.push(`/?language=${language}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
//       <div
//         className={`transition-all duration-700 ease-out ${
//           logoAnimated
//              ? 'transform translate-y-[70px]'
//            : 'transform translate-y-[calc(50vh-100px)]'
//         }`}
//       >
//         <div className="bg-gradient-to-br from-purple-500 to-blue-600 w-64 h-28 rounded-2xl flex items-center justify-center shadow-2xl">
//           <Image src="/logo.webp" alt="logo" width={200} height={80}/>
//         </div>
//       </div>

//       <div
//         className={`mt-auto mb-32 transition-all duration-500 ${
//           showCards
//             ? 'opacity-100 -translate-y-24'
//            : 'opacity-0 translate-y-0'
//         }`}
//       >
//         <h2 className="text-white text-2xl font-semibold text-center mb-6">
//           Choose Your Language
//         </h2>
//         <div className="flex gap-6">
//           <button
//             onClick={() => handleLanguageSelect('hindi')}
//             className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700 min-w-[140px]"
//           >
//             <div className="text-3xl mb-2">🇮🇳</div>
//             <div className="font-semibold text-lg">हिंदी</div>
//             <div className="text-gray-400 text-sm mt-1">Hindi</div>
//           </button>

//           <button
//             onClick={() => handleLanguageSelect('english')}
//             className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700 min-w-[140px]"
//           >
//             <div className="text-3xl mb-2">🇬🇧</div>
//             <div className="font-semibold text-lg">English</div>
//             <div className="text-gray-400 text-sm mt-1">English</div>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Quiz Overlay Component
// interface QuizOverlayProps {
//   question: Question;
//   onAnswer: (isCorrect: boolean) => void;
// }

// function QuizOverlay({ question, onAnswer }: QuizOverlayProps) {
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);

//   const handleOptionClick = (option: Option) => {
//     setSelectedOption(option.label);
//     setTimeout(() => {
//       onAnswer(option.isCorrect);
//     }, 500);
//   };

//   return (
//     <div className="absolute inset-0 flex items-end justify-end p-8 pointer-events-none z-20">
//       <div className="animate-slide-in-right pointer-events-auto bg-gray-900/30 backdrop-blur-sm border-2 border-gray-500 rounded-2xl p-6 max-w-md shadow-2xl">
//         <h3 className="text-white text-xl font-bold mb-4">{question.question}</h3>
//         <div className="space-y-3">
//           {question.options.map((option) => (
//             <button
//               key={option.label}
//               onClick={() => handleOptionClick(option)}
//               disabled={selectedOption !== null}
//               className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
//                 selectedOption === option.label
//                   ? option.isCorrect
//                     ? 'bg-green-600 border-green-400'
//                     : 'bg-red-600 border-red-400'
//                   : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
//               } border-2 ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
//             >
//               <span className="text-purple-400 font-bold mr-3">{option.label}.</span>
//               <span className="text-white">{option.text}</span>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Video Player Component
// interface SecondScreenProps {
//   language: string;
// }

// function SecondScreen({ language }: SecondScreenProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
//   const [showQuiz, setShowQuiz] = useState<boolean>(false);
//   const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const handleTimeUpdate = () => {
//       const currentTime = video.currentTime;
      
//       // Check if we've reached the duration for the current question
//       if (currentQuestionIndex < quizData.length) {
//         const targetTime = durationToSeconds(quizData[currentQuestionIndex].duration);
        
//         if (currentTime >= targetTime && !showQuiz) {
//           video.pause();
//           setShowQuiz(true);
//           setVideoPlaying(false);
//         }
//       }
//     };

//     const handlePlay = () => setVideoPlaying(true);
//     const handlePause = () => setVideoPlaying(false);

//     video.addEventListener('timeupdate', handleTimeUpdate);
//     video.addEventListener('play', handlePlay);
//     video.addEventListener('pause', handlePause);

//     return () => {
//       video.removeEventListener('timeupdate', handleTimeUpdate);
//       video.removeEventListener('play', handlePlay);
//       video.removeEventListener('pause', handlePause);
//     };
//   }, [currentQuestionIndex, showQuiz]);

//   const handleAnswer = (isCorrect: boolean) => {
//     setShowQuiz(false);
    
//     // Move to next question
//     if (currentQuestionIndex < quizData.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
    
//     // Resume video
//     if (videoRef.current) {
//       videoRef.current.play();
//     }
//   };

//   const handleBackToHome = () => {
//     router.push('/');
//   };

//   return (
//     <div className="relative w-full h-screen bg-black overflow-hidden">
//       {/* Video Player */}
//       <video
//         ref={videoRef}
//         className="w-full h-full object-contain"
//         controls
//         autoPlay
//       >
//         <source src="/video.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

//       {/* Quiz Overlay */}
//       {showQuiz && currentQuestionIndex < quizData.length && (
//         <QuizOverlay
//           question={quizData[currentQuestionIndex]}
//           onAnswer={handleAnswer}
//         />
//       )}

//       {/* Back Button */}
//       <button
//         onClick={handleBackToHome}
//         className="absolute top-6 left-6 bg-gray-900/80 hover:bg-gray-800 text-white px-2 py-1 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-gray-700 z-30"
//       >
//         ← 
//       </button>

//       {/* Progress Indicator */}
//       <div className="absolute top-6 right-6 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 z-30">
//         <span className="text-white text-sm font-semibold">
//           Question {currentQuestionIndex + 1} / {quizData.length}
//         </span>
//       </div>

//       <style jsx>{`
//         @keyframes slide-in-right {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide-in-right {
//           animation: slide-in-right 0.5s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }

// // Main Page Component
// const Home: NextPage = () => {
//   const router = useRouter();
//   const { language } = router.query;

//   if (language && typeof language === 'string') {
//     return <SecondScreen language={language} />;
//   }

//   return <HomePage />;
// };

// export default Home;



// pages/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import Image from 'next/image';

type Language = 'hindi' | 'english';

interface LanguageContent {
  title: string;
  description: string;
  button: string;
}

interface Option {
  label: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  question_id: number;
  question: string;
  options: Option[];
  duration: string;
}

const quizData: Question[] = [
  {
    question_id: 1,
    question: "How much salt should we eat every day?",
    options: [
      { label: "A", text: "One cup", isCorrect: false },
      { label: "B", text: "One teaspoon", isCorrect: true },
      { label: "C", text: "One tablespoon", isCorrect: false },
      { label: "D", text: "As much as we like", isCorrect: false }
    ],
    duration: "17 sec"
  },
  {
    question_id: 2,
    question: "How many teaspoons of sugar should we have daily?",
    options: [
      { label: "A", text: "2–3 teaspoons", isCorrect: false },
      { label: "B", text: "4–5 teaspoons", isCorrect: true },
      { label: "C", text: "10 teaspoons", isCorrect: false },
      { label: "D", text: "No limit", isCorrect: false }
    ],
    duration: "26 sec"
  },
  {
    question_id: 3,
    question: "What is a healthy amount of oil to use each day?",
    options: [
      { label: "A", text: "5–6 teaspoons", isCorrect: true },
      { label: "B", text: "10–12 teaspoons", isCorrect: false },
      { label: "C", text: "Just one teaspoon", isCorrect: false },
      { label: "D", text: "Any amount you want", isCorrect: false }
    ],
    duration: "33 sec"
  },
  {
    question_id: 4,
    question: "What should fill half of your thali (plate)?",
    options: [
      { label: "A", text: "Rice and rotis", isCorrect: false },
      { label: "B", text: "Fruits and vegetables", isCorrect: true },
      { label: "C", text: "Chocolates", isCorrect: false },
      { label: "D", text: "Chips", isCorrect: false }
    ],
    duration: "1:29"
  },
  {
    question_id: 5,
    question: "Which is a better snack choice for good health?",
    options: [
      { label: "A", text: "Packaged chips", isCorrect: false },
      { label: "B", text: "Soft drinks", isCorrect: false },
      { label: "C", text: "Roasted chana or makhana", isCorrect: true },
      { label: "D", text: "Candies", isCorrect: false }
    ],
    duration: "1:54"
  }
];

// Convert duration string to seconds
function durationToSeconds(duration: string): number {
  const parts = duration.toLowerCase().replace('sec', '').trim().split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return parseInt(parts[0]);
}

// Home Page Component
function HomePage() {
  const [logoAnimated, setLogoAnimated] = useState<boolean>(false);
  const [showCards, setShowCards] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoAnimated(true);
      setTimeout(() => setShowCards(true), 400);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleLanguageSelect = (language: Language) => {
    router.push(`/?language=${language}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div
        className={`transition-all duration-700 ease-out ${
          logoAnimated
             ? 'transform translate-y-[70px]'
           : 'transform translate-y-[calc(50vh-100px)]'
        }`}
      >
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 w-64 h-28 rounded-2xl flex items-center justify-center shadow-2xl">
          <Image src="/logo.webp" alt="logo" width={200} height={80}/>
        </div>
      </div>

      <div
        className={`mt-auto mb-32 transition-all duration-500 ${
          showCards
            ? 'opacity-100 -translate-y-24'
           : 'opacity-0 translate-y-0'
        }`}
      >
        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          Choose Your Language
        </h2>
        <div className="flex gap-6">
          <button
            onClick={() => handleLanguageSelect('hindi')}
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700 min-w-[140px]"
          >
            <div className="text-3xl mb-2">🇮🇳</div>
            <div className="font-semibold text-lg">हिंदी</div>
            <div className="text-gray-400 text-sm mt-1">Hindi</div>
          </button>

          <button
            onClick={() => handleLanguageSelect('english')}
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700 min-w-[140px]"
          >
            <div className="text-3xl mb-2">🇬🇧</div>
            <div className="font-semibold text-lg">English</div>
            <div className="text-gray-400 text-sm mt-1">English</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Quiz Overlay Component
interface QuizOverlayProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

function QuizOverlay({ question, onAnswer }: QuizOverlayProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option.label);
    setTimeout(() => {
      onAnswer(option.isCorrect);
    }, 500);
  };

  return (
    <div className="absolute inset-0 flex items-end justify-end p-8 pointer-events-none z-20">
      <div className="animate-slide-in-right pointer-events-auto bg-gray-900/30 backdrop-blur-sm border-2 border-gray-500 rounded-2xl p-6 max-w-md shadow-2xl">
        <h3 className="text-white text-xl font-bold mb-4">{question.question}</h3>
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.label}
              onClick={() => handleOptionClick(option)}
              disabled={selectedOption !== null}
              className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                selectedOption === option.label
                  ? option.isCorrect
                    ? 'bg-green-600 border-green-400'
                    : 'bg-red-600 border-red-400'
                  : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
              } border-2 ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
            >
              <span className="text-purple-400 font-bold mr-3">{option.label}.</span>
              <span className="text-white">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Video Player Component
interface SecondScreenProps {
  language: string;
}

function SecondScreen({ language }: SecondScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      
      // Only check for questions if not all questions are answered
      if (currentQuestionIndex < quizData.length && !allQuestionsAnswered) {
        const targetTime = durationToSeconds(quizData[currentQuestionIndex].duration);
        
        if (currentTime >= targetTime && !showQuiz) {
          video.pause();
          setShowQuiz(true);
          setVideoPlaying(false);
        }
      }
    };

    const handlePlay = () => setVideoPlaying(true);
    const handlePause = () => setVideoPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [currentQuestionIndex, showQuiz, allQuestionsAnswered]);

  const handleAnswer = (isCorrect: boolean) => {
    setShowQuiz(false);
    
    // Check if this was the last question
    if (currentQuestionIndex >= quizData.length - 1) {
      setAllQuestionsAnswered(true);
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    
    // Resume video
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video Player */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        autoPlay
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Quiz Overlay */}
      {showQuiz && currentQuestionIndex < quizData.length && !allQuestionsAnswered && (
        <QuizOverlay
          question={quizData[currentQuestionIndex]}
          onAnswer={handleAnswer}
        />
      )}

      {/* Back Button */}
      <button
        onClick={handleBackToHome}
        className="absolute top-6 left-6 bg-gray-900/80 hover:bg-gray-800 text-white px-2 py-1 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-gray-700 z-30"
      >
        ← 
      </button>

      {/* Progress Indicator */}
      {!allQuestionsAnswered && (
        <div className="absolute top-6 right-6 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 z-30">
          <span className="text-white text-sm font-semibold">
            Question {currentQuestionIndex + 1} / {quizData.length}
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// Main Page Component
const Home: NextPage = () => {
  const router = useRouter();
  const { language } = router.query;

  if (language && typeof language === 'string') {
    return <SecondScreen language={language} />;
  }

  return <HomePage />;
};

export default Home;