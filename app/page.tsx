 

"use client"

import React, { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Lock, Play, Search, Star } from "lucide-react"
import BinaryBlaster from "./BinaryBlaster"
import Shapes from "./Shapes"
import PeriodicTable from "./PeriodicTable"
import { FloatingChatbot } from "@/components/floating-chatbot"


const GamingSection = ({ handleBackToDashboard, selectedSubject, setSelectedSubject, setCurrentView }: any) => {
  const subjects = [
    { name: "Mathematics", icon: "📊", color: "blue", progress: 75, gamesCompleted: 12, totalGames: 16 },
    { name: "Physics", icon: "⚡", color: "purple", progress: 60, gamesCompleted: 9, totalGames: 15 },
    { name: "Chemistry", icon: "🧪", color: "green", progress: 45, gamesCompleted: 7, totalGames: 14 },
    { name: "Biology", icon: "🧬", color: "emerald", progress: 80, gamesCompleted: 16, totalGames: 20 },
    { name: "Computer Science", icon: "💻", color: "indigo", progress: 90, gamesCompleted: 18, totalGames: 20 },
    { name: "General STEM", icon: "🔬", color: "pink", progress: 55, gamesCompleted: 11, totalGames: 18 },
  ]

  const subjectGames = {
    "Mathematics": [
      { name: "Algebra Adventure", difficulty: "Easy", xp: 50, locked: false, completed: true },
        { name: "Shapes", difficulty: "Medium", xp: 95, locked: false, completed: false },     
      { name: "Geometry Quest", difficulty: "Medium", xp: 75, locked: false, completed: true },
      { name: "Calculus Challenge", difficulty: "Hard", xp: 100, locked: false, completed: false },
      { name: "Statistics Safari", difficulty: "Medium", xp: 80, locked: true, completed: false },
      { name: "Trigonometry Tower", difficulty: "Hard", xp: 120, locked: true, completed: false },
    ],
    "Physics": [
        { name: "Newton's Laws Lab", difficulty: "Easy", xp: 60, locked: false, completed: true },
        { name: "Quantum Leap", difficulty: "Hard", xp: 150, locked: true, completed: false },
        { name: "Circuit Builder", difficulty: "Medium", xp: 85, locked: false, completed: false },
        { name: "Light Spectrum Puzzle", difficulty: "Easy", xp: 55, locked: false, completed: true },
    ],
    "Chemistry": [
        { name: "Molecule Matcher", difficulty: "Easy", xp: 50, locked: false, completed: true },
        { name: "Periodic Table", difficulty: "Medium", xp: 70, locked: false, completed: false },
        { name: "Balancing Equations", difficulty: "Hard", xp: 110, locked: true, completed: false },
    ],
    "Biology": [
        { name: "Cell Explorer", difficulty: "Easy", xp: 50, locked: false, completed: true },
        { name: "DNA Sequencer", difficulty: "Medium", xp: 90, locked: false, completed: false },
        { name: "Ecosystem Builder", difficulty: "Hard", xp: 130, locked: true, completed: false },
        { name: "Frog Dissection Sim", difficulty: "Hard", xp: 150, locked: true, completed: false },
    ],
    "Computer Science": [
        { name: "Binary Blaster", difficulty: "Medium", xp: 65, locked: false, completed: false },
        { name: "Code Debugger", difficulty: "Hard", xp: 125, locked: false, completed: false },
        { name: "SQL Sleuth", difficulty: "Hard", xp: 140, locked: true, completed: false },
    ],
    "General STEM": [
        { name: "Lab Safety Sim", difficulty: "Easy", xp: 40, locked: false, completed: true },
        { name: "Unit Converter", difficulty: "Medium", xp: 60, locked: false, completed: false },
        { name: "Data Viz Dash", difficulty: "Medium", xp: 80, locked: true, completed: false },
    ],
  };
  
  const handlePlayGame = (game: any) => {
    if (game.locked) return;
    if (game.name === 'Binary Blaster') {
      // Navigate to Binary Blaster game
      setCurrentView('binary-blaster');
    } else if (game.name === 'Shapes') {
      // Navigate to Shapes game
      setCurrentView('shapes');
    } else if (game.name === 'Periodic Table') {
      // Navigate to Periodic Table game
      setCurrentView('periodic-table');
    } else {
      // Placeholder for other games
      alert(`Starting ${game.name}! (Navigation not yet implemented)`);
    }
  };

  // Mapping object to ensure Tailwind CSS generates the correct classes
  const colorVariants: { [key: string]: string } = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    emerald: 'from-emerald-500 to-emerald-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
  };

  if (selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 font-sans">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedSubject(null)}
            className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Subjects
          </button>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl mb-8">
            <h1 className="text-4xl font-bold mb-2">{selectedSubject} Games</h1>
            <p className="text-indigo-100">Master concepts through interactive gameplay!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {(subjectGames[selectedSubject as keyof typeof subjectGames] || []).map((game: any, index: number) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all hover:scale-105 ${
                  game.locked
                    ? "border-gray-200 opacity-60"
                    : game.completed
                      ? "border-green-300 bg-green-50"
                      : "border-indigo-200 hover:border-indigo-300"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{game.name}</h3>
                  {game.locked && <Lock className="w-5 h-5 text-gray-400" />}
                  {game.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Difficulty:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        game.difficulty === "Easy"
                          ? "bg-green-100 text-green-700"
                          : game.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {game.difficulty}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">XP Reward:</span>
                    <span className="font-bold text-indigo-600">{game.xp} XP</span>
                  </div>

                  <button
                    onClick={() => handlePlayGame(game)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      game.locked
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : game.completed
                          ? "bg-green-500 text-white"
                          : "bg-indigo-500 text-white hover:bg-indigo-600"
                    }`}
                    disabled={game.locked}
                  >
                    {game.locked ? "Locked" : game.completed ? "Review" : "Play Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBackToDashboard}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl mb-8">
          <h1 className="text-4xl font-bold mb-4">Gaming Arcade</h1>
          <p className="text-indigo-100 text-lg">Learn through play! Choose your subject and start your adventure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <div
              key={index}
              onClick={() => setSelectedSubject(subject.name)}
              className={`bg-gradient-to-br ${colorVariants[subject.color]} text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-all shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{subject.icon}</span>
                <div className="text-right">
                  <div className="text-sm opacity-90">Progress</div>
                  <div className="text-2xl font-bold">{subject.progress}%</div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">{subject.name}</h3>

              <div className="mb-4">
                <div className="flex justify-between text-sm opacity-90 mb-1">
                  <span>Games Completed</span>
                  <span>
                    {subject.gamesCompleted}/{subject.totalGames}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Click to explore</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const LearningSection = ({ handleBackToDashboard, selectedSubject, setSelectedSubject, selectedTopic, setSelectedTopic }: any) => {
  const subjects = [
    { name: "Mathematics", icon: "📊", color: "blue", topics: 24, completed: 18 },
    { name: "Physics", icon: "⚡", color: "purple", topics: 20, completed: 12 },
    { name: "Chemistry", icon: "🧪", color: "green", topics: 18, completed: 10 },
    { name: "Biology", icon: "🧬", color: "emerald", topics: 22, completed: 16 },
    { name: "Computer Science", icon: "💻", color: "indigo", topics: 26, completed: 20 },
    { name: "General STEM", icon: "🔬", color: "pink", topics: 15, completed: 8 },
  ]

  const topics = [
    { name: "Linear Equations", difficulty: "Beginner", duration: "15 min", xp: 50, completed: true },
    { name: "Quadratic Functions", difficulty: "Intermediate", duration: "25 min", xp: 75, completed: true },
    { name: "Calculus Basics", difficulty: "Advanced", duration: "35 min", xp: 100, completed: false },
    { name: "Statistics", difficulty: "Intermediate", duration: "20 min", xp: 80, completed: false },
  ]
  
  const colorVariants: { [key: string]: string } = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    emerald: 'from-emerald-500 to-emerald-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
  };

  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedTopic(null)}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Topics
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Video Section */}
            <div className="bg-gray-900 aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                <p className="text-lg">Interactive Video: {selectedTopic}</p>
                <p className="text-sm opacity-70">Click to start learning</p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedTopic}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      25 min
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      75 XP
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Intermediate</span>
                  </div>
                </div>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Mark Complete
                </button>
              </div>

              {/* Learning Content */}
              <div className="prose max-w-none mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What you'll learn:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Understanding the fundamental concepts</li>
                  <li>• Practical applications and examples</li>
                  <li>• Problem-solving techniques</li>
                  <li>• Real-world connections</li>
                </ul>
              </div>

              {/* Interactive Exploration */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Interactive Exploration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adjust Parameter A: <span className="font-bold">5</span>
                    </label>
                    <input type="range" min="1" max="10" defaultValue="5" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adjust Parameter B: <span className="font-bold">3</span>
                    </label>
                    <input type="range" min="1" max="10" defaultValue="3" className="w-full" />
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                    <p className="text-gray-600">Interactive visualization will appear here</p>
                  </div>
                </div>
              </div>

              {/* Quiz Section */}
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Quiz</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-800 mb-3">What is the result of 2x + 3 when x = 5?</p>
                    <div className="space-y-2">
                      {["10", "13", "15", "8"].map((option, index) => (
                        <label key={index} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="quiz1" value={option} className="text-green-500" />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    Submit Answer (+25 XP)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedSubject(null)}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Subjects
          </button>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl mb-8">
            <h1 className="text-4xl font-bold mb-2">{selectedSubject} Topics</h1>
            <p className="text-blue-100">Explore comprehensive lessons and interactive content</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <div
                key={index}
                onClick={() => setSelectedTopic(topic.name)}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:scale-105 transition-all border-2 ${
                  topic.completed ? "border-green-300 bg-green-50" : "border-blue-200 hover:border-blue-300"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{topic.name}</h3>
                  {topic.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Difficulty:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        topic.difficulty === "Beginner"
                          ? "bg-green-100 text-green-700"
                          : topic.difficulty === "Intermediate"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {topic.difficulty}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{topic.duration}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">XP Reward:</span>
                    <span className="font-bold text-blue-600">{topic.xp} XP</span>
                  </div>

                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      topic.completed ? "bg-green-500 text-white" : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {topic.completed ? "Review" : "Start Learning"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBackToDashboard}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl mb-8">
          <h1 className="text-4xl font-bold mb-4">Learning Hub</h1>
          <p className="text-blue-100 text-lg">
            Comprehensive lessons, interactive content, and hands-on learning experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <div
              key={index}
              onClick={() => setSelectedSubject(subject.name)}
              className={`bg-gradient-to-br ${colorVariants[subject.color]} text-white p-6 rounded-xl cursor-pointer hover:scale-105 transition-all shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{subject.icon}</span>
                <div className="text-right">
                  <div className="text-sm opacity-90">Progress</div>
                  <div className="text-2xl font-bold">{Math.round((subject.completed / subject.topics) * 100)}%</div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">{subject.name}</h3>

              <div className="mb-4">
                <div className="flex justify-between text-sm opacity-90 mb-1">
                  <span>Topics Completed</span>
                  <span>
                    {subject.completed}/{subject.topics}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: `${(subject.completed / subject.topics) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Start learning</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const CommunitySection = ({ handleBackToDashboard }: any) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleBackToDashboard}
          className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8 rounded-2xl mb-8">
          <h1 className="text-4xl font-bold mb-4">Community Hub</h1>
          <p className="text-green-100 text-lg">Connect with fellow learners and share your progress!</p>
        </div>

        <div className="text-center">
          <p className="text-gray-600">Community features coming soon...</p>
        </div>
      </div>
    </div>
  )
}

const StudentDashboard = () => {
  const [streak, setStreak] = useState(5)
  const [points, setPoints] = useState(1200)
  const [currentView, setCurrentView] = useState("dashboard")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [leaderboardRegion, setLeaderboardRegion] = useState("Local")
  const [leaderboardSort, setLeaderboardSort] = useState("XP")
  const [challengeMode, setChallengeMode] = useState("1v1")
  const [selectedChallengeSubject, setSelectedChallengeSubject] = useState<string | null>(null)
  const [matchmakingState, setMatchmakingState] = useState("idle")

  const dashboardCards = [
    {
      id: "gaming",
      title: "Gaming Section",
      icon: "🎮",
      description: "Interactive STEM games",
      gradient: "from-blue-600 via-purple-600 to-blue-700",
      hoverGradient: "from-blue-500 via-purple-500 to-blue-600",
    },
    {
      id: "learning",
      title: "Learning Section",
      icon: "📘",
      description: "Lessons, quizzes & progress",
      gradient: "from-green-600 via-emerald-600 to-green-700",
      hoverGradient: "from-green-500 via-emerald-500 to-green-600",
    },
    {
      id: "community",
      title: "Community Section",
      icon: "💬",
      description: "Discussions & peer sharing",
      gradient: "from-orange-600 via-red-600 to-orange-700",
      hoverGradient: "from-orange-500 via-red-500 to-orange-600",
    },
    {
      id: "challenges",
      title: "Challenges Section",
      icon: "⚡",
      description: "Weekly quests & badges",
      gradient: "from-purple-600 via-pink-600 to-purple-700",
      hoverGradient: "from-purple-500 via-pink-500 to-purple-600",
    },
  ]

  const handleCardClick = (cardId: any) => {
    console.log(`[v0] Navigating to ${cardId} section`)
    if (cardId === "community") {
      setCurrentView("community")
    }
    if (cardId === "gaming") {
      setCurrentView("gaming")
    }
    if (cardId === "learning") {
      setCurrentView("learning")
    }
    if (cardId === "challenges") {
      setCurrentView("challenges")
    }
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedSubject(null)
    setSelectedTopic(null)
  }

  const handleLeaderboardClick = () => {
    setCurrentView("leaderboard")
  }

  const handleStreakClick = () => {
    setCurrentView("streak")
  }

  const handleProfileClick = () => {
    setCurrentView("profile")
  }

  const handleXPClick = () => {
    setCurrentView("xp")
  }

  const handleAchievementsClick = () => {
    setCurrentView("achievements")
  }

  const handleSettingsClick = () => {
    // For now, just show an alert - can be expanded later
    alert("Settings functionality coming soon!")
  }

  const handleLogoutClick = () => {
    // Removed confirm dialog as it's often blocked in modern browsers.
    // A custom modal would be a better UX in a real app.
    alert("Logout functionality coming soon!")
  }

  const renderAchievementsPage = () => {
    const achievementCategories = [
      {
        name: "Streak 🔥",
        achievements: [
          {
            id: 1,
            title: "First Steps",
            description: "Complete your first day",
            xp: 50,
            unlocked: true,
            date: "2024-01-15",
          },
          {
            id: 2,
            title: "Week Warrior",
            description: "Maintain a 7-day streak",
            xp: 200,
            unlocked: true,
            date: "2024-01-22",
          },
          {
            id: 3,
            title: "Month Master",
            description: "Maintain a 30-day streak",
            xp: 1000,
            unlocked: false,
            date: null,
          },
        ],
      },
      {
        name: "XP ⭐",
        achievements: [
          {
            id: 4,
            title: "Point Collector",
            description: "Earn your first 100 XP",
            xp: 25,
            unlocked: true,
            date: "2024-01-10",
          },
          {
            id: 5,
            title: "XP Champion",
            description: "Reach 1000 XP total",
            xp: 100,
            unlocked: true,
            date: "2024-01-20",
          },
          { id: 6, title: "XP Legend", description: "Reach 5000 XP total", xp: 500, unlocked: false, date: null },
        ],
      },
      {
        name: "Subjects 📘",
        achievements: [
          {
            id: 7,
            title: "Math Wizard",
            description: "Complete 10 math topics",
            xp: 300,
            unlocked: true,
            date: "2024-01-18",
          },
          {
            id: 8,
            title: "Physics Explorer",
            description: "Complete 5 physics experiments",
            xp: 250,
            unlocked: false,
            date: null,
          },
          {
            id: 9,
            title: "Chemistry Master",
            description: "Complete all chemistry basics",
            xp: 400,
            unlocked: false,
            date: null,
          },
        ],
      },
      {
        name: "Challenges ⚔️",
        achievements: [
          {
            id: 10,
            title: "First Victory",
            description: "Win your first 1v1 challenge",
            xp: 150,
            unlocked: true,
            date: "2024-01-12",
          },
          {
            id: 11,
            title: "Team Player",
            description: "Win a 4v4 team challenge",
            xp: 300,
            unlocked: false,
            date: null,
          },
          {
            id: 12,
            title: "Reasoning Pro",
            description: "Excel in reasoning challenges",
            xp: 200,
            unlocked: false,
            date: null,
          },
        ],
      },
      {
        name: "Community 💬",
        achievements: [
          {
            id: 13,
            title: "Social Butterfly",
            description: "Make 5 friends",
            xp: 100,
            unlocked: true,
            date: "2024-01-14",
          },
          { id: 14, title: "Helper", description: "Help 10 students", xp: 250, unlocked: false, date: null },
          {
            id: 15,
            title: "Community Leader",
            description: "Lead a study group",
            xp: 500,
            unlocked: false,
            date: null,
          },
        ],
      },
      {
        name: "Special 🎉",
        achievements: [
          { id: 16, title: "Early Bird", description: "Study before 7 AM", xp: 75, unlocked: true, date: "2024-01-16" },
          { id: 17, title: "Night Owl", description: "Study after 10 PM", xp: 75, unlocked: false, date: null },
          { id: 18, title: "Weekend Warrior", description: "Study on weekends", xp: 100, unlocked: false, date: null },
        ],
      },
    ]

    const totalAchievements = achievementCategories.reduce((acc, cat) => acc + cat.achievements.length, 0)
    const unlockedAchievements = achievementCategories.reduce(
      (acc, cat) => acc + cat.achievements.filter((a) => a.unlocked).length,
      0,
    )

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 hover:bg-slate-100"
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </Button>

              <h1 className="text-xl font-bold text-slate-800">🏅 Achievements</h1>

              <div className="text-sm text-slate-600">
                {unlockedAchievements}/{totalAchievements} unlocked
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Progress Header */}
            <Card className="overflow-hidden shadow-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold mb-2">Trophy Cabinet</h2>
                <p className="text-orange-100 mb-4">
                  You've unlocked {unlockedAchievements} out of {totalAchievements} achievements!
                </p>
                <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                  <div
                    className="bg-white h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${(unlockedAchievements / totalAchievements) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-orange-200">
                  {Math.round((unlockedAchievements / totalAchievements) * 100)}% Complete
                </p>
              </CardContent>
            </Card>

            {/* Achievement Categories */}
            {achievementCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">{category.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`group relative overflow-hidden border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                        achievement.unlocked
                          ? "border-yellow-400 shadow-lg hover:shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50"
                          : "border-slate-200 shadow-sm hover:shadow-md bg-slate-50 opacity-60"
                      }`}
                    >
                      {achievement.unlocked && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}

                      {!achievement.unlocked && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">🔒</span>
                          </div>
                        </div>
                      )}

                      <CardContent className="p-6 text-center">
                        <div
                          className={`text-4xl mb-3 transition-transform duration-300 ${
                            achievement.unlocked ? "group-hover:scale-110" : "grayscale"
                          }`}
                        >
                          🏅
                        </div>

                        <h4
                          className={`text-lg font-bold mb-2 ${
                            achievement.unlocked ? "text-slate-800" : "text-slate-500"
                          }`}
                        >
                          {achievement.title}
                        </h4>

                        <p className={`text-sm mb-3 ${achievement.unlocked ? "text-slate-600" : "text-slate-400"}`}>
                          {achievement.description}
                        </p>

                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            achievement.unlocked ? "bg-yellow-100 text-yellow-800" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          ⭐ {achievement.xp} XP
                        </div>

                        {achievement.unlocked && achievement.date && (
                          <p className="text-xs text-slate-500 mt-2">
                            Unlocked: {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  const renderProfilePage = () => {
    const progressColorVariants: { [key: string]: { bg: string; text: string; fill: string } } = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', fill: 'bg-blue-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700', fill: 'bg-purple-500' },
      green: { bg: 'bg-green-100', text: 'text-green-700', fill: 'bg-green-500' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-700', fill: 'bg-pink-500' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-700', fill: 'bg-orange-500' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-700', fill: 'bg-teal-500' },
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 hover:bg-slate-100"
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </Button>

              <h1 className="text-xl font-bold text-slate-800">My Profile</h1>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Edit Profile</Button>
            </div>
          </div>
        </nav>

        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <Card className="overflow-hidden shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                  <div className="relative">
                    <Avatar className="h-32 w-32 ring-4 ring-white/30 shadow-2xl">
                      <AvatarImage src="/student-avatar.png" alt="Student" />
                      <AvatarFallback className="bg-white/20 text-white font-bold text-4xl">ST</AvatarFallback>
                    </Avatar>
                    <Button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white text-blue-600 hover:bg-blue-50 p-0">
                      ✏️
                    </Button>
                  </div>

                  <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold mb-2">Sarah Thompson</h1>
                    <p className="text-blue-100 mb-1">@sarah_learns</p>
                    <p className="text-blue-200 mb-4">Class 9 – CBSE, Andhra Pradesh</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="bg-white/20 rounded-full px-4 py-2">
                        <span className="font-semibold">Level 12</span>
                      </div>
                      <div className="bg-white/20 rounded-full px-4 py-2">
                        <span className="font-semibold">🔥{streak} Day Streak</span>
                      </div>
                      <div className="bg-white/20 rounded-full px-4 py-2">
                        <span className="font-semibold">⭐ {points.toLocaleString()} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Streak & Activity + XP Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <span className="mr-2">🔥</span>
                    Streak & Activity
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-orange-100 rounded-xl">
                      <div className="text-3xl mb-2">🔥</div>
                      <div className="text-2xl font-bold text-orange-700">{streak}</div>
                      <div className="text-sm text-orange-600">Current Streak</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-100 rounded-xl">
                      <div className="text-3xl mb-2">🏆</div>
                      <div className="text-2xl font-bold text-yellow-700">21</div>
                      <div className="text-sm text-yellow-600">Best Streak</div>
                    </div>
                  </div>

                  {/* Mini Calendar */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-800 mb-3">This Week</h3>
                    <div className="flex justify-between">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                        <div key={day} className="text-center">
                          <div className="text-xs text-slate-600 mb-1">{day}</div>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index < 5 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {index < 5 ? "🔥" : "○"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Badges */}
                  <div className="mt-6">
                    <h3 className="font-semibold text-slate-800 mb-3">Recent Badges</h3>
                    <div className="flex space-x-2">
                      <div className="bg-yellow-100 p-2 rounded-lg text-center">
                        <div className="text-2xl">🏅</div>
                        <div className="text-xs text-yellow-700">Quiz Master</div>
                      </div>
                      <div className="bg-blue-100 p-2 rounded-lg text-center">
                        <div className="text-2xl">🎯</div>
                        <div className="text-xs text-blue-700">Focus Champ</div>
                      </div>
                      <div className="bg-green-100 p-2 rounded-lg text-center">
                        <div className="text-2xl">📚</div>
                        <div className="text-xs text-green-700">Bookworm</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <span className="mr-2">⭐</span>
                    XP & Level Progress
                  </h2>

                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-purple-600 mb-2">Level 12</div>
                    <div className="text-slate-600 mb-4">{points.toLocaleString()} / 1,500 XP</div>
                    <div className="w-full bg-slate-200 rounded-full h-4 mb-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${(points / 1500) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-slate-600">300 XP to Level 13</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-700">XP This Week</span>
                      <span className="font-bold text-blue-800">+450 XP</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-green-700">Lessons Completed</span>
                      <span className="font-bold text-green-800">24</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-orange-700">Average Quiz Score</span>
                      <span className="font-bold text-orange-800">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Academic Progress */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <span className="mr-2">📚</span>
                  Academic Progress
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { subject: "Mathematics", icon: "➗", progress: 75, topic: "Quadratic Equations", score: 92, color: "blue" },
                    { subject: "Physics", icon: "⚡", progress: 60, topic: "Newton's Laws", score: 85, color: "purple" },
                    { subject: "Chemistry", icon: "🧪", progress: 45, topic: "Atomic Structure", score: 78, color: "green" },
                    { subject: "Biology", icon: "🧬", progress: 80, topic: "Cell Division", score: 94, color: "pink" },
                    { subject: "Computer Science", icon: "💻", progress: 90, topic: "Data Structures", score: 96, color: "orange" },
                    { subject: "General STEM", icon: "🌍", progress: 35, topic: "Scientific Method", score: 82, color: "teal" },
                  ].map((subject, index) => {
                    const colors = progressColorVariants[subject.color] || progressColorVariants.blue;
                    return (
                      <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-2xl">{subject.icon}</div>
                            <div className={`text-sm font-semibold px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                              {subject.progress}%
                            </div>
                          </div>
                          <h3 className="font-bold text-slate-800 mb-2">{subject.subject}</h3>
                          <div className="space-y-2">
                            <div className={`w-full ${colors.bg} rounded-full h-2`}>
                              <div
                                className={`${colors.fill} h-2 rounded-full`}
                                style={{ width: `${subject.progress}%` }}
                              />
                            </div>
                            <div className="text-sm text-slate-600">
                              <div>Current: {subject.topic}</div>
                              <div>Avg Score: {subject.score}%</div>
                              <div className="text-xs text-slate-500">Last activity: 2 hours ago</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Achievements & Badges */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <span className="mr-2">🏆</span>
                  Achievements & Badges
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    { name: "Quiz Master", icon: "🏅", unlocked: true, hint: "" },
                    { name: "Streak King", icon: "🔥", unlocked: true, hint: "" },
                    { name: "Focus Champ", icon: "🎯", unlocked: true, hint: "" },
                    { name: "Math Wizard", icon: "🧙‍♂️", unlocked: false, hint: "Complete 50 math problems" },
                    { name: "Science Star", icon: "⭐", unlocked: false, hint: "Score 95% on 5 science quizzes" },
                    { name: "Code Crusher", icon: "💻", unlocked: false, hint: "Finish 10 coding challenges" },
                  ].map((badge, index) => (
                    <div
                      key={index}
                      className={`text-center p-4 rounded-xl border-2 transition-all ${
                        badge.unlocked
                          ? "bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300 shadow-lg"
                          : "bg-gray-100 border-gray-300 opacity-60"
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="font-semibold text-sm text-slate-800">{badge.name}</div>
                      {!badge.unlocked && <div className="text-xs text-slate-500 mt-1">{badge.hint}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community & Social + Learning Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <span className="mr-2">👥</span>
                    Community & Social
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-700">Communities Joined</span>
                      <span className="font-bold text-blue-800">5</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-green-700">Posts This Week</span>
                      <span className="font-bold text-green-800">12</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-700">Friends Connected</span>
                      <span className="font-bold text-purple-800">156</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-slate-800 mb-3">Recent Activity</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <span>💬</span>
                        <span>Replied to "Math Help" discussion</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <span>👍</span>
                        <span>Liked Sarah's physics solution</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <span>🎉</span>
                        <span>Joined "Chemistry Lab" community</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <span className="mr-2">📊</span>
                    Learning Analytics
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-3">Weekly Study Time</h3>
                      <div className="flex items-end space-x-2 h-20">
                        {[40, 65, 30, 80, 55, 70, 45].map((height, index) => (
                          <div key={index} className="flex-1 bg-blue-200 rounded-t" style={{ height: `${height}%` }}>
                            <div
                              className="bg-blue-500 rounded-t h-full"
                              style={{ height: `${Math.random() * 100}%` }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                          <span key={day}>{day}</span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-700">12h 30m</div>
                        <div className="text-sm text-orange-600">This Week</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">#8</div>
                        <div className="text-sm text-green-600">Leaderboard</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personal Details */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <span className="mr-2">👤</span>
                    Personal Details
                  </h2>
                  <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent">
                    Edit Details
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Date of Birth</label>
                      <div className="text-slate-800">March 15, 2008</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Email</label>
                      <div className="text-slate-800">sarah.thompson@email.com</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Phone</label>
                      <div className="text-slate-800">+91 98765 43210</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">School</label>
                      <div className="text-slate-800">Delhi Public School, Hyderabad</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Parent/Guardian</label>
                      <div className="text-slate-800">Mrs. Priya Thompson</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Emergency Contact</label>
                      <div className="text-slate-800">+91 98765 43211</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <span className="mr-2">⚙️</span>
                  Settings
                </h2>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-800">Language Preference</div>
                      <div className="text-sm text-slate-600">Choose your preferred language</div>
                    </div>
                    <select className="px-3 py-2 border border-slate-300 rounded-lg bg-white">
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Telugu</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-800">Notifications</div>
                      <div className="text-sm text-slate-600">Receive learning reminders and updates</div>
                    </div>
                    <Button className="bg-green-500 hover:bg-green-600 text-white">ON</Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-800">Profile Visibility</div>
                      <div className="text-sm text-slate-600">Control what others can see</div>
                    </div>
                    <select className="px-3 py-2 border border-slate-300 rounded-lg bg-white">
                      <option>Public</option>
                      <option>Friends Only</option>
                      <option>Private</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-slate-800">Study Reminders</div>
                      <div className="text-sm text-slate-600">Daily learning goal notifications</div>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">ON</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const renderStreakDashboardPage = () => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    // Generate calendar days with streak status
    const calendarDays = []
    const streakData: { [key: number]: string } = {
      1: "completed",
      2: "completed",
      3: "partial",
      4: "completed",
      5: "completed",
      6: "missed",
      7: "completed",
      8: "completed",
      9: "completed",
      10: "partial",
      11: "completed",
      12: "completed",
      13: "completed",
      14: "missed",
      15: "completed",
    }

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-10"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const status = streakData[day] || "future"
      const isToday = day === currentDate.getDate()

      let dayClass =
        "h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 "
      let icon = ""

      if (status === "completed") {
        dayClass += "bg-orange-100 text-orange-700 border-2 border-orange-300"
        icon = "🔥"
      } else if (status === "partial") {
        dayClass += "bg-blue-100 text-blue-700 border-2 border-blue-300"
        icon = "🌙"
      } else if (status === "missed") {
        dayClass += "bg-red-100 text-red-700 border-2 border-red-300"
        icon = "❌"
      } else {
        dayClass += "bg-gray-100 text-gray-500"
      }

      if (isToday) {
        dayClass += " ring-2 ring-purple-400 ring-offset-2"
      }

      calendarDays.push(
        <div key={day} className={dayClass}>
          <div className="flex flex-col items-center">
            <span className="text-xs">{day}</span>
            {icon && <span className="text-xs">{icon}</span>}
          </div>
        </div>,
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="mb-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-2xl mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Streak Dashboard</h1>
                <p className="text-orange-100">Keep the momentum going! Every day counts.</p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{streak}</div>
                <div className="text-orange-200">Current Streak</div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold">21</div>
                <div className="text-sm text-orange-200">Best Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">67%</div>
                <div className="text-sm text-orange-200">This Month</div>
              </div>
            </div>
          </div>

          {/* Calendar and Weekly Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Calendar */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>

              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">{calendarDays}</div>

              {/* Legend */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span>🔥</span>
                  <span className="text-slate-600">Full streak day</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🌙</span>
                  <span className="text-slate-600">Partial streak</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>❌</span>
                  <span className="text-slate-600">Missed day</span>
                </div>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">This Week</h2>

                <div className="flex justify-between items-center mb-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                    const isCompleted = index < 5
                    return (
                      <div key={day} className="flex flex-col items-center space-y-2">
                        <div className="text-xs text-slate-600">{day}</div>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isCompleted ? "🔥" : "○"}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full"
                    style={{ width: "71%" }}
                  ></div>
                </div>

                <p className="text-center text-slate-600 font-medium">2 more days to unlock Weekly Bonus Badge! 🏅</p>
              </div>

              {/* Rules Section */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">How Streaks Work</h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🎥</span>
                    <div>
                      <div className="font-medium text-slate-800">Watch at least 1 learning video</div>
                      <div className="text-sm text-slate-600">Complete any lesson video</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🎮</span>
                    <div>
                      <div className="font-medium text-slate-800">Play STEM games for 30+ minutes</div>
                      <div className="text-sm text-slate-600">Any combination of games counts</div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <h3 className="font-bold text-yellow-800 mb-2">Rewards:</h3>
                    <ul className="space-y-1 text-sm text-yellow-700">
                      <li>• +2 XP for 5-day streak</li>
                      <li>• +10 XP and Badge for 7-day streak</li>
                      <li>• Golden Badge for 30-day streak</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Streak Badges */}
          <div className="bg-white rounded-2xl p-6 shadow-xl mt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Streak Achievements</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl border-2 border-orange-200">
                <div className="text-4xl mb-2">🔥</div>
                <div className="font-bold text-slate-800">5-Day Streak</div>
                <div className="text-sm text-slate-600">Unlocked!</div>
                <div className="text-xs text-orange-600 mt-1">+2 XP Bonus</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300 opacity-60">
                <div className="text-4xl mb-2">🏅</div>
                <div className="font-bold text-slate-800">7-Day Streak</div>
                <div className="text-sm text-slate-600">2 days to go</div>
                <div className="text-xs text-gray-600 mt-1">+10 XP + Badge</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300 opacity-60">
                <div className="text-4xl mb-2">👑</div>
                <div className="font-bold text-slate-800">30-Day Streak</div>
                <div className="text-sm text-slate-600">25 days to go</div>
                <div className="text-xs text-gray-600 mt-1">Golden Badge</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderLeaderboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="mb-6 flex items-center gap-2 text-yellow-600 hover:text-yellow-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-8 rounded-2xl mb-8">
          <h1 className="text-4xl font-bold mb-4">Regional Leaderboard</h1>
          <div className="flex flex-wrap gap-4">
            <select className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2">
              <option>All Regions</option>
              <option>North America</option>
              <option>Europe</option>
              <option>Asia</option>
            </select>
            <select className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2">
              <option>This Week</option>
              <option>This Month</option>
              <option>All Time</option>
            </select>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Top Performers</h2>
          <div className="flex justify-center items-end gap-4 mb-8">
            {/* 2nd Place */}
            <div className="bg-gradient-to-t from-gray-400 to-gray-300 text-white p-6 rounded-t-2xl text-center min-h-[200px] flex flex-col justify-end">
              <div className="bg-white/20 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="font-bold text-lg">Sarah Chen</h3>
              <p className="text-sm opacity-90">2,847 XP</p>
              <div className="bg-white/30 px-3 py-1 rounded-full text-xs mt-2">2nd</div>
            </div>

            {/* 1st Place */}
            <div className="bg-gradient-to-t from-yellow-500 to-yellow-400 text-white p-6 rounded-t-2xl text-center min-h-[240px] flex flex-col justify-end">
              <div className="bg-white/20 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">👑</span>
              </div>
              <h3 className="font-bold text-xl">Alex Johnson</h3>
              <p className="text-sm opacity-90">3,156 XP</p>
              <div className="bg-white/30 px-3 py-1 rounded-full text-xs mt-2">1st</div>
            </div>

            {/* 3rd Place */}
            <div className="bg-gradient-to-t from-orange-600 to-orange-500 text-white p-6 rounded-t-2xl text-center min-h-[180px] flex flex-col justify-end">
              <div className="bg-white/20 w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <h3 className="font-bold">Mike Davis</h3>
              <p className="text-sm opacity-90">2,634 XP</p>
              <div className="bg-white/30 px-3 py-1 rounded-full text-xs mt-2">3rd</div>
            </div>
          </div>
        </div>

        {/* Full Rankings */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Full Rankings</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { rank: 4, name: "Emma Wilson", xp: 2456, streak: 12, change: "+2" },
              { rank: 5, name: "You", xp: 2234, streak: 8, change: "+1", isCurrentUser: true },
              { rank: 6, name: "James Brown", xp: 2198, streak: 15, change: "-1" },
              { rank: 7, name: "Lisa Garcia", xp: 2087, streak: 6, change: "+3" },
              { rank: 8, name: "David Lee", xp: 1976, streak: 9, change: "-2" },
              { rank: 9, name: "Anna Taylor", xp: 1834, streak: 11, change: "0" },
              { rank: 10, name: "Chris Martin", xp: 1756, streak: 4, change: "+1" },
            ].map((user, index) => (
              <div
                key={index}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  user.isCurrentUser ? "bg-blue-50 border-l-4 border-blue-500" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        user.rank <= 3 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.rank}
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <h3 className={`font-semibold ${user.isCurrentUser ? "text-blue-700" : "text-gray-800"}`}>
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {user.xp} XP • {user.streak} day streak
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${
                        user.change.startsWith("+")
                          ? "text-green-600"
                          : user.change.startsWith("-")
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {user.change !== "0" && user.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Stats */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Your Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">5th</div>
              <div className="text-sm opacity-90">Current Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2,234</div>
              <div className="text-sm opacity-90">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm opacity-90">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">+1</div>
              <div className="text-sm opacity-90">Rank Change</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStreakDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="mb-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Streak Dashboard</h1>
              <p className="text-orange-100">Keep the momentum going! Every day counts.</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">8</div>
              <div className="text-orange-200">Current Streak</div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold">15</div>
              <div className="text-sm text-orange-200">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">67%</div>
              <div className="text-sm text-orange-200">This Month</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">December 2024</h2>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1
                  const isToday = day === 10
                  const hasActivity = day <= 10 && day >= 3
                  const isStreakDay = day >= 3 && day <= 10

                  return (
                    <div
                      key={day}
                      className={`aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all ${
                        isToday
                          ? "bg-orange-500 text-white ring-2 ring-orange-300"
                          : isStreakDay
                            ? "bg-green-100 text-green-700"
                            : hasActivity
                              ? "bg-gray-100 text-gray-600"
                              : "text-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <span className="text-gray-600">Streak Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-gray-600">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span className="text-gray-600">Missed Day</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">This Week</h3>
              <div className="space-y-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{day}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        index < 5 ? "bg-green-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      {index < 5 ? <CheckCircle className="w-4 h-4" /> : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Rules */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How Streaks Work</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Complete at least one learning activity daily</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Activities include lessons, games, or quizzes</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Streaks reset at midnight in your timezone</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Earn bonus XP for longer streaks</span>
                </div>
              </div>
            </div>

            {/* Streak Badges */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Streak Badges</h3>
              <div className="space-y-3">
                {[
                  { name: "Week Warrior", days: 7, unlocked: true, xp: 100 },
                  { name: "Fortnight Fighter", days: 14, unlocked: false, xp: 250 },
                  { name: "Month Master", days: 30, unlocked: false, xp: 500 },
                ].map((badge, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      badge.unlocked ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        badge.unlocked ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      🏆
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${badge.unlocked ? "text-yellow-700" : "text-gray-500"}`}>
                        {badge.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {badge.days} days • {badge.xp}
                      </div>
                    </div>
                    {badge.unlocked && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderXPDashboard = () => {
    const xpHistory = [
      { date: "Today, 2:30 PM", activity: "🎥 Watched Video", type: "Completed Physics: Newton's Laws", xp: 25 },
      { date: "Today, 1:15 PM", activity: "🎮 Played Game", type: "Math Quiz Challenge", xp: 30 },
      { date: "Today, 11:45 AM", activity: "📝 Completed Quiz", type: "Chemistry: Atomic Structure", xp: 40 },
      { date: "Yesterday, 4:20 PM", activity: "🔥 Streak Bonus", type: "5-day learning streak", xp: 15 },
      { date: "Yesterday, 3:10 PM", activity: "🎥 Watched Video", type: "Biology: Cell Division", xp: 25 },
      { date: "Yesterday, 2:00 PM", activity: "🎮 Played Game", type: "Physics Simulation", xp: 35 },
      { date: "2 days ago, 5:30 PM", activity: "📝 Completed Quiz", type: "Math: Quadratic Equations", xp: 45 },
      { date: "2 days ago, 4:15 PM", activity: "🎥 Watched Video", type: "Computer Science: Arrays", xp: 20 },
    ]

    const currentLevel = 12
    const currentXP = points
    const nextLevelXP = 1500
    const progressPercentage = (currentXP / nextLevelXP) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 hover:bg-slate-100"
              >
                <span>←</span>
                <span>Back to Dashboard</span>
              </Button>

              <h1 className="text-xl font-bold text-slate-800">XP Points Dashboard</h1>

              <div className="w-24"></div>
            </div>
          </div>
        </nav>

        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-8xl animate-pulse">⭐</div>
                  <div className="text-6xl font-bold">{currentXP.toLocaleString()} XP</div>
                  <div className="text-2xl font-semibold text-blue-100">Level {currentLevel}</div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-md">
                    <div className="flex justify-between text-sm text-blue-100 mb-2">
                      <span>{currentXP.toLocaleString()} XP</span>
                      <span>{nextLevelXP.toLocaleString()} XP</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 h-4 rounded-full transition-all duration-500 shadow-lg"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="text-center mt-2 text-blue-100">
                      {nextLevelXP - currentXP} XP to Level {currentLevel + 1}
                    </div>
                  </div>

                  <div className="text-lg text-blue-100 font-medium">
                    Keep learning to reach Level {currentLevel + 1}! 🚀
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* XP History */}
              <div className="lg:col-span-2">
                <Card className="shadow-xl">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                      <span className="mr-2">📈</span>
                      XP Earning History
                    </h2>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {xpHistory.map((entry, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{entry.activity.split(" ")[0]}</div>
                            <div>
                              <div className="font-semibold text-slate-800">{entry.activity}</div>
                              <div className="text-sm text-slate-600">{entry.type}</div>
                              <div className="text-xs text-slate-500">{entry.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">+{entry.xp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* XP Categories & Rewards */}
              <div className="space-y-6">
                {/* XP Categories Visualization */}
                <Card className="shadow-xl">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                      <span className="mr-2">📊</span>
                      XP Breakdown
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="text-sm text-slate-700">Learning Content</span>
                        </div>
                        <span className="font-semibold text-slate-800">450 XP</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="text-sm text-slate-700">Games</span>
                        </div>
                        <span className="font-semibold text-slate-800">380 XP</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-purple-500 rounded"></div>
                          <span className="text-sm text-slate-700">Quizzes</span>
                        </div>
                        <span className="font-semibold text-slate-800">290 XP</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-orange-500 rounded"></div>
                          <span className="text-sm text-slate-700">Streak Bonuses</span>
                        </div>
                        <span className="font-semibold text-slate-800">80 XP</span>
                      </div>
                    </div>

                    {/* Visual Bar Chart */}
                    <div className="mt-6 space-y-2">
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full" style={{ width: "37.5%" }}></div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: "31.7%" }}></div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div className="bg-purple-500 h-3 rounded-full" style={{ width: "24.2%" }}></div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div className="bg-orange-500 h-3 rounded-full" style={{ width: "6.7%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rewards & Milestones */}
                <Card className="shadow-xl">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                      <span className="mr-2">🏆</span>
                      Rewards & Milestones
                    </h2>

                    <div className="space-y-4">
                      {/* Unlocked Rewards */}
                      <div>
                        <h3 className="font-semibold text-slate-700 mb-2">Unlocked Badges</h3>
                        <div className="flex space-x-2">
                          <div className="bg-yellow-100 p-2 rounded-lg text-center">
                            <div className="text-2xl">🏅</div>
                            <div className="text-xs text-yellow-700">Quiz Master</div>
                          </div>
                          <div className="bg-blue-100 p-2 rounded-lg text-center">
                            <div className="text-2xl">🎯</div>
                            <div className="text-xs text-blue-700">Focus Champ</div>
                          </div>
                          <div className="bg-green-100 p-2 rounded-lg text-center">
                            <div className="text-2xl">📚</div>
                            <div className="text-xs text-green-700">Bookworm</div>
                          </div>
                        </div>
                      </div>

                      {/* Next Milestone */}
                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                        <h3 className="font-semibold text-purple-800 mb-2">Next Milestone</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">🏅</span>
                          <div>
                            <div className="text-sm font-medium text-purple-700">Gold Learner Badge</div>
                            <div className="text-xs text-purple-600">Earn 300 more XP to unlock</div>
                          </div>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                        </div>
                      </div>

                      {/* Weekly Leaderboard */}
                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 mb-2">This Week</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-blue-700">You are #8 in XP</span>
                          <span className="text-lg font-bold text-blue-800">+450 XP</span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">🔥 Keep going to reach top 5!</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const renderChallengesPage = () => {
    const challengeTypes = [
      {
        id: "1v1",
        title: "1v1 Duel",
        icon: "⚔️",
        description: "Face off against another student in a head-to-head battle",
        xp: "50-100 XP",
        gradient: "from-red-500 to-orange-500",
      },
      {
        id: "4v4",
        title: "4v4 Team Battle",
        icon: "🛡️",
        description: "Join a team of four and compete against another team",
        xp: "75-150 XP",
        gradient: "from-blue-500 to-purple-500",
      },
      {
        id: "reasoning",
        title: "Reasoning Puzzle",
        icon: "🧩",
        description: "Solve logic and aptitude challenges at your own pace",
        xp: "25-75 XP",
        gradient: "from-green-500 to-teal-500",
      },
    ]

    const subjects = [
      { id: "math", name: "Math", icon: "➗", color: "bg-blue-500" },
      { id: "physics", name: "Physics", icon: "⚡", color: "bg-purple-500" },
      { id: "chemistry", name: "Chemistry", icon: "🧪", color: "bg-green-500" },
      { id: "biology", name: "Biology", icon: "🧬", color: "bg-emerald-500" },
      { id: "cs", name: "Computer Science", icon: "💻", color: "bg-indigo-500" },
      { id: "reasoning", name: "Reasoning", icon: "🧩", color: "bg-orange-500" },
    ]

    const matchmakingOptions = [
      { id: "quick", title: "Quick Match", description: "Find random opponent", icon: "⚡" },
      { id: "friend", title: "Invite Friend", description: "Challenge a peer", icon: "👥" },
      { id: "ranked", title: "Ranked Match", description: "Leaderboard affecting", icon: "🏆" },
      { id: "casual", title: "Casual Match", description: "Practice only", icon: "🎯" },
    ]

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <Button variant="ghost" onClick={handleBackToDashboard} className="mb-4 text-slate-600 hover:text-slate-800">
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
            Challenges ⚔️
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Compete in duels and team battles to test your skills and earn XP.
          </p>
        </div>

        {/* Challenge Mode Tabs */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-2 shadow-lg border">
            {["1v1", "4v4", "reasoning", "tournaments"].map((mode) => (
              <Button
                key={mode}
                variant={challengeMode === mode ? "default" : "ghost"}
                onClick={() => setChallengeMode(mode)}
                className={`mx-1 ${
                  challengeMode === mode
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {mode.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Challenge Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challengeTypes.map((challenge) => (
            <Card
              key={challenge.id}
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${challenge.gradient} opacity-90`} />
              <CardContent className="relative z-10 p-6 text-white text-center">
                <div className="text-4xl mb-4">{challenge.icon}</div>
                <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                <p className="text-sm opacity-90 mb-4">{challenge.description}</p>
                <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">{challenge.xp}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subject Selection */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-slate-800">Choose Your Subject</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedChallengeSubject === subject.id ? "ring-4 ring-purple-500 shadow-xl" : "hover:shadow-lg"
                }`}
                onClick={() => setSelectedChallengeSubject(subject.id)}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-12 h-12 ${subject.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                  >
                    <span className="text-white text-xl">{subject.icon}</span>
                  </div>
                  <p className="font-semibold text-sm text-slate-800">{subject.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Matchmaking Area */}
        <div className="bg-white rounded-xl p-6 shadow-lg border">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Ready to Battle?</h2>

          {matchmakingState === "idle" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {matchmakingOptions.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all duration-300 bg-transparent"
                  onClick={() => setMatchmakingState("searching")}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <div className="text-center">
                    <p className="font-semibold text-slate-800">{option.title}</p>
                    <p className="text-xs text-slate-500">{option.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {matchmakingState === "searching" && (
            <div className="text-center space-y-4">
              <div className="animate-spin w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto"></div>
              <h3 className="text-xl font-semibold text-slate-800">Searching for Opponent...</h3>
              <p className="text-slate-600">Finding the perfect match for your skill level</p>
              <Button variant="outline" onClick={() => setMatchmakingState("idle")} className="mt-4">
                Cancel Search
              </Button>
            </div>
          )}
        </div>

        {/* Gameplay Preview */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Battle Preview</h2>
          <div className="bg-white rounded-lg p-4 shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">ST</span>
                </div>
                <p className="font-semibold text-sm">You</p>
                <div className="w-24 h-2 bg-blue-200 rounded-full mt-1">
                  <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">02:45</div>
                <p className="text-sm text-slate-600">Time Left</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">OP</span>
                </div>
                <p className="font-semibold text-sm">Opponent</p>
                <div className="w-24 h-2 bg-red-200 rounded-full mt-1">
                  <div className="w-1/2 h-full bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800 mb-2">7 - 4</div>
              <p className="text-sm text-slate-600">Correct Answers</p>
            </div>
          </div>
        </div>

        {/* Rewards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">🏆 Rewards & XP</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Win Bonus:</span>
                  <span className="font-semibold text-green-600">+100 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Accuracy Bonus:</span>
                  <span className="font-semibold text-blue-600">+25 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Speed Bonus:</span>
                  <span className="font-semibold text-purple-600">+15 XP</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">🎖️ Achievements</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🥇</span>
                  <span className="text-sm text-slate-600">Duel Champion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🎯</span>
                  <span className="text-sm text-slate-600">Accuracy Master</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">⚡</span>
                  <span className="text-sm text-slate-600">Speed Demon</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Snippet */}
        <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">🏆 Current Champions</h3>
              <Button variant="outline" size="sm" onClick={() => setCurrentView("leaderboard")}>
                View Full Leaderboard
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🥇</span>
                  <span className="font-semibold">Alex Chen</span>
                </div>
                <span className="text-sm text-slate-600">1v1 Champion</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🛡️</span>
                  <span className="font-semibold">Team Phoenix</span>
                </div>
                <span className="text-sm text-slate-600">4v4 Champions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <FloatingChatbot />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="relative">
                <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full mr-4 hover:ring-2 hover:ring-blue-500/30 transition-all cursor-pointer"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all pointer-events-none">
                    <AvatarImage src="/student-avatar.png" alt="Student" />
                    <AvatarFallback className="bg-slate-700 text-white font-semibold">ST</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent id="profile-dropdown" className="w-64 p-2" align="end" role="menu" aria-label="Profile options">
                <div className="px-3 py-2 border-b border-slate-100 mb-2" role="none">
                  <p className="font-semibold text-slate-800">Sarah Thompson</p>
                  <p className="text-sm text-slate-500">Class 9 • 1,200 XP</p>
                </div>

                <DropdownMenuItem
                  className="cursor-pointer flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={handleProfileClick}
                  role="menuitem"
                  tabIndex={-1}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600">👤</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Profile</p>
                    <p className="text-xs text-slate-500">View your details</p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors"
                  onClick={handleAchievementsClick}
                  role="menuitem"
                  tabIndex={-1}
                >
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600">🏅</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Achievements</p>
                    <p className="text-xs text-slate-500">Trophy cabinet</p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  onClick={handleSettingsClick}
                  role="menuitem"
                  tabIndex={-1}
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="text-slate-600">⚙️</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Settings</p>
                    <p className="text-xs text-slate-500">Preferences</p>
                  </div>
                </DropdownMenuItem>

                <div className="border-t border-slate-100 mt-2 pt-2" role="none">
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors"
                    onClick={handleLogoutClick}
                    role="menuitem"
                    tabIndex={-1}
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600">🚪</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Logout</p>
                      <p className="text-xs text-slate-500">Sign out</p>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-2 rounded-full font-semibold cursor-pointer hover:bg-orange-200 transition-colors"
                onClick={handleStreakClick}
              >
                <span>🔥</span>
                <span>Streak: {streak}</span>
              </div>

              <div
                className="flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-full font-semibold cursor-pointer hover:bg-yellow-200 transition-colors"
                onClick={handleXPClick}
              >
                <span>⭐</span>
                <span>{points.toLocaleString()}</span>
              </div>

              <Button
                variant="outline"
                className="bg-purple-700 text-white border-0 hover:bg-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                onClick={handleLeaderboardClick}
              >
                <span className="mr-2 text-yellow-300">🏆</span>
                Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {currentView === "dashboard" && (
            <div>
              <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 text-balance">
                  Welcome to Your Learning Adventure! 🚀
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty">
                  Choose your path and start exploring. Every click brings you closer to mastering new skills!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {dashboardCards.map((card) => (
                  <Card
                    key={card.id}
                    className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2"
                    onClick={() => handleCardClick(card.id)}
                  >
                    <div className="absolute inset-0 bg-slate-800" />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${card.gradient} group-hover:${card.hoverGradient} transition-all duration-500`}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />

                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <span className="text-2xl text-white drop-shadow-lg">→</span>
                    </div>

                    <CardContent className="relative z-10 p-8 h-48 flex flex-col justify-center items-center text-center text-slate-100">
                      <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                        {card.icon}
                      </div>

                      <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-slate-100 transition-colors drop-shadow-lg">
                        {card.title}
                      </h3>

                      <p className="text-white group-hover:text-slate-100 transition-colors text-sm drop-shadow-lg">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentView === "community" && <CommunitySection handleBackToDashboard={handleBackToDashboard} />}
          {currentView === "gaming" && <GamingSection handleBackToDashboard={handleBackToDashboard} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} setCurrentView={setCurrentView} />}
          {currentView === "learning" && <LearningSection handleBackToDashboard={handleBackToDashboard} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />}
          {currentView === "challenges" && renderChallengesPage()}
          {currentView === "leaderboard" && renderLeaderboard()}
          {currentView === "streak" && renderStreakDashboardPage()}
          {currentView === "profile" && renderProfilePage()}
          {currentView === "xp" && renderXPDashboard()}
          {currentView === "achievements" && renderAchievementsPage()}
          {currentView === "binary-blaster" && <BinaryBlaster />}
          {currentView === "shapes" && <Shapes />}
          {currentView === "periodic-table" && <PeriodicTable />}
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard


