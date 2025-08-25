"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@heroui/react";

import { EyeIcon, EditIcon, DeleteIcon } from '@/components/icons'
import { Topic } from "@prisma/client";
import Link from "next/link";

export const columns = [
  {name: "ID", uid: "id"},  
  {name: "NAME", uid: "name"},
  {name: "DESCRIPTION", uid: "description"},
  {name: "CATEGORY", uid: "category"},
  {name: "STATUS", uid: "status"},
  {name: "ACTIONS", uid: "actions"},
];

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function TableListTopic({ topics }: { topics: Promise<Topic[]> }) {

  const renderCell = React.useCallback((topic, columnKey) => {

    const cellValue = topic[columnKey];

    switch (columnKey) {
      case "id":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">{topic.id.slice(8)}</p>
          </div>
        );
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{topic.name}</p>
          </div>
        );
      case "description":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-400">{topic.description}</p>
          </div>
        );
      case "category":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-400">{topic.category.name}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[topic.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-center">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <Link href={`/topic/edit/${topic.slug}`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </Link>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <Link href={`/topic/delete/${topic.slug}`} className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </Link>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table aria-label="List table topic">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={topics}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

}

