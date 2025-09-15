"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  ChevronRight,
  GraduationCap,
  Award,
  Clock,
  MessageSquare,
  Mail,
  Filter,
  SortAsc,
  Eye,
  Edit,
  MoreHorizontal,
  Target,
  AlertCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CurrentView = "dashboard" | "roster" | "progress" | "analytics" | "profiles"

interface Student {
  id: string
  name: string
  email: string
  avatar: string
  grade: number
  attendance: number
  status: "active" | "inactive" | "at-risk"
  subjects: string[]
  lastActive: string
  assignments: {
    completed: number
    total: number
  }
}

interface StudentProfile {
  id: string
  name: string
  email: string
  avatar: string
  grade: number
  attendance: number
  status: "active" | "inactive" | "at-risk"
  subjects: string[]
  lastActive: string
  assignments: {
    completed: number
    total: number
  }
  academicHistory: {
    semester: string
    gpa: number
    subjects: { name: string; grade: number }[]
  }[]
  behaviorNotes: {
    date: string
    note: string
    type: "positive" | "neutral" | "concern"
  }[]
  communications: {
    date: string
    type: "email" | "phone" | "meeting"
    participant: string
    subject: string
    summary: string
  }[]
}

interface Student {
  id: string
  name: string
  email: string
  grade: string
  averageScore: number
  attendance: number
  lastActive: string
  status: "active" | "inactive" | "at-risk"
  subjects: string[]
  parentContact: string
  avatar?: string
  // Extended profile data
  dateOfBirth?: string
  address?: string
  parentName?: string
  parentPhone?: string
  emergencyContact?: string
  medicalNotes?: string
  learningStyle?: string
  interests?: string[]
  goals?: string[]
}

interface StudentProfile extends Student {
  academicHistory: {
    subject: string
    grades: { period: string; grade: number; letterGrade: string }[]
    assignments: {
      name: string
      score: number
      maxScore: number
      date: string
      feedback: string
      status: "completed" | "pending" | "overdue"
    }[]
  }[]
  behaviorNotes: {
    date: string
    type: "positive" | "concern" | "neutral"
    note: string
    teacher: string
  }[]
  communicationLog: {
    date: string
    type: "email" | "phone" | "meeting" | "note"
    participant: string
    subject: string
    summary: string
  }[]
  attendanceHistory: {
    date: string
    status: "present" | "absent" | "late" | "excused"
    reason?: string
  }[]
}

interface ProgressData {
  studentId: string
  studentName: string
  subject: string
  currentGrade: number
  targetGrade: number
  assignments: {
    name: string
    score: number
    maxScore: number
    date: string
    status: "completed" | "pending" | "overdue"
  }[]
  weeklyProgress: {
    week: string
    score: number
  }[]
  strengths: string[]
  improvements: string[]
}

interface AnalyticsData {
  classPerformance: {
    month: string
    averageScore: number
    attendance: number
    completionRate: number
  }[]
  subjectBreakdown: {
    subject: string
    averageScore: number
    studentCount: number
    color: string
  }[]
  gradeDistribution: {
    grade: string
    count: number
    percentage: number
  }[]
  attendancePatterns: {
    day: string
    present: number
    absent: number
  }[]
  topPerformers: {
    studentId: string
    name: string
    score: number
    improvement: number
  }[]
  strugglingStudents: {
    studentId: string
    name: string
    score: number
    decline: number
    subjects: string[]
  }[]
}

