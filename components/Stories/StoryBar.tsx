"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

type StoryItem = {
  id: string;
  type: "image" | "video";
  media_url: string;
  duration: number;
};

type Story = {
  id: string;
  title: string;
  cover_url: string;
  story_items: StoryItem[];
};

type Props = {
  pageSlug?: string;
  collectionSlug?: string;
};

export default function StoryBar({ pageSlug, collectionSlug }: Props) {
  const supabase = supabaseClient;

  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  /* -------------------------------------------------- */
  /* FETCH STORIES */
  /* -------------------------------------------------- */

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);

      let pageId: string | null = null;

      if (pageSlug) {
        const { data } = await supabase
          .from("pages")
          .select("id")
          .eq("slug", pageSlug)
          .maybeSingle();

        pageId = data?.id ?? null;
      }

      if (!pageId) {
        setLoading(false);
        return;
      }

      const { data: links } = await supabase
        .from("story_page_links")
        .select("story_id")
        .match({ page_id: pageId });

      if (!links || links.length === 0) {
        setLoading(false);
        return;
      }

      const storyIds = links.map((l) => l.story_id);

      const { data: storyData } = await supabase
        .from("stories")
        .select("*, story_items(*)")
        .in("id", storyIds)
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      setStories(storyData || []);
      setLoading(false);
    };

    fetchStories();
  }, [pageSlug]);

  /* -------------------------------------------------- */
  /* AUTOPLAY */
  /* -------------------------------------------------- */

  useEffect(() => {
    if (!activeStory) return;
    if (paused) return;
  
    const item = activeStory.story_items[currentIndex];
    if (!item) return;
  
    const timer = setTimeout(() => {
      nextSlide();
    }, item.duration * 1000);
  
    return () => clearTimeout(timer);
  }, [activeStory, currentIndex, paused]);

  const nextSlide = () => {
    if (!activeStory) return;

    if (currentIndex < activeStory.story_items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setActiveStory(null);
      setCurrentIndex(0);
    }
  };

  /* -------------------------------------------------- */
  /* RENDER */
  /* -------------------------------------------------- */

  if (loading) return null;
  if (stories.length === 0) return null;

  return (
    <>
      {/* STORY CIRCLES */}
      <div className="w-full flex justify-center gap-4 overflow-x-auto py-4 relative top-12">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setActiveStory(story);
              setCurrentIndex(0);
            }}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full p-[2px] bg-gray-100 border border-gray-700">
              <div
                className="w-full h-full rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${story.cover_url})`,
                }}
              />
            </div>
            <span className="text-sm mt-2 text-center">
              {story.title}
            </span>
          </motion.div>
        ))}
      </div>

      {/* STORY MODAL */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setActiveStory(null);
              setCurrentIndex(0);
            }}
          >
            {/* Close */}
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-6 right-6 text-white text-2xl z-50"
            >
              ✕
            </button>

            {/* Story Container */}
            <div className="relative w-full max-w-xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>

              {/* Timeline */}
              <div className="flex gap-1 px-3 pt-4">
                {activeStory.story_items.map((item, index) => {
                  const isActive = index === currentIndex;
                  const isPast = index < currentIndex;

                  return (
                    <div key={index} className="flex-1 h-1 bg-white/30 rounded overflow-hidden mb-4">
                      {isPast && <div className="w-full h-full bg-white" />}
                      {isActive && (
                        <motion.div
                          className="h-full bg-white"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration:
                              activeStory.story_items[currentIndex].duration,
                            ease: "linear",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Media */}
              <div
                className="flex-1 flex items-center justify-center px-4"
                onMouseDown={() => setPaused(true)}
                onMouseUp={() => setPaused(false)}
                onTouchStart={() => setPaused(true)}
                onTouchEnd={() => setPaused(false)}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black">

                  {activeStory.story_items[currentIndex].type === "image" ? (
                    <img
                      src={activeStory.story_items[currentIndex].media_url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <video
                      src={activeStory.story_items[currentIndex].media_url}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                  )}

                  {/* Navigation Zones */}
                  <div
                    className="absolute left-0 top-0 w-1/2 h-full"
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        prev > 0 ? prev - 1 : prev
                      )
                    }
                  />

                  <div
                    className="absolute right-0 top-0 w-1/2 h-full"
                    onClick={nextSlide}
                  />
                </div>
              </div>

              {/* Bottom spacing */}
              <div className="h-10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}