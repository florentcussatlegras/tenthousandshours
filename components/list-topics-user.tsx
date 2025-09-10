

import { UUID } from 'crypto'
import React from 'react'

interface TopicState {
    id: UUID,
    name: string,
    studyProcesses: string[],
}

export function ListTopicsUser({ topics }: { topics: TopicState[] }) {

  return (
    <div className="flex flex-col w-full gap-2">
        {topics.map((topic) => (
            <div className="bg-secondary cursor-pointer text-white rounded-xl px-4 py-2 text-md font-semibold">{topic.name}</div>
        ))}
    </div>
  )

}
