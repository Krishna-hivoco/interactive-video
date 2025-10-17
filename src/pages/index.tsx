import localFont from 'next/font/local';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

const myFont = localFont({
  src: '../../src/fonts/edo.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-custom'
});

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

    ],
    duration: "17 sec"
  },
  {
    question_id: 2,
    question: "How many teaspoons of sugar should we have daily?",
    options: [
      { label: "A", text: "2-3 teaspoons", isCorrect: false },
      { label: "B", text: "4-5 teaspoons", isCorrect: true },

    ],
    duration: "27 sec"
  },
  {
    question_id: 3,
    question: "What is a healthy amount of oil to use each day?",
    options: [
      { label: "A", text: "5-6 teaspoons", isCorrect: true },
      { label: "B", text: "10-12 teaspoons", isCorrect: false },

    ],
    duration: "34 sec"
  },
  {
    question_id: 4,
    question: "What should fill half of your thali (plate)?",
    options: [

      { label: "A", text: "Fruits and vegetables", isCorrect: true },

      { label: "B", text: "Chips", isCorrect: false }
    ],
    duration: "1:27"
  },
  {
    question_id: 5,
    question: "Which is a better snack choice for good health?",
    options: [

      { label: "A", text: "Roasted chana or makhana", isCorrect: true },
      { label: "B", text: "Candies", isCorrect: false }
    ],
    duration: "1:55"
  }
];

// Convert duration string to seconds
const durationToSeconds = (duration: string): number => {
  const parts = duration.split(':');
  if (parts.length === 2) {
    // Format: "1:29"
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  } else {
    // Format: "17 sec"
    return parseInt(duration.split(' ')[0]);
  }
};

