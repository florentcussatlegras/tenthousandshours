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
import { CategoryTopic } from "@prisma/client";
import Link from "next/link";

export const columns = [
  {name: "ID", uid: "id"},  
  {name: "NAME", uid: "name"},
  {name: "DESCRIPTION", uid: "description"},
  {name: "STATUS", uid: "status"},
  {name: "ACTIONS", uid: "actions"},
];

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function TableListCategoryTopic({ categories }: { categories: Promise<CategoryTopic[]> }) {

  const renderCell = React.useCallback((category, columnKey) => {
    const cellValue = category[columnKey];

    switch (columnKey) {
      case "id":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">{category.id.slice(8)}</p>
          </div>
        );
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{category.name}</p>
          </div>
        );
      case "description":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-default-400">{category.description}</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[category.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-center">
            {/* <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip> */}
            <Tooltip content="Modifier la catégorie">
              <Link href={`/admin/dashboard/category-topic/edit/${category.slug}`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </Link>
            </Tooltip>
            <Tooltip color="danger" content="Supprimer la catégorie">
              <Link href={`/admin/dashboard/category-topic/delete/${category.slug}`} className="text-lg text-danger cursor-pointer active:opacity-50">
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
    <Table aria-label="List table category topics" className="border-none" shadow="none" radius="none">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={categories}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

}

