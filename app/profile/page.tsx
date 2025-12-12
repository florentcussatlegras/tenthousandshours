import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { SignOutButton } from "../auth/sign-out/sign-out-button";
import { redirect } from "next/navigation";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { UpdateUserForm } from "@/components/update-user-form";
import { ChangePasswordForm } from "@/components/change-password-form";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { EditIcon } from "@/components/icons";
import StudiesProgressBar from "@/components/list-studies-progress-bar";
import prisma from "../lib/prisma";
import Avatar from "@/components/avatar";
import ListStudiesProgressbar from "@/components/list-studies-progress-bar";
import {
  getCategoryTopicUsedByUser,
  getLastStudySessionByStudyProcess,
  getListCategoryTopic,
  getStudyProcesses,
  getStudyProcessesAchieved,
} from "../actions/actions";
import { Divider } from "@heroui/react";

export default async function Page() {
  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) redirect("/auth/sign-in");

  const FULL_STUDY_PROCESS_ACCESS = await auth.api.userHasPermission({
    headers: headerList,
    body: {
      userId: session.user.id,
      permissions: {
        studyProcesses: ["update", "delete"],
      },
    },
  });

  const CATEGORY_TOPIC_ACCESS = await auth.api.userHasPermission({
    body: {
      role: "admin",
      permissions: {
        categoryTopic: ["create", "update", "delete"],
      },
    },
  });

  const TOPIC_ACCESS = await auth.api.userHasPermission({
    body: {
      role: "admin",
      permissions: {
        topic: ["create", "update", "delete"],
      },
    },
  });

  const userStudies = await getStudyProcesses();

  const studyProcessesAchieved = await getStudyProcessesAchieved();

  const categoryTopics = await getCategoryTopicUsedByUser();

  let lastSessionDates = [];

  for (let index = 0; index < studyProcessesAchieved.length; index++) {
    const dateAchieved = await getLastStudySessionByStudyProcess(
      studyProcessesAchieved[index].id
    );
    lastSessionDates.push({
      topic_name: studyProcessesAchieved[index].topic_name,
      date_achieved: dateAchieved,
    });
  }

  return (
    <div className="py-8 container mx-auto max-w-[1536px] space-y-8">
      <Breadcrumb steps={[{ label: "Mon profil" }]} />
      <div className="flex items-center gap-2">
        {session.user.role === "admin" && (
          <Button className="bg-sky-500">
            <Link href="/admin/dashboard" className="text-white">
              Admin Dashboard
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-flow-row xl:grid-flow-col grid-col-4 gap-4 h-[356px]">
        <div className="col-span-2 xl:col-span-1">
          <Card className="h-full rounded-none relative">
            <CardBody className="flex-col items-center justify-center gap-4 my-4">
              {session?.user.image ? (
                <Avatar imgSrc={session?.user.image} />
              ) : (
                <div className="size-26 border-3 border-primary rounded-full bg-sky-500 text-primary-foreground flex items-center justify-center">
                  <span className="uppercase text-lg font-bold">
                    {session?.user.name.slice(0, 2)}
                  </span>
                </div>
              )}
              <span className="text-xl text-default-600 font-medium">
                {session.user.firstname} {session.user.name}
              </span>
              <span className="font-light text-md text-sky-500">
                {session.user.email}
              </span>
              <span className="font-light text-sm text-default-400">
                Développeur Full Stack
              </span>

              <Link href="/settings">
                <EditIcon className="text-default-600" />
              </Link>

              {studyProcessesAchieved.length > 0 && (
                <div className="flex flex-col items-start gap-4 w-full px-8">
                  <Divider />
                  <h1 className="font-semibold mt-1">
                    Bravo! Vous êtes un expert en :
                  </h1>
                  <ul>
                    {studyProcessesAchieved.map((studyProcess) => {
                      const element = lastSessionDates.find(
                        (el) => el.topic_name === studyProcess.topic_name
                      );
                      return (
                        <li>
                          <Link className="text-sky-500 uppercase" href={`/study-process/${element?.topic_name}`}>
                            {element?.topic_name}
                          </Link>{" "}
                          le{" "}
                          {new Intl.DateTimeFormat("fr-Fr", {
                            dateStyle: "short",
                          }).format(element?.date_achieved)}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* <Link
                href="/"
                className="text-white uppercase text-xs absolute border"
              >
                <EditIcon />fgdgfdgfg
              </Link> */}
            </CardBody>
          </Card>
        </div>
        <div className="col-span-2 xl:col-span-3">
          <ListStudiesProgressbar
            userStudies={userStudies}
            categoryTopics={categoryTopics}
            studyProcessAchievedLength={studyProcessesAchieved.length}
          />
        </div>
      </div>

      {/* <div className="flex items-center gap-2">
        {session.user.role === "ADMIN" && (
          <Button>
            <Link href="/admin/dashboard">Admin Dashboard</Link>
          </Button>
        )}
      </div>

      <div className="space-x-4">
        {TOPIC_ACCESS.success && (
          <Button color="primary">
            <Link href="/topic/list" className="text-white">TOPICS</Link>
          </Button>
        )}

        {CATEGORY_TOPIC_ACCESS.success && (
          <Button color="primary">
            <Link href="/category-topic/list" className="text-white">CATEGORY TOPICS</Link>
          </Button>
        )}

        <Button color="primary" variant="solid">
          MY STUDY PROCESSES
        </Button>

        {FULL_STUDY_PROCESS_ACCESS.success && (
          <Button variant="solid" color="primary">
            ALL STUDY PROCESSES
          </Button>
        )}
      </div> */}
    </div>
  );
}