export default function TaxFilePage() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showLanguage, setShowLanguage] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [quizMounted, setQuizMounted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsLoaded(true);

    // After 2.4 seconds, hide logo and show language selection
    const timer = setTimeout(() => {
      setShowLanguage(true);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showVideo || !videoRef.current) return;

    const video = videoRef.current;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;

      // Check if we should show a quiz
      quizData.forEach((quiz, index) => {
        const quizTime = durationToSeconds(quiz.duration);

        // Show quiz when video reaches the question time (with 0.5 second tolerance)
        if (Math.abs(currentTime - quizTime) < 0.5 && currentQuestionIndex === index && !showQuiz) {
          video.pause();
          setQuizMounted(true);
          // Small delay to ensure the element is in the DOM before animating
          setTimeout(() => {
            setShowQuiz(true);
          }, 10);
          setCurrentQuestionIndex(index);
        }
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [showVideo, currentQuestionIndex, showQuiz]);

  const handleLanguageSelect = (language: string): void => {
    setSelectedLanguage(language);
    setShowVideo(true);
  };

  // const handleAnswerSelect = (label: string): void => {
  //   setSelectedAnswer(label);

  //   // Check if answer is correct and show confetti
  //   const selectedOption = currentQuestion.options.find(opt => opt.label === label);
  //   if (selectedOption?.isCorrect) {
  //     setShowConfetti(true);
  //   }

  //   // Wait 400ms after selecting answer, then automatically continue
  //   setTimeout(() => {
  //     handleNextQuestion();
  //   }, 2000);
  // };

  const handleAnswerSelect = (label: string): void => {
    // Prevent selecting another answer if one is already selected
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(label);

    // Check if answer is correct and show confetti
    const selectedOption = currentQuestion.options.find(opt => opt.label === label);
    if (selectedOption?.isCorrect) {
      setShowConfetti(true);
      // Play correct answer sound
      const correctAudio = new Audio('/music/correct.mp3');
      correctAudio.play().catch(err => console.log('Audio play failed:', err));
    } else {
      // Play wrong answer sound
      const wrongAudio = new Audio('/music/wrong.wav');
      wrongAudio.play().catch(err => console.log('Audio play failed:', err));
    }

    // Wait 400ms after selecting answer, then automatically continue
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };


  const handleNextQuestion = (): void => {
    // Start slide down animation
    setShowQuiz(false);
    setShowConfetti(false);

    // Wait for slide down animation to complete before unmounting and resuming video
    setTimeout(() => {
      setSelectedAnswer(null);
      setQuizMounted(false);

      // Only increment if not the last question
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
      else {
        setCurrentQuestionIndex(0);
      }

      // Resume video after quiz (works for all questions including the last one)
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 800);
  };

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.png')" }}
      />

      {/* Overlay for better visibility */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Center Logo with Fade-in Animation */}
      <div className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-500 ${showLanguage ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
        <Image
          src="/logo.svg"
          alt="Logo"
          width={80}
          height={80}
          className={`w-20 h-20 object-contain transition-opacity duration-1500 ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />
        <Image
          src="/logo-text.svg"
          alt="Logo"
          width={410}
          height={70}
          className={`w-64 h-64 object-contain transition-opacity duration-1500 ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />
      </div>

      {/* Language Selection Section */}
      <div className={`absolute inset-0 flex flex-col gap-8 items-center justify-center z-10 transition-opacity duration-500 ${showLanguage && !showVideo ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
        <h3 className={`text-4xl md:text-5xl font-normal uppercase ${myFont.className}`}>choose language</h3>
        <div className='flex gap-3 text-3xl font-normal'>
          <div
            onClick={() => handleLanguageSelect('hindi')}
            className='flex flex-col justify-center backdrop-blur-xs items-center gap-1 w-40 h-40 md:w-44 md:h-44 rounded-2xl bg-[#00000080] cursor-pointer hover:bg-[#00000099] transition-colors'
          >
            <strong className='text-3xl md:text-4xl font-normal'>
              अ
            </strong>
            <strong className={`font-normal text-2xl md:text-3xl ${myFont.className}`}>
              Hindi
            </strong>
          </div>
          <div
            onClick={() => handleLanguageSelect('english')}
            className='flex flex-col justify-center backdrop-blur-xs items-center gap-1 w-40 h-40 md:w-44 md:h-44 rounded-2xl bg-[#00000080] cursor-pointer hover:bg-[#00000099] transition-colors'
          >
            <strong className='text-3xl md:text-4xl font-normal'>
              Aa
            </strong>
            <strong className={`font-normal ttext-2xl md:text-3xl  ${myFont.className}`}>
              English
            </strong>
          </div>
        </div>
      </div>

      {/* Book - Top Left Corner */}
      <div
        className={`absolute top-8 left-0 w-24 h-24 transition-all duration-500 ease-in ${isLoaded && !showVideo ? 'translate-x-0 opacity-100' : '-translate-x-32 opacity-0'
          }`}
        style={{ transitionDelay: '200ms' }}
      >
        <Image fill src="/plane.svg" alt="Book" className="w-full h-full object-contain" />
      </div>

      {/* Top Center Logo (shows after language selection) */}
      <div
        className={`absolute top-10 left-[45%] w-24 h-24 transition-all duration-500 ease-in ${showLanguage && !showVideo ? 'opacity-100' : 'opacity-0'
          }`}
        style={{ transitionDelay: '200ms' }}
      >
        <Image
          src="/logo.svg"
          alt="Logo"
          width={80}
          height={80}
          className={`w-16 h-16 md:w-20 md:h-20 object-contain transition-opacity duration-1500 ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />
      </div>

      {/* Pin - Top Right Corner */}
      <div
        className={`absolute top-8 -right-2 w-24 h-24 transition-all duration-500 ease-in ${isLoaded && !showVideo ? 'translate-x-0 opacity-100' : 'translate-x-32 opacity-0'
          }`}
        style={{ transitionDelay: '400ms' }}
      >
        <Image fill src="/book.svg" alt="Pin" className="w-full h-full object-contain" />
      </div>

      {/* Plane - Bottom Left Corner */}
      <div
        className={`absolute -bottom-4 left-8 w-24 h-24 transition-all duration-500 ease-in ${isLoaded && !showVideo ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'
          }`}
        style={{ transitionDelay: '600ms' }}
      >
        <Image fill src="/star.svg" alt="Plane" className="w-full h-full object-contain" />
      </div>

      {/* Star - Bottom Right Corner */}
      <div
        className={`absolute bottom-8 -right-2 w-24 h-24 transition-all duration-500 ease-in ${isLoaded && !showVideo ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'
          }`}
        style={{ transitionDelay: '800ms' }}
      >
        <Image fill src="/loop.svg" alt="Star" className="w-full h-full object-contain" />
      </div>

      {/* Envelope - Center Bottom */}
      <div
        className={`absolute bottom-1/4 md:bottom-44 left-10 md:left-96 w-24 h-24 transition-all duration-500 ease-in ${isLoaded && !showVideo ? 'translate-x-0 opacity-100' : '-translate-x-32 opacity-0'
          }`}
        style={{ transitionDelay: '800ms' }}
      >
        <Image fill src="/envelope.svg" alt="Envelope" className="w-full h-full object-contain" />
      </div>

      <div
        className={`absolute bottom-1/5 md:bottom-2/5 right-10 md:right-96 w-24 h-24 transition-all duration-500 ease-in ${isLoaded && !showVideo ? 'translate-x-0 opacity-100' : 'translate-x-32 opacity-0'
          }`}
        style={{ transitionDelay: '800ms' }}
      >
        <Image fill src="/pin.svg" alt="Envelope" className="w-full h-full object-contain" />
      </div>

      {/* Fullscreen Video */}
      {showVideo && (
        <div className="absolute inset-0 z-20 ">
          <video
            ref={videoRef}
            onEnded={() => router.reload()}
            autoPlay
            className="w-full h-full object-contain  md:object-cover"
            src="/video.mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Quiz Overlay */}
      {(quizMounted || showQuiz) && (
        <div className={`absolute bottom-0 left-0 right-0 h-screen z-30 bg-black/80 backdrop-blur-sm transition-all duration-[600ms] ease-in ${showQuiz ? 'translate-y-0' : 'translate-y-full'
          }`}>
          
          <div className=' max-w-lg mx-auto py-20 text-center relative'>
            <div className='flex items-center justify-center'>
              <div className='flex flex-col'>
                <small className={`text-5xl ${myFont.className}`}>Quiz</small>
                <small className={`text-5xl ${myFont.className} -mr-10`}>Time</small>
              </div>
              <Image width={103} height={110} src={"/bulb.svg"} alt="bulb" />
            </div>
            <div className="relative w-full  h-full aspect-video ">
              {/* Confetti GIF - Left Side of bb.png */}
              {showConfetti && (
                <div className="absolute -left-48 top-1/2 -translate-y-1/2 w-96 h-96 z-40 pointer-events-none">
                  <Image
                    src="/Confetti.gif"
                    alt="Confetti"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Confetti GIF - Right Side of bb.png */}
              {showConfetti && (
                <div className="absolute -right-48 top-1/2 -translate-y-1/2 w-96 h-96  z-40 pointer-events-none">
                  <Image
                    src="/right.gif"
                    alt="Confetti"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Image */}
              <Image
                src="/BB.png"
                alt="Mountain landscape"
                fill
                className="object-fill rounded-lg"
                priority
              />

              {/* Text Overlay Container */}
              <div className="absolute inset-0 flex items-center justify-center p-8 ">
                <div className="text-center max-w-2xl p-5">
                  <h2 className={`text-3xl font-bold text-center mb-8 text-gray-800 ${myFont.className} text-white`}>
                    {currentQuestion.question}
                  </h2>
                </div>
              </div>
            </div>
            <div className='flex flex-col text-center gap-[10px]  justify-center items-center'>
              {currentQuestion.options.map((option) => (
                <div key={option.label} className={`w-[252] h-[84px]  rounded-xl bg-white `}>
                  <div onClick={() => handleAnswerSelect(option.label)} className={`w-[252] h-[73px] text-2xl ${myFont.className} rounded-xl  text-white flex justify-start items-center px-4 cursor-pointer ${selectedAnswer === option.label
                    ? option.isCorrect
                      ? 'bg-[#76df57] '
                      : 'bg-[#ff5e5e]'
                    : 'bg-[#cb9e6c] hover:bg-[#c79459] '}`}>
                    <span className="font-bold mr-2">{option.label}.</span> {option.text}
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
























// // // // pages/index.tsx
// // // import React, { useState, useEffect } from 'react';
// // // import { useRouter } from 'next/router';
// // // import type { NextPage } from 'next';

// // // type Language = 'hindi' | 'english';

// // // interface LanguageContent {
// // //   title: string;
// // //   description: string;
// // //   button: string;
// // // }

// // // // Home Page Component
// // // function HomePage() {
// // //   const [logoAnimated, setLogoAnimated] = useState<boolean>(false);
// // //   const [showCards, setShowCards] = useState<boolean>(false);
// // //   const router = useRouter();

// // //   useEffect(() => {
// // //     const timer = setTimeout(() => {
// // //       setLogoAnimated(true);
// // //       setTimeout(() => setShowCards(true), 400);
// // //     }, 300);

// // //     return () => clearTimeout(timer);
// // //   }, []);

// // //   const handleLanguageSelect = (language: Language) => {
// // //     router.push(`/?language=${language}`);
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
// // //       <div
// // //         className={`transition-all duration-700 ease-in 

// // //           ${
// // //           logoAnimated
// // //             ? 'transform -translate-y-[0px]'
// // //             : 'transform translate-y-[calc(50vh-100px)]'
// // //         }

// // //         `}
// // //       >
// // //         <div className="bg-gradient-to-br from-purple-500 to-blue-600 w-32 h-32 rounded-2xl flex items-center justify-center shadow-2xl">
// // //           <span className="text-white text-4xl font-bold">L</span>
// // //         </div>
// // //       </div>

// // //       <div
// // //         className={`mt-auto  mb-32 transition-all duration-500 ${
// // //           showCards
// // //             ? 'opacity-100 -translate-y-16'
// // //             : 'opacity-0 translate-y-0'
// // //         }`}
// // //       >
// // //         <h2 className="text-white text-2xl font-semibold text-center mb-6">
// // //           Choose Your Language
// // //         </h2>
// // //         <div className="flex gap-6">
// // //           <button
// // //             onClick={() => handleLanguageSelect('hindi')}
// // //             className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700 min-w-[140px]"
// // //           >
// // //             <div className="text-3xl mb-2">🇮🇳</div>
// // //             <div className="font-semibold text-lg">हिंदी</div>
// // //             <div className="text-gray-400 text-sm mt-1">Hindi</div>
// // //           </button>

// // //           <button
// // //             onClick={() => handleLanguageSelect('english')}
// // //             className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700 min-w-[140px]"
// // //           >
// // //             <div className="text-3xl mb-2">🇬🇧</div>
// // //             <div className="font-semibold text-lg">English</div>
// // //             <div className="text-gray-400 text-sm mt-1">English</div>
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // Second Screen Component
// // // interface SecondScreenProps {
// // //   language: string;
// // // }

// // // function SecondScreen({ language }: SecondScreenProps) {
// // //   const router = useRouter();

// // //   const content: Record<Language, LanguageContent> = {
// // //     hindi: {
// // //       title: 'स्वागत है',
// // //       description: 'आपने हिंदी भाषा चुनी है',
// // //       button: 'वापस जाएं'
// // //     },
// // //     english: {
// // //       title: 'Welcome',
// // //       description: 'You have selected English language',
// // //       button: 'Go Back'
// // //     }
// // //   };

// // //   const selectedContent = content[language as Language] || content.english;

// // //   return (
// // //     <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
// // //       <div className="bg-gray-800 border border-gray-700 rounded-2xl p-12 max-w-md w-full text-center shadow-2xl">
// // //         <div className="bg-gradient-to-br from-purple-500 to-blue-600 w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6">
// // //           <span className="text-white text-3xl font-bold">L</span>
// // //         </div>

// // //         <h1 className="text-white text-4xl font-bold mb-4">
// // //           {selectedContent.title}
// // //         </h1>

// // //         <p className="text-gray-400 text-lg mb-8">
// // //           {selectedContent.description}
// // //         </p>

// // //         <div className="bg-gray-700 rounded-lg p-4 mb-8">
// // //           <p className="text-gray-300 text-sm">
// // //             Language: <span className="text-purple-400 font-semibold">{language}</span>
// // //           </p>
// // //         </div>

// // //         <button
// // //           onClick={() => router.push('/')}
// // //           className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 font-semibold"
// // //         >
// // //           {selectedContent.button}
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // Main Page Component
// // // const Home: NextPage = () => {
// // //   const router = useRouter();
// // //   const { language } = router.query;

// // //   if (language && typeof language === 'string') {
// // //     return <SecondScreen language={language} />;
// // //   }

// // //   return <HomePage />;
// // // };

// // // export default Home;



// // // pages/index.tsx
// // import React, { useState, useEffect, useRef } from 'react';
// // import { useRouter } from 'next/router';
// // import type { NextPage } from 'next';
// // import Image from 'next/image';

// // type Language = 'hindi' | 'english';

// // interface LanguageContent {
// //   title: string;
// //   description: string;
// //   button: string;
// // }

// // interface Option {
// //   label: string;
// //   text: string;
// //   isCorrect: boolean;
// // }

// // interface Question {
// //   question_id: number;
// //   question: string;
// //   options: Option[];
// //   duration: string;
// // }

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

// // // Convert duration string to seconds
// // function durationToSeconds(duration: string): number {
// //   const parts = duration.toLowerCase().replace('sec', '').trim().split(':');
// //   if (parts.length === 2) {
// //     return parseInt(parts[0]) * 60 + parseInt(parts[1]);
// //   }
// //   return parseInt(parts[0]);
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
// //         className={`transition-all duration-700 ease-in ${
// //           logoAnimated
// //              ? 'transform translate-y-[70px]'
// //            : 'transform translate-y-[calc(50vh-100px)]'
// //         }`}
// //       >
// //         <div className="bg-gradient-to-br from-purple-500 to-blue-600 w-64 h-28 rounded-2xl flex items-center justify-center shadow-2xl">
// //           <Image src="/logo.webp" alt="logo" width={200} height={80}/>
// //         </div>
// //       </div>

// //       <div
// //         className={`mt-auto mb-32 transition-all duration-500 ${
// //           showCards
// //             ? 'opacity-100 -translate-y-24'
// //            : 'opacity-0 translate-y-0'
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

// // // Quiz Overlay Component
// // interface QuizOverlayProps {
// //   question: Question;
// //   onAnswer: (isCorrect: boolean) => void;
// // }

// // function QuizOverlay({ question, onAnswer }: QuizOverlayProps) {
// //   const [selectedOption, setSelectedOption] = useState<string | null>(null);

// //   const handleOptionClick = (option: Option) => {
// //     setSelectedOption(option.label);
// //     setTimeout(() => {
// //       onAnswer(option.isCorrect);
// //     }, 500);
// //   };

// //   return (
// //     <div className="absolute inset-0 flex items-end justify-end p-8 pointer-events-none z-20">
// //       <div className="animate-slide-in-right pointer-events-auto bg-gray-900/30 backdrop-blur-sm border-2 border-gray-500 rounded-2xl p-6 max-w-md shadow-2xl">
// //         <h3 className="text-white text-xl font-bold mb-4">{question.question}</h3>
// //         <div className="space-y-3">
// //           {question.options.map((option) => (
// //             <button
// //               key={option.label}
// //               onClick={() => handleOptionClick(option)}
// //               disabled={selectedOption !== null}
// //               className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
// //                 selectedOption === option.label
// //                   ? option.isCorrect
// //                     ? 'bg-green-600 border-green-400'
// //                     : 'bg-red-600 border-red-400'
// //                   : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
// //               } border-2 ${selectedOption !== null ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
// //             >
// //               <span className="text-purple-400 font-bold mr-3">{option.label}.</span>
// //               <span className="text-white">{option.text}</span>
// //             </button>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Video Player Component
// // interface SecondScreenProps {
// //   language: string;
// // }

// // function SecondScreen({ language }: SecondScreenProps) {
// //   const videoRef = useRef<HTMLVideoElement>(null);
// //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
// //   const [showQuiz, setShowQuiz] = useState<boolean>(false);
// //   const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
// //   const router = useRouter();

// //   useEffect(() => {
// //     const video = videoRef.current;
// //     if (!video) return;

// //     const handleTimeUpdate = () => {
// //       const currentTime = video.currentTime;

// //       // Check if we've reached the duration for the current question
// //       if (currentQuestionIndex < quizData.length) {
// //         const targetTime = durationToSeconds(quizData[currentQuestionIndex].duration);

// //         if (currentTime >= targetTime && !showQuiz) {
// //           video.pause();
// //           setShowQuiz(true);
// //           setVideoPlaying(false);
// //         }
// //       }
// //     };

// //     const handlePlay = () => setVideoPlaying(true);
// //     const handlePause = () => setVideoPlaying(false);

// //     video.addEventListener('timeupdate', handleTimeUpdate);
// //     video.addEventListener('play', handlePlay);
// //     video.addEventListener('pause', handlePause);

// //     return () => {
// //       video.removeEventListener('timeupdate', handleTimeUpdate);
// //       video.removeEventListener('play', handlePlay);
// //       video.removeEventListener('pause', handlePause);
// //     };
// //   }, [currentQuestionIndex, showQuiz]);

// //   const handleAnswer = (isCorrect: boolean) => {
// //     setShowQuiz(false);

// //     // Move to next question
// //     if (currentQuestionIndex < quizData.length - 1) {
// //       setCurrentQuestionIndex(currentQuestionIndex + 1);
// //     }

// //     // Resume video
// //     if (videoRef.current) {
// //       videoRef.current.play();
// //     }
// //   };

// //   const handleBackToHome = () => {
// //     router.push('/');
// //   };

// //   return (
// //     <div className="relative w-full h-screen bg-black overflow-hidden">
// //       {/* Video Player */}
// //       <video
// //         ref={videoRef}
// //         className="w-full h-full object-contain"
// //         controls
// //         autoPlay
// //       >
// //         <source src="/video.mp4" type="video/mp4" />
// //         Your browser does not support the video tag.
// //       </video>

// //       {/* Quiz Overlay */}
// //       {showQuiz && currentQuestionIndex < quizData.length && (
// //         <QuizOverlay
// //           question={quizData[currentQuestionIndex]}
// //           onAnswer={handleAnswer}
// //         />
// //       )}

// //       {/* Back Button */}
// //       <button
// //         onClick={handleBackToHome}
// //         className="absolute top-6 left-6 bg-gray-900/80 hover:bg-gray-800 text-white px-2 py-1 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-gray-700 z-30"
// //       >
// //         ← 
// //       </button>

// //       {/* Progress Indicator */}
// //       <div className="absolute top-6 right-6 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 z-30">
// //         <span className="text-white text-sm font-semibold">
// //           Question {currentQuestionIndex + 1} / {quizData.length}
// //         </span>
// //       </div>

// //       <style jsx>{`
// //         @keyframes slide-in-right {
// //           from {
// //             transform: translateX(100%);
// //             opacity: 0;
// //           }
// //           to {
// //             transform: translateX(0);
// //             opacity: 1;
// //           }
// //         }
// //         .animate-slide-in-right {
// //           animation: slide-in-right 0.5s ease-in;
// //         }
// //       `}</style>
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
//         className={`transition-all duration-700 ease-in ${
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
//   const [allQuestionsAnswered, setAllQuestionsAnswered] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const handleTimeUpdate = () => {
//       const currentTime = video.currentTime;

//       // Only check for questions if not all questions are answered
//       if (currentQuestionIndex < quizData.length && !allQuestionsAnswered) {
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
//   }, [currentQuestionIndex, showQuiz, allQuestionsAnswered]);

//   const handleAnswer = (isCorrect: boolean) => {
//     setShowQuiz(false);

//     // Check if this was the last question
//     if (currentQuestionIndex >= quizData.length - 1) {
//       setAllQuestionsAnswered(true);
//     } else {
//       // Move to next question
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
//       {showQuiz && currentQuestionIndex < quizData.length && !allQuestionsAnswered && (
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
//       {!allQuestionsAnswered && (
//         <div className="absolute top-6 right-6 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 z-30">
//           <span className="text-white text-sm font-semibold">
//             Question {currentQuestionIndex + 1} / {quizData.length}
//           </span>
//         </div>
//       )}

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
//           animation: slide-in-right 0.5s ease-in;
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



