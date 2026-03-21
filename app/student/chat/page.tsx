"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Users, 
  Search, 
  Plus, 
  Hash,
  User,
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Wind,
  Baby,
  Shield,
  Activity,
  Loader2,
  UserPlus,
  Circle,
  Phone,
  Video,
  MoreVertical,
  X
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";

interface User {
  id: string
  name: string
  role: string
  specialty?: string
  isOnline: boolean
  lastSeen?: Date
}

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    role: string
    specialty?: string
  }
  timestamp: Date
  channelId: string
}

interface Channel {
  id: string
  name: string
  specialty?: string
  members: number
  isPrivate: boolean
  lastMessage?: string
  lastMessageTime?: Date
}

interface DirectMessage {
  id: string
  userId: string
  userName: string
  userRole: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  isOnline: boolean
}

export default function MedicalChatPage() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<"channels" | "direct">("channels");
  const [activeChannel, setActiveChannel] = useState<string>("general");
  const [activeDMUser, setActiveDMUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserSearch, setShowUserSearch] = useState(false);
  
  const [channels, setChannels] = useState<Channel[]>([
    { id: "general", name: "General Discussion", members: 1245, isPrivate: false, lastMessage: "Welcome to SynapseMed community!" },
    { id: "anatomy", name: "Anatomy", specialty: "Anatomy", members: 324, isPrivate: false },
    { id: "cardiology", name: "Cardiology", specialty: "Cardiology", members: 567, isPrivate: false },
    { id: "neurology", name: "Neurology", specialty: "Neurology", members: 234, isPrivate: false },
    { id: "pediatrics", name: "Pediatrics", specialty: "Pediatrics", members: 189, isPrivate: false },
    { id: "emergency", name: "Emergency Medicine", specialty: "Emergency Medicine", members: 421, isPrivate: false },
  ]);
  
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([
    { 
      id: "dm1", 
      userId: "user1", 
      userName: "Dr. Sarah Miller", 
      userRole: "specialist",
      lastMessage: "Thanks for the consultation notes!",
      lastMessageTime: new Date(Date.now() - 1800000),
      unreadCount: 0,
      isOnline: true
    },
    { 
      id: "dm2", 
      userId: "user2", 
      userName: "Alex Johnson", 
      userRole: "student",
      lastMessage: "Can you help me with this case?",
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 2,
      isOnline: false
    }
  ]);
  
  const [availableUsers, setAvailableUsers] = useState<User[]>([
    { id: "user3", name: "Dr. Michael Chen", role: "lecturer", specialty: "Cardiology", isOnline: true },
    { id: "user4", name: "Emma Rodriguez", role: "student", isOnline: false, lastSeen: new Date(Date.now() - 7200000) },
    { id: "user5", name: "Dr. Lisa Park", role: "specialist", specialty: "Neurology", isOnline: true },
  ]);
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      content: "Welcome to the SynapseMed community chat! This is a space for medical students, lecturers, and specialists to collaborate.", 
      sender: { id: "system", name: "System", role: "admin" }, 
      timestamp: new Date(Date.now() - 3600000),
      channelId: "general"
    },
    { 
      id: "2", 
      content: "Hi everyone! I'm a 3rd year medical student. Just joined to discuss cardiology cases.", 
      sender: { id: "user2", name: "Alex Johnson", role: "student", specialty: "Cardiology" }, 
      timestamp: new Date(Date.now() - 1800000),
      channelId: "general"
    },
  ]);
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const specialtyChannels = [
    { name: "Cardiology", icon: Heart, color: "text-red-500" },
    { name: "Respiratory", icon: Wind, color: "text-blue-500" },
    { name: "Neurology", icon: Brain, color: "text-purple-500" },
    { name: "Orthopedics", icon: Bone, color: "text-yellow-600" },
    { name: "Pediatrics", icon: Baby, color: "text-pink-500" },
    { name: "Emergency Medicine", icon: Shield, color: "text-orange-500" },
    { name: "Anatomy", icon: Activity, color: "text-green-500" },
  ];

  useEffect(() => {
    if (activeView === "channels") {
      loadMessages(activeChannel);
    } else if (activeDMUser) {
      loadDirectMessages(activeDMUser);
    }
  }, [activeChannel, activeDMUser, activeView]);

  const loadMessages = async (channelId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?channelId=${channelId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Convert string timestamps to Date objects
          const formattedMessages = data.data.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedMessages);
        }
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };
  
  const loadDirectMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/chat/direct-messages?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const formattedMessages = data.data.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedMessages);
        }
      }
    } catch (error) {
      console.error("Failed to load direct messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    setIsLoading(true);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: {
        id: user?.id || "current-user",
        name: user?.name || "Current User",
        role: user?.role || "student",
        specialty: user?.field
      },
      timestamp: new Date(),
      channelId: activeView === "channels" ? activeChannel : `dm-${activeDMUser}`
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    try {
      const endpoint = activeView === "channels" ? "/api/chat/messages" : "/api/chat/direct-messages";
      const body = activeView === "channels" 
        ? { message: message, channelId: activeChannel, userId: user?.id }
        : { message: message, receiverId: activeDMUser, userId: user?.id };
        
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startDirectMessage = (userId: string, userName: string, userRole: string) => {
    const existingDM = directMessages.find(dm => dm.userId === userId);
    
    if (!existingDM) {
      const newDM: DirectMessage = {
        id: `dm-${userId}`,
        userId,
        userName,
        userRole,
        unreadCount: 0,
        isOnline: availableUsers.find(u => u.id === userId)?.isOnline || false
      };
      setDirectMessages(prev => [...prev, newDM]);
    }
    
    setActiveDMUser(userId);
    setActiveView("direct");
    setShowUserSearch(false);
  };

  const filteredMessages = activeView === "channels" 
    ? messages.filter(msg => msg.channelId === activeChannel)
    : messages.filter(msg => msg.channelId === `dm-${activeDMUser}`);

  const filteredUsers = availableUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !directMessages.some(dm => dm.userId === u.id)
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#213874] flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Medical Chat
          </h1>
        </div>

        {/* View Toggle */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <Button
              variant={activeView === "channels" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("channels")}
              className="flex-1"
            >
              <Hash className="h-4 w-4 mr-2" />
              Channels
            </Button>
            <Button
              variant={activeView === "direct" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("direct")}
              className="flex-1"
            >
              <User className="h-4 w-4 mr-2" />
              Direct
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={activeView === "channels" ? "Search channels..." : "Search conversations..."}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content based on active view */}
        <div className="flex-1 overflow-y-auto">
          {activeView === "channels" ? (
            <>
              {/* Public Channels */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase">Public Channels</h2>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      className={`w-full flex items-center p-2 rounded-lg text-left ${
                        activeChannel === channel.id 
                          ? "bg-[#213874] text-white" 
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setActiveChannel(channel.id)}
                    >
                      <Hash className="h-4 w-4 mr-2" />
                      <span className="flex-1">{channel.name}</span>
                      <span className="text-xs">{channel.members}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialty Channels */}
              <div className="p-4 border-t border-gray-200">
                <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">By Specialty</h2>
                <div className="space-y-1">
                  {specialtyChannels.map((specialty, index) => {
                    const Icon = specialty.icon;
                    return (
                      <button
                        key={index}
                        className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                        onClick={() => {
                          const channelId = specialty.name.toLowerCase().replace(/\s+/g, '-');
                          setActiveChannel(channelId);
                        }}
                      >
                        <Icon className={`h-4 w-4 mr-2 ${specialty.color}`} />
                        <span>{specialty.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Direct Messages */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase">Direct Messages</h2>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowUserSearch(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {directMessages.map((dm) => (
                    <button
                      key={dm.id}
                      className={`w-full flex items-center p-2 rounded-lg text-left ${
                        activeDMUser === dm.userId 
                          ? "bg-[#213874] text-white" 
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => {
                        setActiveDMUser(dm.userId);
                        // Mark as read
                        setDirectMessages(prev => prev.map(d => 
                          d.id === dm.id ? { ...d, unreadCount: 0 } : d
                        ));
                      }}
                    >
                      <div className="relative mr-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        {dm.isOnline && (
                          <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{dm.userName}</span>
                          {dm.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white text-xs px-1 py-0">
                              {dm.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {dm.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#213874] flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role} {user?.field && `• ${user.field}`}</p>
            </div>
            <Button variant="ghost" size="icon">
              <Stethoscope className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {activeView === "channels" ? (
                <>
                  <Hash className="h-5 w-5 text-gray-500 mr-2" />
                  <h2 className="text-lg font-semibold">
                    {channels.find(c => c.id === activeChannel)?.name || "General Discussion"}
                  </h2>
                  <span className="ml-2 text-sm text-gray-500">
                    ({channels.find(c => c.id === activeChannel)?.members || 0} members)
                  </span>
                </>
              ) : (
                <>
                  <div className="relative mr-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    {directMessages.find(dm => dm.userId === activeDMUser)?.isOnline && (
                      <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                    )}
                  </div>
                  <h2 className="text-lg font-semibold">
                    {directMessages.find(dm => dm.userId === activeDMUser)?.userName || "Select a conversation"}
                  </h2>
                </>
              )}
            </div>
            
            {activeView === "direct" && activeDMUser && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-20">
                <MessageCircle className="h-12 w-12 mb-2 opacity-20" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div key={msg.id} className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-[#213874] flex items-center justify-center text-white">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline">
                      <span className="font-medium">{msg.sender.name}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.sender.role === "specialist" && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Specialist
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-gray-700">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex">
            <Input
              placeholder={`Message ${activeView === "channels" 
                ? `#${channels.find(c => c.id === activeChannel)?.name || 'channel'}` 
                : `${directMessages.find(dm => dm.userId === activeDMUser)?.userName || 'user'}`
              }...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 mr-2"
              disabled={isLoading || (activeView === "direct" && !activeDMUser)}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || isLoading || (activeView === "direct" && !activeDMUser)}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* User Search Modal */}
      {showUserSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-96 overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Start a conversation</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowUserSearch(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredUsers.map((u) => (
                    <button
                      key={u.id}
                      className="w-full flex items-center p-2 hover:bg-gray-100 rounded-lg"
                      onClick={() => startDirectMessage(u.id, u.name, u.role)}
                    >
                      <div className="relative mr-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        {u.isOnline && (
                          <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.role} {u.specialty && `• ${u.specialty}`}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}