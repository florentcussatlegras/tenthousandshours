// "use client";

// import { createStudySessionAction } from "@/app/actions/create-study-session.action";
// import {
//   Card,
//   CardBody,
//   CardHeader,
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Form,
//   Input,
//   useDisclosure,
//   Checkbox,
//   Divider,
//   TimeInput,
//   Textarea,
//   Table, TableHeader, TableColumn, TableBody, TableRow, TableCell
// } from "@heroui/react";
// import { StudyProcess, StudySession } from "@prisma/client";
// import { useActionState } from "react";

// export default function ListStudiesSession({
//   studySessions,
//   studyProcess,
// }: {
//   studySession: StudySession[];
//   studyProcess: StudyProcess;
// }) {
//   const [formState, formAction] = useActionState(createStudySessionAction, {
//     errors: {},
//   });

//   console.log(JSON.stringify(studySessions));

//   return (
//     <Card className="h-full rounded-none relative p-4">
//       <CardHeader className="flex flex-col gap-4 items-start">
//         {/* <h2 className="text-md">
//           Nouvelle session de travail du{" "}
//           {new Intl.DateTimeFormat("fr-Fr", {
//             dateStyle: "full",
//           }).format(new Date())}
//         </h2> */}
//         <Form
//           action={formAction}
//           className="flex flex-col justify-start w-full"
//         >
//           {formState.errors._form ? (
//             <div className="text-danger text-sm">
//               {formState.errors._form?.join(", ")}
//             </div>
//           ) : null}
//           <div className="flex flex-row w-full gap-3">
//             <Input
//               type="hidden"
//               name="studyProcessId"
//               value={studyProcess.id}
//             />
//             <TimeInput
//               label="Débuté à"
//               className="flex-1"
//               name="startedAt"
//               hourCycle={24}
//             />
//             <TimeInput
//               label="Terminé à"
//               className="flex-1"
//               name="finishedAt"
//               hourCycle={24}
//             />
//             <Textarea
//               className="flex-3"
//               label="Veuillez décrire le contenu de votre session"
//               name="description"
//             />
//           </div>
//           <Button type="submit" className="bg-sky-500 text-white">Ajouter une nouvelle session</Button>
//         </Form>
//         <Divider />
//       </CardHeader>
//       <CardBody>
//         <div className="flex flex-col">
//           <Table aria-label="Example static collection table" radius="none" shadow="none" className="p-0" classNames={{wrapper: "p-0 m-0 w-full"}}>
//             <TableHeader>
//               <TableColumn>Crée le</TableColumn>
//               <TableColumn>Temps travaillé</TableColumn>
//               <TableColumn>Début</TableColumn>
//               <TableColumn>Fin</TableColumn>
//             </TableHeader>
//             <TableBody>
//                 {studySessions.map((studySession) => {
//                   const createdAtFormat = new Intl.DateTimeFormat("fr-FR", {
//                     dateStyle: "full",
//                   }).format(studySession.createdAt);

//                   return (
//                     <TableRow key={studySession.id}>
//                       <TableCell>{createdAtFormat.toUpperCase()}</TableCell>
//                       <TableCell>{studySession.totalSeconds / 3600} heures</TableCell>
//                       <TableCell>{new Intl.DateTimeFormat("fr-FR", {
//                         "timeStyle": "short",
//                       }).format(studySession.startedAt)}</TableCell>
//                       <TableCell>{new Intl.DateTimeFormat("fr-FR", {
//                         "timeStyle": "short",
//                       }).format(studySession.finishedAt)}</TableCell>
//                     </TableRow>
//                   );
//                 })}
//             </TableBody>
//           </Table>
//         </div>
//       </CardBody>
//     </Card>
//   );
// }

"use client";

import React, { useActionState, useEffect } from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  DatePicker,
  DateInput,
  DateRangePicker,
} from "@heroui/react";

import {CalendarDate} from "@internationalized/date";

import { StudyProcess, StudySession } from "@prisma/client";
import { createStudySessionAction } from "@/app/actions/create-study-session.action";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { fetchFilterStudySessions, getFilterStudySessions } from "@/app/actions/actions";
import { ChevronDownIcon, PlusIcon, VerticalDotsIcon } from "./icons";
import { PrismaClient } from "@prisma/client/scripts/default-index";

export const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "DATE", uid: "createdAt", sortable: true },
  { name: "HEURE DEBUT", uid: "startedAt", sortable: true },
  { name: "HEURE FIN", uid: "finishedAt", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

export function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "createdAt",
  "startedAt",
  "finishedAt",
  "actions",
];

export default function ListStudiesSession({
  studySessions,
  studyProcess,
}: {
  studySessions: StudySession[];
  studyProcess: StudyProcess;
}) {
  const [formState, formAction] = useActionState(createStudySessionAction, {
    errors: {},
  });

  const [filterValue, setFilterValue] = React.useState("");
  const [filteredItems, setFilteredItems] = React.useState(studySessions);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);


  // const filteredItems = React.useMemo(() => {
  //   let filteredUsers = [...studySessions];

  //   if (hasSearchFilter) {
  //     const dateStartFilter = new Date(filterValue.start.year, filterValue.start.month, filterValue.start.day);
  //     const dateEndFilter = new Date(filterValue.end.year, filterValue.end.month, filterValue.end.day);

  //     console.log(getFilterStudySessions(dateStartFilter, dateEndFilter));
  //   }

  //   // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
  //   //   filteredUsers = filteredUsers.filter((user) =>
  //   //     Array.from(statusFilter).includes(user.status),
  //   //   );
  //   // }

  //   return filteredUsers;
  // }, [studySessions, filterValue, statusFilter]);


  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((studySession, columnKey) => {
    const cellValue = studySession[columnKey];

    const createdAt = new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "full",
    }).format(studySession.createdAt);

    const startedAt = new Intl.DateTimeFormat("fr-FR", {
      timeStyle: "short",
    }).format(studySession.startedAt);

    const finishedAt = new Intl.DateTimeFormat("fr-FR", {
      timeStyle: "short",
    }).format(studySession.finishedAt);

    switch (columnKey) {
      case "createdAt":
        return (
          <div>{capitalize(createdAt)}</div>
        );
      case "startedAt":
        return (
          <div>{startedAt}</div>
        );
      case "finishedAt":
        return (
          <div>{finishedAt}</div>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view">View</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>
                <DropdownItem key="delete">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback(async (value) => {
    if (value) {
      setFilterValue(value);

      console.log("dans onsearchchange");

      const result = await fetchFilterStudySessions(value.start.year, value.start.month, value.start.day, value.end.year, value.end.month, value.end.day);
      console.log(result);
      setFilteredItems(result);

      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    // setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          {/* <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          /> */}
          {/* <DateInput
            className="max-w-sm"
            label={"Birth date"}
            // value={filterValue}
            // onClear={() => onClear()}
            onValueChange={onSearchChange}
            placeholderValue={new CalendarDate(1995, 11, 6)}
          /> */}
          <DateRangePicker className="max-w-xs" label="Stay duration" onChange={(onSearchChange)} />
          <div className="flex gap-3">
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {studySessions.length} sessions
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-solid outline-transparent text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    studySessions.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      isHeaderSticky
      aria-label="Example table with custom cells, pagination and sorting"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
