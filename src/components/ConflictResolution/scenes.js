export const conflictScenes = [
    {
      id: 1,
      background: "/assets/bg-classroom.jpg",
      character1: {
        name: "Kwame",
        avatar: "/Kwame.png",
        emotion: "angry",
      },
      character2: {
        name: "Abena",
        avatar: "/Abena.png",
        emotion: "sad",
      },
      story: "Kwame and Abena both want to use the chalkboard at the same time.",
      options: [
        { text: "Take turns", correct: true },
        { text: "Argue and shout", correct: false },
      ],
      successFeedback: "Well done! Taking turns shows respect.",
      failFeedback: "Oops! Let's try a better way to solve this.",
    },
  ];
  