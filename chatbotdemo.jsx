import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, ChevronRight } from "lucide-react";

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const chatEndRef = useRef(null);

  const botName = "Julie";
  const botAvatar = "/avatar.jpeg";

  // Predefined questions and responses
  const quickQuestions = [
    {
      question: "What properties are available for sale?",
      response:
        "We currently have several properties available for sale in St. John, including luxury villas, beachfront homes, and investment properties. You can view our featured properties on our website or contact us directly for a personalized tour. Would you like me to connect you with one of our agents?",
    },
    {
      question: "How much does it cost to buy property in St. John?",
      response:
        "Property prices in St. John vary significantly based on location, size, and amenities. Our current listings range from $800,000 for a 3-bedroom villa to over $1.6 million for luxury homes. We also have land available starting around $50,000. Would you like to discuss financing options?",
    },
    {
      question: "What are the property taxes in St. John?",
      response:
        "Property taxes in St. John are quite reasonable: Homes/Condos: 0.003770, Commercial: 0.007110, Timeshares: 0.014070, Land: 0.004946. There's also a transfer tax: 2% up to $350K, 3.5% above $5M. Our team can help you calculate exact taxes for any property you're interested in.",
    },
    {
      question: "Do I need a passport to visit St. John?",
      response:
        "No passport is needed for U.S. citizens to visit St. John! Since it's a U.S. territory, you can travel with just a government-issued photo ID. This makes it easy for mainland Americans to explore and invest in St. John real estate.",
    },
    {
      question: "How do I schedule a property viewing?",
      response:
        "You can schedule a property viewing in several ways: 1) Call us directly at (340) 643-6068, 2) Email us at 340realestateco@gmail.com, 3) Use our online booking system on property detail pages, or 4) WhatsApp us for quick responses. We offer flexible scheduling including weekends!",
    },
    {
      question: "What financing options are available?",
      response:
        "We offer various financing options including conventional mortgages, FHA loans, and VA loans. Local banks and credit unions in the USVI provide competitive rates. We can connect you with our preferred lenders who specialize in island properties. Would you like to discuss pre-approval?",
    },
  ];

  // Intelligent response system
  const getIntelligentResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Property-related keywords
    if (
      message.includes("property") ||
      message.includes("house") ||
      message.includes("home") ||
      message.includes("villa")
    ) {
      if (
        message.includes("sale") ||
        message.includes("buy") ||
        message.includes("purchase")
      ) {
        return "We have several properties available for sale in St. John! Our current listings include luxury villas, beachfront homes, and investment properties. Would you like me to connect you with one of our agents for a personalized tour?";
      }
      if (message.includes("rent") || message.includes("rental")) {
        return "We also offer villa rentals in St. John! Our rental properties range from cozy cottages to luxury estates. You can view our rental listings on our website or contact us for availability and booking.";
      }
    }

    // Price-related keywords
    if (
      message.includes("price") ||
      message.includes("cost") ||
      message.includes("expensive") ||
      message.includes("cheap")
    ) {
      return "Property prices in St. John vary based on location and amenities. Our current listings range from $800,000 to over $1.6 million. We also have land available starting around $50,000. Would you like to discuss specific properties or financing options?";
    }

    // Location-related keywords
    if (
      message.includes("location") ||
      message.includes("area") ||
      message.includes("neighborhood") ||
      message.includes("coral bay") ||
      message.includes("cruz bay")
    ) {
      return "St. John offers diverse locations! Cruz Bay is the main town with restaurants and shops, Coral Bay is more laid-back, and Chocolate Hole offers stunning views. Each area has its unique charm. What type of location interests you most?";
    }

    // Contact-related keywords
    if (
      message.includes("contact") ||
      message.includes("call") ||
      message.includes("phone") ||
      message.includes("email") ||
      message.includes("reach")
    ) {
      return "You can reach us at (340) 643-6068 or email us at 340realestateco@gmail.com. We're also available on WhatsApp for quick responses. Our team is here to help with all your St. John real estate needs!";
    }

    // Tax-related keywords
    if (
      message.includes("tax") ||
      message.includes("taxes") ||
      message.includes("property tax")
    ) {
      return "Property taxes in St. John are quite reasonable: Homes/Condos: 0.003770, Commercial: 0.007110, Timeshares: 0.014070, Land: 0.004946. Transfer tax is 2% up to $350K, 3.5% above $5M. We can help calculate exact taxes for any property.";
    }

    // Viewing-related keywords
    if (
      message.includes("view") ||
      message.includes("tour") ||
      message.includes("visit") ||
      message.includes("see")
    ) {
      return "We'd love to show you around! You can schedule a property viewing by calling (340) 643-6068, using our online booking system, or WhatsApp us. We offer flexible scheduling including weekends and can arrange virtual tours too.";
    }

    // Default response
    return "Thank you for your message! I'm here to help with all your St. John real estate questions. You can also call us directly at (340) 643-6068 or email 340realestateco@gmail.com for immediate assistance. Is there anything specific about St. John properties you'd like to know?";
  };

  // Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Stream intro message on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const intro =
        "Hi there! Julie. How can I help you with St. John properties today?";
      let index = 0;
      let stream = "";
      const interval = setInterval(() => {
        stream += intro.charAt(index);
        index++;
        if (index >= intro.length) clearInterval(interval);
        setMessages([{ sender: botName, text: stream }]);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { sender: "You", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowQuickQuestions(false);

    // Intelligent bot response
    setTimeout(() => {
      const botResponse = {
        sender: botName,
        text: getIntelligentResponse(input.trim()),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickQuestion = (question, response) => {
    const userMsg = { sender: "You", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setShowQuickQuestions(false);

    setTimeout(() => {
      const botResponse = {
        sender: botName,
        text: response,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  return (
    <>
      {/* Chatbox */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3c6a72] to-[#2d5a62] text-white px-6 py-4 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={botAvatar}
                alt="Bot Avatar"
                className="w-10 h-10 rounded-full border-2 border-white/20"
              />
              <div>
                <div className="font-semibold text-lg">{botName}</div>
                <div className="text-xs text-white/80">Online</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/13406436068"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png?20220228223904"
                  alt="WhatsApp"
                  className="w-5 h-5"
                />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "You" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender !== "You" && (
                  <img
                    src={botAvatar}
                    alt="Bot Avatar"
                    className="w-8 h-8 rounded-full mr-3 self-start flex-shrink-0"
                  />
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line shadow-sm ${
                    msg.sender === "You"
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                  }`}
                >
                  <div className="text-xs opacity-70 mb-1">
                    {msg.sender === "You" ? "You" : botName}
                  </div>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Quick Questions */}
            {showQuickQuestions && messages.length === 1 && (
              <div className="space-y-3">
                <div className="text-xs text-gray-500 font-medium mb-3 text-center">
                  💬 Quick Questions
                </div>
                {quickQuestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handleQuickQuestion(item.question, item.response)
                    }
                    className="w-full text-left p-4 bg-white hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 text-sm shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">
                        {item.question}
                      </span>
                      <ChevronRight size={16} className="text-blue-500" />
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 bg-white p-1 sm:p-2 rounded-full shadow-lg border border-gray-200 hover:shadow-xl ring-1 ring-blue-500/30 hover:ring-blue-500 transition-all duration-300 group"
        aria-label="Chat with 340RealEstateStJohn"
        title="Chat with 340RealEstateStJohn"
      >
        <img
          src={botAvatar}
          alt="Chatbot Assistant"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </button>
    </>
  );
};

export default ChatbotButton;
