import { useEffect, useState } from "react";

const quotes = [
  {
    text: "Focus is not about saying yes to the thing you've got to focus on. It's about saying no to the hundred other good ideas.",
    author: "Steve Jobs",
  },
  {
    text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey",
  },
  {
    text: "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.",
    author: "Alexander Graham Bell",
  },
  {
    text: "Quality is not an act, it is a habit.",
    author: "Aristotle",
  },
  {
    text: "The shorter way to do many things is to do only one thing at a time.",
    author: "Mozart",
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
  },
  {
    text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    author: "Thich Nhat Hanh",
  },
];

export const ProductivityQuote = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center space-y-4 animate-fade-in">
      <p className="text-xl md:text-2xl font-serif text-foreground italic leading-relaxed">
        "{quote.text}"
      </p>
      <p className="text-sm md:text-base text-muted-foreground font-light">
        — {quote.author}
      </p>
    </div>
  );
};
