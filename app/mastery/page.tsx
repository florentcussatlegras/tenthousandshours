// app/mastery/page.tsx
import React from "react";
import prisma from "@/app/lib/prisma";
import { getUser } from "../actions/actions";
import { redirect } from "next/navigation";
import MasteryClient from "@/components/mastery-client";
import { Breadcrumb } from "@/components/breadcrumb";

type MasteredTopic = {
  id: string;
  name: string;
  icon?: string;
  totalSeconds: number;
//   reachedAt: string;
};

async function fetchMasteredTopics(
  userId: string | undefined
): Promise<{ mastered: MasteredTopic[]; inProgress: MasteredTopic[] }> {

  const processes = await prisma.studyProcess.findMany({
    where: { userId },
    include: {
        topic: true,
        studySessions: true,
    },
  });

  // calcul heures par topic, trouver ceux >= 10000h
  const topics = processes.map((p) => {
    const totalSec = p.studySessions.reduce(
      (acc, s) => acc + (s.totalSeconds ?? 0),
      0
    );
    return {
      id: p.id,
      name: p.topic.name,
      totalSeconds: totalSec,
      // reachedAt: calculer la date à laquelle la somme a franchi 10k (optionnel)
    };
  });

  const mastered = topics.filter((t) => t.totalSeconds >= 10000 * 3600);
  const inProgress = topics
    .filter((t) => t.totalSeconds < 10000 * 3600)
    .sort((a, b) => b.totalSeconds - a.totalSeconds)
    .slice(0, 6);

  return { mastered, inProgress };

  //   // --- Mock data (fallback) ---
  //   await new Promise((r) => setTimeout(r, 50)); // simulate latency
  //   const mastered = [
  //     { id: "t1", name: "Guitare", icon: "🎸", totalSeconds: 10000 * 3600 + 3600 * 120, reachedAt: "2024-11-02T12:00:00Z" },
  //     { id: "t2", name: "Physique", icon: "🔬", totalSeconds: 10000 * 3600 + 3600 * 20, reachedAt: "2025-03-12T12:00:00Z" },
  //     { id: "t3", name: "Piano", icon: "🎹", totalSeconds: 10000 * 3600 + 3600 * 2, reachedAt: "2025-08-21T12:00:00Z" },
  //   ];
  //   const inProgress = [
  //     { id: "p1", name: "Javascript", icon: "💻", totalSeconds: 7800 * 3600, reachedAt: "" },
  //     { id: "p2", name: "Saxophone", icon: "🎷", totalSeconds: 6500 * 3600, reachedAt: "" },
  //   ];
  //   return { mastered, inProgress };
}

export default async function MasteryPage() {
  // TODO : récupérer userId depuis session
  const userId = await getUser();

  if (!userId) {
    return redirect("/auth/sign-in");
  }

  const { mastered, inProgress } = await fetchMasteredTopics(userId);

  return (
    <div className="w-full space-y-6">
        <Breadcrumb
            steps={[
                { label: "Mes sessions de travail" },
            ]}
        />
        <h1 className="text-3xl font-bold">Hall of mastery</h1>
        <MasteryClient mastered={mastered} inProgress={inProgress} />
    </div>
  );
}
