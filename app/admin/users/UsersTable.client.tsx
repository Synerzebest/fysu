"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Input, Avatar } from "antd";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
};

export default function UsersTable({ users }: { users: User[] }) {
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(query.toLowerCase()) ||
        (u.name ?? "").toLowerCase().includes(query.toLowerCase())
    );
  }, [query, users]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Utilisateurs
          </h1>
        </div>

        <Input
          allowClear
          prefix={<Search size={16} className="text-gray-400" />}
          placeholder="Rechercher un utilisateur"
          className="w-full sm:w-80 rounded-xl"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-xl shadow-sm">
        <div className="divide-y divide-gray-100">
          {filteredUsers.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ backgroundColor: "rgba(0,0,0,0.025)" }}
              className="flex items-center gap-4 px-6 py-4"
            >
              {/* Avatar */}
              <Avatar
                src={u.image ?? undefined}
                size={40}
                style={{
                  backgroundColor: "#E5E7EB",
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                {u.name?.[0]?.toUpperCase() ?? "U"}
              </Avatar>

              {/* Name / Email */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {u.name ?? "Utilisateur"}
                </p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>

              {/* Date */}
              <div className="text-xs text-gray-400">
                {new Date(u.createdAt).toLocaleDateString("fr-BE")}
              </div>
            </motion.div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-gray-500">
              Aucun utilisateur trouvé
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