const TeacherDashboard = () => {
  const [currentView, setCurrentView] = useState<CurrentView>("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterBy, setFilterBy] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [progressTimeframe, setProgressTimeframe] = useState("month")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState("semester")
  const [analyticsView, setAnalyticsView] = useState("overview")
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<StudentProfile | null>(null)
  const [newNote, setNewNote] = useState("")
  const [newCommunication, setNewCommunication] = useState({ type: "email", participant: "", subject: "", summary: "" })

  // Mock data for demonstration
  const classStats = {
    totalStudents: 28,
    activeStudents: 25,
    averageGrade: 87,
    completionRate: 92,
  }

  const students: Student[] = [
    {
      id: "1",
      name: "Emma Johnson",
      email: "emma.johnson@school.edu",
      grade: "A",
      averageScore: 95,
      attendance: 98,
      lastActive: "2 hours ago",
      status: "active",
      subjects: ["Math", "Science", "English"],
      parentContact: "parent.johnson@email.com",
      avatar: "/student-girl-emma.jpg",
      dateOfBirth: "2010-03-15",
      address: "123 Oak Street, Springfield",
      parentName: "Jennifer Johnson",
      parentPhone: "(555) 123-4567",
      emergencyContact: "Michael Johnson (555) 123-4568",
      learningStyle: "Visual learner",
      interests: ["Mathematics", "Science experiments", "Reading"],
      goals: ["Maintain A average", "Join Math Olympiad team"],
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@school.edu",
      grade: "B+",
      averageScore: 88,
      attendance: 95,
      lastActive: "4 hours ago",
      status: "active",
      subjects: ["Math", "Science", "History"],
      parentContact: "parent.chen@email.com",
      avatar: "/student-boy-michael.jpg",
      dateOfBirth: "2010-07-22",
      address: "456 Pine Avenue, Springfield",
      parentName: "Lisa Chen",
      parentPhone: "(555) 234-5678",
      emergencyContact: "David Chen (555) 234-5679",
      learningStyle: "Kinesthetic learner",
      interests: ["Science", "Technology", "Sports"],
      goals: ["Improve in Math", "Join Science Club"],
    },
    {
      id: "3",
      name: "Sarah Williams",
      email: "sarah.williams@school.edu",
      grade: "A-",
      averageScore: 92,
      attendance: 100,
      lastActive: "6 hours ago",
      status: "active",
      subjects: ["English", "History", "Art"],
      parentContact: "parent.williams@email.com",
      avatar: "/student-girl-sarah.jpg",
      dateOfBirth: "2010-11-08",
      address: "789 Maple Drive, Springfield",
      parentName: "Robert Williams",
      parentPhone: "(555) 345-6789",
      emergencyContact: "Mary Williams (555) 345-6790",
      learningStyle: "Auditory learner",
      interests: ["Literature", "Creative writing", "Art"],
      goals: ["Publish school newspaper article", "Improve public speaking"],
    },
    {
      id: "4",
      name: "David Brown",
      email: "david.brown@school.edu",
      grade: "C+",
      averageScore: 78,
      attendance: 85,
      lastActive: "1 day ago",
      status: "at-risk",
      subjects: ["Math", "Science"],
      parentContact: "parent.brown@email.com",
      avatar: "/student-boy-david.jpg",
      dateOfBirth: "2010-05-12",
      address: "321 Elm Street, Springfield",
      parentName: "Patricia Brown",
      parentPhone: "(555) 456-7890",
      emergencyContact: "James Brown (555) 456-7891",
      learningStyle: "Visual learner",
      interests: ["Video games", "Drawing", "Music"],
      goals: ["Pass Math with B grade", "Complete all assignments on time"],
    },
    {
      id: "5",
      name: "Lisa Garcia",
      email: "lisa.garcia@school.edu",
      grade: "B",
      averageScore: 85,
      attendance: 92,
      lastActive: "3 hours ago",
      status: "active",
      subjects: ["Spanish", "English", "History"],
      parentContact: "parent.garcia@email.com",
      avatar: "/student-girl-lisa.jpg",
      dateOfBirth: "2010-09-30",
      address: "654 Cedar Lane, Springfield",
      parentName: "Maria Garcia",
      parentPhone: "(555) 567-8901",
      emergencyContact: "Carlos Garcia (555) 567-8902",
      learningStyle: "Auditory learner",
      interests: ["Languages", "Cultural studies", "Dance"],
      goals: ["Become fluent in English", "Join debate team"],
    },
    {
      id: "6",
      name: "James Wilson",
      email: "james.wilson@school.edu",
      grade: "A",
      averageScore: 94,
      attendance: 97,
      lastActive: "1 hour ago",
      status: "active",
      subjects: ["Math", "Physics", "Computer Science"],
      parentContact: "parent.wilson@email.com",
      avatar: "/student-boy-james.jpg",
      dateOfBirth: "2010-01-18",
      address: "987 Birch Road, Springfield",
      parentName: "Susan Wilson",
      parentPhone: "(555) 678-9012",
      emergencyContact: "Tom Wilson (555) 678-9013",
      learningStyle: "Logical learner",
      interests: ["Programming", "Robotics", "Chess"],
      goals: ["Learn advanced programming", "Build a robot"],
    },
  ]

  // Extended profile data for selected students
  const getStudentProfile = (studentId: string): StudentProfile | null => {
    const student = students.find((s) => s.id === studentId)
    if (!student) return null

    // Mock extended profile data
    const profiles: { [key: string]: Partial<StudentProfile> } = {
      "1": {
        academicHistory: [
          {
            subject: "Math",
            grades: [
              { period: "Q1", grade: 94, letterGrade: "A" },
              { period: "Q2", grade: 96, letterGrade: "A" },
              { period: "Q3", grade: 95, letterGrade: "A" },
            ],
            assignments: [
              {
                name: "Algebra Quiz",
                score: 18,
                maxScore: 20,
                date: "2024-01-15",
                feedback: "Excellent work on complex problems!",
                status: "completed",
              },
              {
                name: "Geometry Test",
                score: 47,
                maxScore: 50,
                date: "2024-01-10",
                feedback: "Great understanding of concepts",
                status: "completed",
              },
            ],
          },
        ],
        behaviorNotes: [
          {
            date: "2024-01-10",
            type: "positive",
            note: "Helped classmates with difficult problems",
            teacher: "Ms. Smith",
          },
          {
            date: "2024-01-05",
            type: "positive",
            note: "Excellent participation in class discussion",
            teacher: "Ms. Smith",
          },
        ],
        communicationLog: [
          {
            date: "2024-01-08",
            type: "email",
            participant: "Jennifer Johnson (Parent)",
            subject: "Emma's Progress",
            summary: "Discussed Emma's excellent performance and upcoming Math Olympiad",
          },
        ],
        attendanceHistory: [
          { date: "2024-01-15", status: "present" },
          { date: "2024-01-14", status: "present" },
          { date: "2024-01-13", status: "present" },
        ],
      },
      "4": {
        academicHistory: [
          {
            subject: "Math",
            grades: [
              { period: "Q1", grade: 82, letterGrade: "B-" },
              { period: "Q2", grade: 76, letterGrade: "C+" },
              { period: "Q3", grade: 78, letterGrade: "C+" },
            ],
            assignments: [
              {
                name: "Basic Algebra",
                score: 12,
                maxScore: 20,
                date: "2024-01-14",
                feedback: "Need to review basic concepts",
                status: "completed",
              },
              {
                name: "Practice Problems",
                score: 0,
                maxScore: 25,
                date: "2024-01-18",
                feedback: "Missing assignment",
                status: "overdue",
              },
            ],
          },
        ],
        behaviorNotes: [
          { date: "2024-01-12", type: "concern", note: "Seems distracted during lessons", teacher: "Ms. Smith" },
          {
            date: "2024-01-08",
            type: "positive",
            note: "Asked good questions during office hours",
            teacher: "Ms. Smith",
          },
        ],
        communicationLog: [
          {
            date: "2024-01-10",
            type: "phone",
            participant: "Patricia Brown (Parent)",
            subject: "David's Struggles",
            summary: "Discussed strategies to help David improve in Math",
          },
        ],
        attendanceHistory: [
          { date: "2024-01-15", status: "present" },
          { date: "2024-01-14", status: "late", reason: "Bus delay" },
          { date: "2024-01-13", status: "absent", reason: "Sick" },
        ],
      },
    }

    return { ...student, ...profiles[studentId] } as StudentProfile
  }

  const recentActivity = [
    { student: "Emma Johnson", action: "Completed Math Quiz", time: "2 hours ago", score: 95 },
    { student: "Michael Chen", action: "Submitted Science Project", time: "4 hours ago", score: 88 },
    { student: "Sarah Williams", action: "Completed Reading Assignment", time: "6 hours ago", score: 92 },
    { student: "David Brown", action: "Participated in Discussion", time: "1 day ago", score: null },
  ]

  const upcomingDeadlines = [
    { assignment: "Math Chapter 5 Test", dueDate: "Tomorrow", class: "Algebra I" },
    { assignment: "Science Lab Report", dueDate: "Friday", class: "Biology" },
    { assignment: "History Essay", dueDate: "Next Monday", class: "World History" },
  ]

  const dashboardCards = [
    {
      id: "roster",
      title: "Student Roster",
      description: "Manage your students",
      icon: Users,
      value: `${classStats.totalStudents} Students`,
      color: "bg-blue-500",
    },
    {
      id: "progress",
      title: "Progress Tracking",
      description: "Monitor student progress",
      icon: TrendingUp,
      value: `${classStats.completionRate}% Complete`,
      color: "bg-green-500",
    },
    {
      id: "analytics",
      title: "Analytics Dashboard",
      description: "View detailed insights",
      icon: BookOpen,
      value: `${classStats.averageGrade}% Avg Grade`,
      color: "bg-purple-500",
    },
    {
      id: "profiles",
      title: "Student Profiles",
      description: "Individual student details",
      icon: GraduationCap,
      value: "Detailed Views",
      color: "bg-orange-500",
    },
  ]

  const progressData: ProgressData[] = [
    {
      studentId: "1",
      studentName: "Emma Johnson",
      subject: "Math",
      currentGrade: 95,
      targetGrade: 98,
      assignments: [
        { name: "Algebra Quiz", score: 18, maxScore: 20, date: "2024-01-15", status: "completed" },
        { name: "Geometry Test", score: 47, maxScore: 50, date: "2024-01-10", status: "completed" },
        { name: "Word Problems", score: 0, maxScore: 25, date: "2024-01-20", status: "pending" },
      ],
      weeklyProgress: [
        { week: "Week 1", score: 92 },
        { week: "Week 2", score: 94 },
        { week: "Week 3", score: 95 },
        { week: "Week 4", score: 95 },
      ],
      strengths: ["Problem solving", "Quick calculations"],
      improvements: ["Word problems", "Show work clearly"],
    },
    {
      studentId: "2",
      studentName: "Michael Chen",
      subject: "Science",
      currentGrade: 88,
      targetGrade: 90,
      assignments: [
        { name: "Lab Report", score: 42, maxScore: 50, date: "2024-01-12", status: "completed" },
        { name: "Chemistry Quiz", score: 16, maxScore: 20, date: "2024-01-08", status: "completed" },
        { name: "Physics Project", score: 0, maxScore: 100, date: "2024-01-25", status: "overdue" },
      ],
      weeklyProgress: [
        { week: "Week 1", score: 85 },
        { week: "Week 2", score: 87 },
        { week: "Week 3", score: 88 },
        { week: "Week 4", score: 88 },
      ],
      strengths: ["Lab work", "Scientific method"],
      improvements: ["Time management", "Project completion"],
    },
    {
      studentId: "4",
      studentName: "David Brown",
      subject: "Math",
      currentGrade: 78,
      targetGrade: 85,
      assignments: [
        { name: "Basic Algebra", score: 12, maxScore: 20, date: "2024-01-14", status: "completed" },
        { name: "Fractions Test", score: 30, maxScore: 50, date: "2024-01-09", status: "completed" },
        { name: "Practice Problems", score: 0, maxScore: 25, date: "2024-01-18", status: "overdue" },
      ],
      weeklyProgress: [
        { week: "Week 1", score: 75 },
        { week: "Week 2", score: 76 },
        { week: "Week 3", score: 78 },
        { week: "Week 4", score: 78 },
      ],
      strengths: ["Effort", "Asking questions"],
      improvements: ["Basic concepts", "Homework completion"],
    },
  ]

  const analyticsData: AnalyticsData = {
    classPerformance: [
      { month: "Sep", averageScore: 82, attendance: 94, completionRate: 88 },
      { month: "Oct", averageScore: 84, attendance: 96, completionRate: 90 },
      { month: "Nov", averageScore: 86, attendance: 95, completionRate: 91 },
      { month: "Dec", averageScore: 87, attendance: 93, completionRate: 92 },
      { month: "Jan", averageScore: 87, attendance: 97, completionRate: 92 },
    ],
    subjectBreakdown: [
      { subject: "Math", averageScore: 85, studentCount: 28, color: "bg-blue-500" },
      { subject: "Science", averageScore: 88, studentCount: 25, color: "bg-green-500" },
      { subject: "English", averageScore: 90, studentCount: 28, color: "bg-purple-500" },
      { subject: "History", averageScore: 86, studentCount: 22, color: "bg-orange-500" },
      { subject: "Art", averageScore: 92, studentCount: 15, color: "bg-pink-500" },
    ],
    gradeDistribution: [
      { grade: "A (90-100%)", count: 8, percentage: 29 },
      { grade: "B (80-89%)", count: 12, percentage: 43 },
      { grade: "C (70-79%)", count: 6, percentage: 21 },
      { grade: "D (60-69%)", count: 2, percentage: 7 },
      { grade: "F (0-59%)", count: 0, percentage: 0 },
    ],
    attendancePatterns: [
      { day: "Mon", present: 26, absent: 2 },
      { day: "Tue", present: 27, absent: 1 },
      { day: "Wed", present: 25, absent: 3 },
      { day: "Thu", present: 28, absent: 0 },
      { day: "Fri", present: 24, absent: 4 },
    ],
    topPerformers: [
      { studentId: "1", name: "Emma Johnson", score: 95, improvement: 3 },
      { studentId: "6", name: "James Wilson", score: 94, improvement: 2 },
      { studentId: "3", name: "Sarah Williams", score: 92, improvement: 4 },
    ],
    strugglingStudents: [
      { studentId: "4", name: "David Brown", score: 78, decline: -2, subjects: ["Math", "Science"] },
    ],
  }

  const handleCardClick = (cardId: string) => {
    setCurrentView(cardId as CurrentView)
  }

  const handleViewProfile = (student: Student) => {
    const profile = getStudentProfile(student.id)
    setSelectedStudentProfile(profile)
    setCurrentView("profiles")
  }

  const getFilteredAndSortedStudents = () => {
    const filtered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())

      if (filterBy === "all") return matchesSearch
      if (filterBy === "active") return matchesSearch && student.status === "active"
      if (filterBy === "at-risk") return matchesSearch && student.status === "at-risk"
      if (filterBy === "inactive") return matchesSearch && student.status === "inactive"

      return matchesSearch
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "grade":
          return b.averageScore - a.averageScore
        case "attendance":
          return b.attendance - a.attendance
        case "lastActive":
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
        default:
          return 0
      }
    })
  }

  const getStatusBadge = (status: Student["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "at-risk":
        return <Badge className="bg-red-100 text-red-800">At Risk</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return null
    }
  }

  const getProgressSummary = () => {
    const totalStudents = students.length
    const onTrack = progressData.filter((p) => p.currentGrade >= p.targetGrade).length
    const needsSupport = progressData.filter((p) => p.currentGrade < p.targetGrade - 10).length
    const improving = progressData.filter((p) => {
      const recent = p.weeklyProgress.slice(-2)
      return recent.length >= 2 && recent[1].score > recent[0].score
    }).length

    return { totalStudents, onTrack, needsSupport, improving }
  }

  const renderStudentRoster = () => (
    <div className="space-y-6">
      {/* Roster Header with Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Student Roster</h2>
          <p className="text-muted-foreground">Manage and track your {students.length} students</p>
        </div>

        <div className="flex gap-2">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="at-risk">At Risk</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="grade">Grade</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="lastActive">Last Active</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getFilteredAndSortedStudents().map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={student.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewProfile(student)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Parent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(student.status)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Score</span>
                  <span className="font-medium">{student.averageScore}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Attendance</span>
                  <span className="font-medium">{student.attendance}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Active</span>
                  <span className="text-sm">{student.lastActive}</span>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-2">Subjects</p>
                  <div className="flex flex-wrap gap-1">
                    {student.subjects.map((subject) => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {getFilteredAndSortedStudents().length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No students found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{classStats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Today</p>
                <p className="text-2xl font-bold">{classStats.activeStudents}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Grade</p>
                <p className="text-2xl font-bold">{classStats.averageGrade}%</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{classStats.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon
          return (
            <Card
              key={card.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleCardClick(card.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${card.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{card.title}</h3>
                        <p className="text-sm text-muted-foreground">{card.description}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-accent">{card.value}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.student}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {activity.score && <Badge variant="secondary">{activity.score}%</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Deadlines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{deadline.assignment}</p>
                    <p className="text-xs text-muted-foreground">{deadline.class}</p>
                  </div>
                  <Badge variant="outline">{deadline.dueDate}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderProgressTracking = () => {
    const summary = getProgressSummary()

    return (
      <div className="space-y-6">
        {/* Progress Overview */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Student Progress Tracking</h2>
          <p className="text-muted-foreground">Monitor individual and class-wide academic progress</p>
        </div>

        {/* Progress Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">On Track</p>
                  <p className="text-2xl font-bold text-green-600">{summary.onTrack}</p>
                  <p className="text-xs text-muted-foreground">Meeting targets</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Improving</p>
                  <p className="text-2xl font-bold text-blue-600">{summary.improving}</p>
                  <p className="text-xs text-muted-foreground">Upward trend</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Need Support</p>
                  <p className="text-2xl font-bold text-red-600">{summary.needsSupport}</p>
                  <p className="text-xs text-muted-foreground">Below target</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{summary.totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Being tracked</p>
                </div>
                <Users className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={progressTimeframe} onValueChange={setProgressTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="math">Math</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Student Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {progressData.map((progress) => (
            <Card key={`${progress.studentId}-${progress.subject}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={students.find((s) => s.id === progress.studentId)?.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {progress.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{progress.studentName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{progress.subject}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{progress.currentGrade}%</p>
                    <p className="text-sm text-muted-foreground">Target: {progress.targetGrade}%</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Progress</span>
                      <span>
                        {progress.currentGrade}% / {progress.targetGrade}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.currentGrade / progress.targetGrade) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b">
                    <div className="flex space-x-4">
                      <button className="pb-2 px-1 border-b-2 border-blue-500 text-blue-600 text-sm font-medium">
                        Overview
                      </button>
                      <button className="pb-2 px-1 text-sm text-muted-foreground hover:text-foreground">
                        Assignments
                      </button>
                      <button className="pb-2 px-1 text-sm text-muted-foreground hover:text-foreground">
                        Insights
                      </button>
                    </div>
                  </div>

                  {/* Weekly Progress */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Weekly Progress</h4>
                    <div className="flex justify-between items-end space-x-1">
                      {progress.weeklyProgress.map((week, index) => (
                        <div key={index} className="flex flex-col items-center space-y-1">
                          <div
                            className="w-6 bg-blue-500 rounded-t"
                            style={{ height: `${(week.score / 100) * 40}px` }}
                          />
                          <span className="text-xs text-muted-foreground">{week.week.split(" ")[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths and Improvements */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-600 mb-2">Strengths</h4>
                      <div className="space-y-1">
                        {progress.strengths.map((strength, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-orange-600 mb-2">Areas to Improve</h4>
                      <div className="space-y-1">
                        {progress.improvements.map((improvement, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                            {improvement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Assignments */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Assignments</h4>
                    <div className="space-y-2">
                      {progress.assignments.slice(0, 3).map((assignment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div>
                            <p className="text-sm font-medium">{assignment.name}</p>
                            <p className="text-xs text-muted-foreground">{assignment.date}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">
                              {assignment.score}/{assignment.maxScore}
                            </span>
                            <Badge
                              variant={
                                assignment.status === "completed"
                                  ? "default"
                                  : assignment.status === "overdue"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {assignment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderAnalyticsDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Comprehensive insights into class performance and trends</p>
      </div>

      {/* Analytics Controls */}
      <div className="flex gap-4">
        <Select value={analyticsTimeframe} onValueChange={setAnalyticsTimeframe}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="semester">This Semester</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={analyticsView} onValueChange={setAnalyticsView}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Overview</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="attendance">Attendance</SelectItem>
            <SelectItem value="engagement">Engagement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Class Average</p>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-green-600">+2% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-blue-600">Stable</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assignment Completion</p>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-xs text-green-600">+5% improvement</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students At Risk</p>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-red-600">Needs attention</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.subjectBreakdown.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{subject.subject}</span>
                    <span className="text-sm text-muted-foreground">
                      {subject.averageScore}% ({subject.studentCount} students)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${subject.color}`}
                      style={{ width: `${subject.averageScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.gradeDistribution.map((grade) => (
                <div key={grade.grade} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded" />
                    <span className="text-sm">{grade.grade}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{grade.count} students</span>
                    <span className="text-xs text-muted-foreground">({grade.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.topPerformers.map((student, index) => (
                <div key={student.studentId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">+{student.improvement}% improvement</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{student.score}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Students Needing Support */}
        <Card>
          <CardHeader>
            <CardTitle>Students Needing Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.strugglingStudents.map((student) => (
                <div key={student.studentId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">Struggling in: {student.subjects.join(", ")}</p>
                    <p className="text-xs text-red-600">{student.decline}% decline</p>
                  </div>
                  <Badge variant="destructive">{student.score}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800">Focus Area: Math Performance</h4>
              <p className="text-sm text-blue-700">
                Consider additional practice sessions for students scoring below 80% in Math.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="text-sm font-medium text-green-800">Success: English Improvement</h4>
              <p className="text-sm text-green-700">Great progress in English! Continue current teaching methods.</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="text-sm font-medium text-orange-800">Attention: Friday Attendance</h4>
              <p className="text-sm text-orange-700">
                Friday attendance is consistently lower. Consider engaging Friday activities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderStudentProfiles = () => {
    if (!selectedStudentProfile) {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Student Profiles</h2>
            <p className="text-muted-foreground">Select a student from the roster to view their detailed profile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <Card
                key={student.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleViewProfile(student)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar>
                      <AvatarImage src={student.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.grade} Average</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">View Profile</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedStudentProfile(null)}>
              ← Back to Profiles
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={selectedStudentProfile.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {selectedStudentProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{selectedStudentProfile.name}</h2>
                <p className="text-muted-foreground">{selectedStudentProfile.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusBadge(selectedStudentProfile.status)}
                  <Badge variant="outline">{selectedStudentProfile.grade} Average</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Contact Parent
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info & Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{selectedStudentProfile.dateOfBirth || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedStudentProfile.address || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parent/Guardian</p>
                  <p className="font-medium">{selectedStudentProfile.parentName || "Not provided"}</p>
                  <p className="text-sm text-muted-foreground">{selectedStudentProfile.parentPhone || ""}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Emergency Contact</p>
                  <p className="font-medium">{selectedStudentProfile.emergencyContact || "Not provided"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Overall Average</span>
                  <span className="font-bold text-lg">{selectedStudentProfile.averageScore}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Attendance Rate</span>
                  <span className="font-medium">{selectedStudentProfile.attendance}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Active</span>
                  <span className="font-medium">{selectedStudentProfile.lastActive}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Learning Style</p>
                  <p className="font-medium">{selectedStudentProfile.learningStyle || "Not assessed"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interests</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedStudentProfile.interests?.map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    )) || <span className="text-sm text-muted-foreground">None listed</span>}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Goals</p>
                  <div className="space-y-1 mt-1">
                    {selectedStudentProfile.goals?.map((goal, index) => (
                      <p key={index} className="text-sm">
                        • {goal}
                      </p>
                    )) || <span className="text-sm text-muted-foreground">No goals set</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Academic History & Communication */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStudentProfile.academicHistory?.map((subject) => (
                  <div key={subject.subject} className="mb-6 last:mb-0">
                    <h4 className="font-medium mb-3">{subject.subject}</h4>

                    {/* Grades Timeline */}
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Quarter Grades</p>
                      <div className="flex space-x-4">
                        {subject.grades.map((grade) => (
                          <div key={grade.period} className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                              <span className="font-bold text-blue-800">{grade.letterGrade}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{grade.period}</p>
                            <p className="text-xs">{grade.grade}%</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Assignments */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Recent Assignments</p>
                      <div className="space-y-2">
                        {subject.assignments.map((assignment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <p className="text-sm font-medium">{assignment.name}</p>
                              <p className="text-xs text-muted-foreground">{assignment.date}</p>
                              <p className="text-xs text-muted-foreground">{assignment.feedback}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {assignment.score}/{assignment.maxScore}
                              </p>
                              <Badge
                                variant={
                                  assignment.status === "completed"
                                    ? "default"
                                    : assignment.status === "overdue"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {assignment.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground">No academic history available</p>}
              </CardContent>
            </Card>

            {/* Behavior Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Behavior Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedStudentProfile.behaviorNotes?.map((note, index) => (
                    <div key={index} className="p-3 rounded-lg border-l-4 border-l-blue-500 bg-muted">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={
                            note.type === "positive" ? "default" : note.type === "concern" ? "destructive" : "secondary"
                          }
                          className="text-xs"
                        >
                          {note.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{note.date}</span>
                      </div>
                      <p className="text-sm">{note.note}</p>
                      <p className="text-xs text-muted-foreground mt-1">- {note.teacher}</p>
                    </div>
                  )) || <p className="text-muted-foreground">No behavior notes recorded</p>}
                </div>
              </CardContent>
            </Card>

            {/* Communication Log */}
            <Card>
              <CardHeader>
                <CardTitle>Communication Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedStudentProfile.communicationLog?.map((comm, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {comm.type}
                          </Badge>
                          <span className="text-sm font-medium">{comm.subject}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{comm.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{comm.participant}</p>
                      <p className="text-sm">{comm.summary}</p>
                    </div>
                  )) || <p className="text-muted-foreground">No communication history</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your students today.</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex space-x-2">
              <Button
                variant={currentView === "dashboard" ? "default" : "outline"}
                onClick={() => setCurrentView("dashboard")}
                size="sm"
              >
                Dashboard
              </Button>
              <Button
                variant={currentView === "roster" ? "default" : "outline"}
                onClick={() => setCurrentView("roster")}
                size="sm"
              >
                Roster
              </Button>
              <Button
                variant={currentView === "progress" ? "default" : "outline"}
                onClick={() => setCurrentView("progress")}
                size="sm"
              >
                Progress
              </Button>
              <Button
                variant={currentView === "analytics" ? "default" : "outline"}
                onClick={() => setCurrentView("analytics")}
                size="sm"
              >
                Analytics
              </Button>
              <Button
                variant={currentView === "profiles" ? "default" : "outline"}
                onClick={() => setCurrentView("profiles")}
                size="sm"
              >
                Profiles
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {currentView === "dashboard" && renderDashboard()}
        {currentView === "roster" && renderStudentRoster()}
        {currentView === "progress" && renderProgressTracking()}
        {currentView === "analytics" && renderAnalyticsDashboard()}
        {currentView === "profiles" && renderStudentProfiles()}
      </div>
    </div>
  )
}

export default TeacherDashboard
