import { AnimatePresence, motion } from 'framer-motion';
import {
  MessageCircle,
  X,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  AlertTriangle
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader } from './ui/card';

// Error Boundary Component
class ChatbotErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chatbot Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <AlertTriangle className="w-6 h-6 text-white" />
          </Button>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// 3D Actor Component using react-three-fiber
const ChatbotActor = ({ isSpeaking, emotion, message }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      // Simple animation based on speaking state
      const animate = () => {
        if (isSpeaking) {
          meshRef.current.rotation.y += 0.01;
          meshRef.current.position.y = Math.sin(Date.now() * 0.005) * 0.1;
        }
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, [isSpeaking]);

  return (
    <div className="w-24 h-24 mx-auto mb-4 relative">
      {/* Tribal Avatar Representation */}
      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-600 to-amber-800 relative overflow-hidden">
        {/* Face */}
        <div className="absolute inset-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full">
          {/* Eyes */}
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-black rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-black rounded-full"></div>

          {/* Mouth - changes based on emotion */}
          <div className={`absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-3 h-1 border-b-2 border-black rounded-full ${
            emotion === 'happy' ? 'border-b-4' :
            emotion === 'sad' ? 'border-t-2 border-b-0' :
            'border-b-2'
          }`}></div>

          {/* Tribal patterns */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1 left-1 w-1 h-1 bg-amber-900 rounded-full"></div>
            <div className="absolute top-2 right-2 w-1 h-1 bg-amber-900 rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-amber-900 rounded-full"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-amber-900 rounded-full"></div>
          </div>
        </div>

        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-1 h-2 bg-red-500 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your DSS assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      emotion: 'happy'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Load chat history from localStorage with error handling
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('dss-chat-history');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Validate that parsedMessages is an array
        if (Array.isArray(parsedMessages)) {
          // Convert timestamp strings back to Date objects
          const messagesWithDates = parsedMessages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
          console.log('Chat history loaded successfully');
        } else {
          console.warn('Invalid chat history format, using default messages');
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // If there's an error, we'll just use the default messages
    }
  }, []);

  // Save chat history to localStorage with error handling
  useEffect(() => {
    try {
      // Convert Date objects to strings for JSON serialization
      const messagesForStorage = messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }));
      localStorage.setItem('dss-chat-history', JSON.stringify(messagesForStorage));
      console.log('Chat history saved');
    } catch (error) {
      console.error('Error saving chat history:', error);
      // If localStorage is full or unavailable, we'll continue without saving
    }
  }, [messages]);

  // Initialize speech synthesis and recognition with better error handling
  useEffect(() => {
    // Check speech synthesis support
    const speechSupport = 'speechSynthesis' in window;
    setHasSpeechSupport(speechSupport);

    if (speechSupport) {
      synthRef.current = window.speechSynthesis;
      console.log('Speech synthesis is supported');
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }

    // Check speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionSupport = !!SpeechRecognition;
    setHasRecognitionSupport(recognitionSupport);

    if (recognitionSupport) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        try {
          const transcript = event.results[0][0].transcript;
          console.log('Speech recognition result:', transcript);
          setInputMessage(transcript);
          setIsListening(false);
        } catch (error) {
          console.error('Error processing speech recognition result:', error);
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        // Show user-friendly error message
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access to use voice input.');
        } else if (event.error === 'no-speech') {
          console.log('No speech detected');
        } else {
          alert('Speech recognition error: ' + event.error);
        }
      };

      recognitionRef.current.onnomatch = () => {
        console.log('No speech was detected');
        setIsListening(false);
      };

      console.log('Speech recognition is supported');
    } else {
      console.warn('Speech recognition not supported in this browser');
    }

    return () => {
      if (synthRef.current) {
        try {
          synthRef.current.cancel();
        } catch (error) {
          console.error('Error canceling speech synthesis:', error);
        }
      }
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakMessage = (text, emotion = 'neutral') => {
    if (!voiceEnabled || !synthRef.current) {
      console.log('Voice disabled or speech synthesis not available');
      return;
    }

    // Cancel any ongoing speech
    try {
      synthRef.current.cancel();
    } catch (error) {
      console.error('Error canceling previous speech:', error);
    }

    setCurrentEmotion(emotion);
    setIsSpeaking(true);

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = 'en-US'; // Explicitly set language

      utterance.onstart = () => {
        console.log('Speech started');
      };

      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
        setCurrentEmotion('neutral');
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        setCurrentEmotion('neutral');

        // Show user-friendly error message
        if (event.error === 'not-allowed') {
          alert('Speech synthesis not allowed. Please check your browser settings.');
        } else {
          console.warn('Speech synthesis failed:', event.error);
        }
      };

      // Check if voices are available
      const voices = synthRef.current.getVoices();
      if (voices.length > 0) {
        // Try to find an English voice
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }

      synthRef.current.speak(utterance);
    } catch (error) {
      console.error('Error creating speech utterance:', error);
      setIsSpeaking(false);
      setCurrentEmotion('neutral');
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not available');
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      console.log('Already listening');
      return;
    }

    try {
      setIsListening(true);
      recognitionRef.current.start();
      console.log('Started listening');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);

      if (error.name === 'InvalidStateError') {
        alert('Speech recognition is already active. Please wait for it to finish.');
      } else {
        alert('Error starting speech recognition: ' + error.message);
      }
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition not available');
      return;
    }

    if (!isListening) {
      console.log('Not currently listening');
      return;
    }

    try {
      recognitionRef.current.stop();
      console.log('Stopped listening');
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      setIsListening(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) {
      console.log('Empty message, not sending');
      return;
    }

    if (isTyping) {
      console.log('Bot is typing, cannot send message');
      return;
    }

    try {
      const userMessage = {
        id: Date.now(),
        text: text.trim(),
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsTyping(true);

      console.log('User message sent:', text);

      // Simulate bot response with better error handling
      setTimeout(() => {
        try {
          const botResponses = [
            "I understand your question. Let me help you with that DSS information.",
            "Based on the data available, here's what I can tell you...",
            "That's a great question! Here's the relevant information from our DSS.",
            "I can provide you with detailed insights on this topic.",
            "Let me analyze this for you and provide the best possible answer.",
            "Thank you for your question. I'm here to assist you with DSS-related queries.",
            "I appreciate you reaching out. Let me provide you with the information you need.",
            "That's an interesting point. Here's what our DSS shows regarding this matter."
          ];

          const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
          const emotions = ['happy', 'neutral', 'excited'];

          const botMessage = {
            id: Date.now() + 1,
            text: randomResponse,
            sender: 'bot',
            timestamp: new Date(),
            emotion: emotions[Math.floor(Math.random() * emotions.length)]
          };

          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);

          console.log('Bot response sent:', randomResponse);

          // Speak the response
          speakMessage(randomResponse, botMessage.emotion);
        } catch (error) {
          console.error('Error sending bot response:', error);
          setIsTyping(false);

          // Send a fallback message
          const fallbackMessage = {
            id: Date.now() + 1,
            text: "I'm sorry, I encountered an error. Please try again.",
            sender: 'bot',
            timestamp: new Date(),
            emotion: 'neutral'
          };
          setMessages(prev => [...prev, fallbackMessage]);
        }
      }, 1000 + Math.random() * 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  const clearChatHistory = () => {
    setMessages([{
      id: 1,
      text: "Hello! I'm your DSS assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      emotion: 'happy'
    }]);
    localStorage.removeItem('dss-chat-history');
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] z-40"
          >
            <Card className="shadow-2xl border-2 border-gray-200 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">DSS Assistant</h3>
                      <p className="text-xs opacity-90">Decision Support System</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => hasSpeechSupport && setVoiceEnabled(!voiceEnabled)}
                      className={`text-white hover:bg-white/20 p-1 h-8 w-8 ${!hasSpeechSupport ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!hasSpeechSupport}
                      title={!hasSpeechSupport ? 'Speech synthesis not supported in this browser' : (voiceEnabled ? 'Disable voice' : 'Enable voice')}
                    >
                      {voiceEnabled && hasSpeechSupport ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <VolumeX className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-white hover:bg-white/20 p-1 h-8 w-8"
                    >
                      {isMinimized ? (
                        <Maximize2 className="w-4 h-4" />
                      ) : (
                        <Minimize2 className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20 p-1 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <AnimatePresence>
                  {!isMinimized && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Chatbot Actor */}
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b">
                        <ChatbotActor
                          isSpeaking={isSpeaking}
                          emotion={currentEmotion}
                          message={messages[messages.length - 1]?.text}
                        />
                      </div>

                      {/* Messages */}
                      <ScrollArea className="h-80 p-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  message.sender === 'user'
                                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </motion.div>
                          ))}

                          {isTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start"
                            >
                              <div className="bg-gray-100 p-3 rounded-lg">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      {/* Input Area */}
                      <div className="p-4 border-t bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 relative">
                            <Input
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Type your message..."
                              className="pr-12"
                              disabled={isTyping}
                            />
                            <Button
                              onClick={isListening ? stopListening : startListening}
                              variant="ghost"
                              size="sm"
                              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8 ${
                                isListening ? 'text-red-500' : (!hasRecognitionSupport ? 'text-gray-300' : 'text-gray-500')
                              } ${!hasRecognitionSupport ? 'cursor-not-allowed' : ''}`}
                              disabled={!hasRecognitionSupport}
                              title={!hasRecognitionSupport ? 'Speech recognition not supported in this browser' : (isListening ? 'Stop listening' : 'Start voice input')}
                            >
                              {isListening ? (
                                <MicOff className="w-4 h-4" />
                              ) : (
                                <Mic className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <Button
                            onClick={() => sendMessage(inputMessage)}
                            disabled={!inputMessage.trim() || isTyping}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Voice Status */}
                        {isListening && (
                          <div className="mt-2 text-center">
                            <p className="text-sm text-red-500 font-medium">Listening...</p>
                          </div>
                        )}

                        {/* Clear History Button */}
                        <div className="mt-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearChatHistory}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Clear Chat History
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const FloatingChatbotWithErrorBoundary = () => (
  <ChatbotErrorBoundary>
    <FloatingChatbot />
  </ChatbotErrorBoundary>
);

export default FloatingChatbotWithErrorBoundary;