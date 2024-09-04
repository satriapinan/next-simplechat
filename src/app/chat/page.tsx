'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { CardFooter } from '@/components/ui/card';
import axiosInstance from '@/utils/axiosInstance';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  PencilIcon,
  DotsVerticalIcon,
  TrashIcon,
  UserAddIcon,
} from '@heroicons/react/outline';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

export default function ChatApp() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [userData, setUserData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  const socket = io('http://localhost:3001');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedChat !== null) {
      const roomId = chatRooms[selectedChat]?._id;
      if (roomId) {
        socket.emit('joinRoom', roomId);
      }

      socket.on('message', (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload]);
      });

      return () => {
        if (roomId) {
          socket.emit('leaveRoom', roomId);
        }
        socket.off('message');
      };
    }
  }, [selectedChat]);

  const fetchChatRooms = async () => {
    try {
      const response = await axiosInstance.get('/chatrooms');
      const allChatRooms = response.data.data;

      const userEmail = userData?.email;
      const userChatRooms = allChatRooms.filter((room: any) =>
        room.participants.some(
          (participant: any) => participant.userId.email === userEmail
        )
      );

      setChatRooms(userChatRooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchChatRooms();
    }
  }, [userData]);

  const handleCreateRoom = async () => {
    if (!userData?.email) {
      console.error('User email is not available');
      return;
    }

    try {
      const response = await axiosInstance.post('/chatrooms/create', {
        name: newRoomName,
        participants: [userData.email],
      });
      setChatRooms([...chatRooms, response.data.data]);
      setNewRoomName('');
    } catch (error) {
      console.error('Error creating chat room:', error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await axiosInstance.delete(`/chatrooms/${roomId}`);

      const updatedRooms = chatRooms.filter((room) => room._id !== roomId);
      setChatRooms(updatedRooms);

      if (selectedChat !== null && chatRooms[selectedChat]._id === roomId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error('Error deleting chat room:', error);
    }
  };

  const handleSendMessage = () => {
    if (selectedChat !== null && newMessage.trim()) {
      const roomId = chatRooms[selectedChat]?._id;
      const messageData = {
        chatRoomId: roomId,
        message: newMessage,
        senderId: userData?._id,
      };

      socket.emit('message', messageData);
      setNewMessage('');
    }
  };

  const handleInviteUser = async () => {
    if (selectedChat !== null) {
      try {
        const roomId = chatRooms[selectedChat]._id;
        await axiosInstance.post(`/chatrooms/${roomId}/invite`, {
          email: inviteEmail,
        });

        setInviteEmail('');
        setIsInviteDialogOpen(false);
      } catch (error) {
        console.error('Error inviting user:', error);
      }
    }
  };

  const filteredChatRooms = chatRooms.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();

    document.cookie
      .split(';')
      .forEach(
        (cookie) =>
          (document.cookie = cookie
            .replace(/^ +/, '')
            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`))
      );

    router.push('/');
  };

  if (loading)
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="flex items-center justify-center space-x-2">
          <div
            className="w-8 h-8 border-4 border-t-transparent border-grey-300 border-solid rounded-full animate-spin"
            role="status"
          ></div>
          <span className="text-gray-500 text-lg">Loading chat rooms...</span>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen">
      <div className="w-14 bg-[#495464] shadow-md text-primary flex flex-col items-center justify-between py-3">
        <Image
          src="/images/simplechat-logo-white.png"
          alt="SimpleChat Logo"
          width={35}
          height={35}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/user.jpg" alt="User Avatar" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-3">
            <DropdownMenuItem className="p-0">
              <Button variant="logout" onClick={handleLogout}>
                <ArrowLeftIcon className="mr-2" />
                Log out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-1/4 bg-[#E8E8E8] border-r-2 border-gray-300 text-primary flex flex-col">
        <div className="p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Chats</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <PencilIcon
                  className="h-6 w-6 cursor-pointer text-primary"
                  onClick={() => setIsDialogOpen(true)}
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Chat Room</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new chat room.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                  <Input
                    placeholder="Chat Room Name"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateRoom}>Create</Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search room chat"
              value={searchTerm}
              className="shadow-none border-2 bg-[#F4F4F2] border-gray-500 focus-visible:ring-0"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filteredChatRooms.map((chat, index) => (
            <div
              key={chat._id}
              className="cursor-pointer"
              onClick={() => setSelectedChat(index)}
            >
              <div
                className={`flex justify-between items-center p-3 mx-4 rounded-lg ${
                  selectedChat === index ? 'bg-[#F4F4F2]' : ''
                }`}
              >
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src="/images/user.jpg" alt={chat.name} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">{chat.name}</h2>
                    <p className="text-xs text-gray-400">
                      Created at{' '}
                      {format(new Date(chat.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
                <TrashIcon
                  className="h-6 w-6 text-destructive cursor-pointer"
                  onClick={() => handleDeleteRoom(chat._id)}
                />
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {selectedChat === null ? (
        <div className="flex-1 bg-[#F4F4F2] gap-2 flex flex-col justify-center items-center">
          <Image
            src="/images/simplechat-logo.png"
            alt="SimpleChat Logo"
            width={80}
            height={80}
          />
          <h1 className="text-4xl font-semibold text-primary hidden md:block">
            SimpleChat
          </h1>
          <div className="flex flex-col justify-center items-center text-center">
            <span>Stay connected and enjoy simple, effortless messaging.</span>
            <span>Select a chat room to get started.</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-[#F4F4F2] flex flex-col">
          <div className="py-2 px-4 border-b border-gray-300 bg-[#E8E8E8] flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="/images/user.jpg" alt="user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">{chatRooms[selectedChat]?.name}</h2>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DotsVerticalIcon className="h-6 w-6 cursor-pointer text-gray-600" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-3">
                <DropdownMenuItem
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setIsInviteDialogOpen(true)}
                >
                  <UserAddIcon className="h-5 w-5" />
                  <span>Invite</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ScrollArea className="flex-1 p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'You' ? 'justify-end' : ''}`}
              >
                <div
                  className={`p-3 mb-3 rounded-lg text-sm ${
                    msg.sender === 'You'
                      ? 'bg-[#1f2937] text-white'
                      : 'bg-white'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs text-gray-400 block text-right">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </ScrollArea>
          <CardFooter className="border-t border-gray-300 bg-[#E8E8E8] py-2 px-3">
            <Input
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full mr-2 focus-visible:ring-0 shadow-none font-[500]"
            />
            <Button type="submit" onClick={handleSendMessage}>
              Send
            </Button>
          </CardFooter>
        </div>
      )}

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Enter the email of the user you want to invite to the chat room.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <Input
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => handleInviteUser()}>Invite</Button>
            <Button
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
