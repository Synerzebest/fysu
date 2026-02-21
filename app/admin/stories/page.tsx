"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryEditor from "@/components/Admin/Stories/StoryEditor";
import StoryManager from "@/components/Admin/Stories/StoryManager";

type Story = {
  id: string;
  title: string;
  cover_url: string;
  is_active: boolean;
  story_items: any[];
  created_at: string;
};

export default function AdminUsersPage() {
  const [editingStory, setEditingStory] = useState<Story | null>(null);

  return (
    <>
      <Navbar />
      <div className="relative top-24 mx-auto max-w-7xl px-6 pb-24 flex flex-col gap-12">
        <StoryManager
          onEdit={(story) => setEditingStory(story)}
        />
        <StoryEditor
          editingStory={editingStory}
          onFinishEdit={() => setEditingStory(null)}
        />
      </div>
      <Footer />
    </>
  );
}