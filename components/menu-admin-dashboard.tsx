"use client";

import { User } from '@prisma/client';
import { Card, CardBody } from '@heroui/react';
import {Listbox, ListboxItem} from "@heroui/react";
import Link from 'next/link';

export const ListboxWrapper = ({children}) => (
  <div className="w-full max-w-[260px]">
    {children}
  </div>
);

export default function MenuAdminDashBoard({ keySelected }) {
  return (
    <Card className="rounded-none">
        <CardBody>
            <ListboxWrapper>
                <Listbox aria-label="Actions">
                    <ListboxItem key="user" className={keySelected === 'user' ? "border-radius bg-default-300" : ""}>
                        <Link href="/admin/dashboard">Utilisateurs</Link>
                    </ListboxItem>
                    <ListboxItem key="topic" className={keySelected === 'topic' ? "border-radius bg-default-300" : ""}>
                        <Link href="/admin/dashboard/topic/list">Matières</Link>
                    </ListboxItem>
                    <ListboxItem key="category-topic" className={keySelected === 'category-topic' ? "border-radius bg-default-300" : ""}>
                        <Link href="/admin/dashboard/category-topic/list">Catégorie de matières</Link>
                    </ListboxItem>
                </Listbox>
            </ListboxWrapper>
        </CardBody>
    </Card>
  )
}
