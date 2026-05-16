"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Users, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccount } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Types for our data
interface Topic {
  id: number;
  title: string;
  icon_color: number;
  icon_emoji: string | null;
}

interface Group {
  id: number;
  title: string;
  participants_count: number;
  username: string | null;
  description: string | null;
  type: "group" | "supergroup" | "channel";
  is_forum?: boolean;
  topics?: Topic[];
}

interface GroupData {
  regular_groups: Group[];
  supergroups: Group[];
  channels: Group[];
}

// Demo groups data - replace this with actual API call
const demo: GroupData = {
  regular_groups: [
    {
      id: 4642130935,
      title: "web3 testing",
      participants_count: 0,
      username: null,
      description: null,
      type: "group",
    },
    {
      id: 4731770966,
      title: "0G Builders - Kolkata",
      participants_count: 0,
      username: null,
      description: null,
      type: "group",
    },
  ],
  supergroups: [
    {
      id: 2247894122,
      title: "Unicast AI - Community Channel Web3 Jobs",
      participants_count: 7464,
      username: "unicastaicommunity",
      description: null,
      type: "supergroup",
      is_forum: true,
      topics: [
        {
          id: 1,
          title: "General",
          icon_color: 7322096,
          icon_emoji: null,
        },
      ],
    },
    {
      id: 1564212308,
      title: "HyperDrive Community",
      participants_count: 575,
      username: "hyperdrivehd",
      description: null,
      type: "supergroup",
      is_forum: true,
      topics: [
        {
          id: 17,
          title: "Queries",
          icon_color: 7322096,
          icon_emoji: null,
        },
        {
          id: 1,
          title: "General",
          icon_color: 7322096,
          icon_emoji: null,
        },
      ],
    },
  ],
  channels: [],
};

export default function SelectGroupPage() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [demoGroups, setDemoGroups] = useState<GroupData>(demo);
  const { address } = useAccount();
  const { toast } = useToast();

  const getGroups = useCallback(async () => {
    if (!address) return;

    try {
      const response = await fetch(
        `https://alphascan-ai.onrender.com/user-groups/${address}`
      );
      const data = await response.json();
      // Ensure the data has the correct structure
      setDemoGroups({
        regular_groups: Array.isArray(data.regular_groups)
          ? data.regular_groups
          : [],
        supergroups: Array.isArray(data.supergroups) ? data.supergroups : [],
        channels: Array.isArray(data.channels) ? data.channels : [],
      });
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast({
        title: "Error",
        description: "Failed to fetch groups. Please try again.",
        variant: "destructive",
      });
    }
  }, [address, toast]);

  useEffect(() => {
    if (address) {
      getGroups();
    }
  }, [address, getGroups]);

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
    setSelectedTopic(null); // Reset topic when group changes
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleContinue = async () => {
    if (selectedGroup) {
      // If it's a supergroup with topics, require topic selection
      if (
        selectedGroup.type === "supergroup" &&
        selectedGroup.is_forum &&
        !selectedTopic
      ) {
        return;
      }
      const response = await fetch(`https://alphascan-ai.onrender.com/watch-group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: address,
          group_name: selectedGroup.title,
          topic_name: selectedTopic?.title,
        }),
      });
      if (response.ok) {
        toast({
          title: "Success!",
          description: `${selectedGroup.title} has been added to your watchlist.`,
          className: "bg-primary/10 border-primary/20 text-primary",
        });
        // router.push("/dashboard");
      } else {
        toast({
          title: "Error",
          description: "Failed to add group to watchlist. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Combine all groups for display, ensuring arrays exist before spreading
  const allGroups = [
    ...(demoGroups?.regular_groups || []),
    ...(demoGroups?.supergroups || []),
  ];

  // Add a check for empty groups
  if (allGroups.length === 0) {
    return (
      <div className="page-shell flex min-h-screen flex-col">
        <Navbar />
        <Toaster />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="glass-card rounded-3xl p-10 text-center">
            <h2 className="font-heading text-4xl">No groups available</h2>
            <p className="mt-3 text-muted-foreground">Please try again later</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar />
      <Toaster />
      <main className="relative flex-1 overflow-hidden py-16">
        <div className="grain-overlay" aria-hidden />
        <div className="mx-auto w-full max-w-6xl space-y-12 px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="section-label justify-center">Signal Source</p>
            <h1
              className="editorial-title text-foreground"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              Select a
              <br />
              <span className="italic">group to watch.</span>
            </h1>
            <p className="mx-auto max-w-xl font-light leading-relaxed text-muted-foreground">
              Choose a group to access AI-powered market insights and
              discussions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allGroups.map((group) => (
              <div
                key={group.id}
                className={`glass-card p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedGroup?.id === group.id
                    ? "border-2 border-primary bg-primary/10"
                    : "neon-border hover:-translate-y-1 hover:border-primary/30"
                }`}
                onClick={() => handleGroupSelect(group)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-heading text-3xl leading-none">{group.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{group.participants_count}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">
                  {group.description || "No description available"}
                </p>
                <div className="flex items-center mt-2">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {group.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {selectedGroup?.type === "supergroup" && selectedGroup.is_forum && (
            <div className="mt-12 space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="font-heading text-4xl tracking-tight">
                  Select a <span className="italic text-primary">Topic</span>
                </h2>
                <p className="text-muted-foreground">
                  Choose a specific topic to focus on within this group
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="w-full max-w-md">
                  <Select
                    value={selectedTopic?.id.toString()}
                    onValueChange={(value) => {
                      const topic = selectedGroup.topics?.find(
                        (t) => t.id.toString() === value
                      );
                      if (topic) handleTopicSelect(topic);
                    }}
                  >
                    <SelectTrigger className="glass h-12 w-full rounded-full border-primary/20 text-lg transition-all duration-300 hover:border-primary/40">
                      <SelectValue placeholder="Choose a topic to focus on..." />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-primary/20">
                      {selectedGroup.topics?.map((topic) => (
                        <SelectItem
                          key={topic.id}
                          value={topic.id.toString()}
                          className="text-base py-3 cursor-pointer hover:bg-primary/10 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-2">
                            {topic.icon_emoji && (
                              <span className="text-xl">
                                {topic.icon_emoji}
                              </span>
                            )}
                            <span>{topic.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTopic && (
                  <div className="mt-4 text-center animate-fade-in">
                    <p className="text-sm text-muted-foreground">
                      Selected topic:{" "}
                      <span className="font-medium text-primary">
                        {selectedTopic.title}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              type="button"
              className="group relative z-20 h-12 rounded-full bg-primary px-8 text-primary-foreground transition-all duration-300 ease-in-out hover:bg-primary/90"
              disabled={
                !selectedGroup ||
                (selectedGroup.type === "supergroup" &&
                  selectedGroup.is_forum &&
                  !selectedTopic)
              }
              onClick={handleContinue}
            >
              Add Group to Watchlist
              <Plus className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </Button>
            <Button
              type="button"
              className="group relative z-20 h-12 rounded-full bg-foreground px-8 text-background transition-all duration-300 ease-in-out hover:bg-foreground/90"
              onClick={() => router.push("/wallet")}
            >
              Agent Configuration
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
