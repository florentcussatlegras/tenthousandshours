'use server'

import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";

// const SignUpFormSchema = z.object({
//     name: z.string().min(5),
//     email: z.email('Votre email est invalide.'),
//     password: z.string().min(8),
//     terms: z.boolean("Veuillez accepter les termes d'utilisation"),
// });

// export async function signupAction(formState: any, formData: FormData) {
    
//     const data = {
//         name: formData.get("name") as string,
//         email: formData.get("email") as string,
//         password: formData.get("password") as string,
//         terms: formData.get("terms") as string,
//     };

//     const result = SignUpFormSchema.safeParse(data);
    
//     if(!result.success) {
//         // console.log(console.log(z.flattenError(result.error).fieldErrors));
//         const flattened = z.flattenError(result.error);

//         return { errors: flattened.fieldErrors };
//     }

//     try {
//       console.log("result data", result.data);
//     } catch (err) {
//       if (err instanceof Error) {
//         return {
//           errors: {
//             _form: [err.message],
//           },
//         };
//       } else {
//         return {
//           errors: {
//             _form: ["Something went wrong"],
//           },
//         };
//       }
//     }

//     // await signUp.email({
//     //     email: formData.email,
//     //     name: formData.name,
//     //     password: formData.password
//     // }, {
//     //     onSuccess: () => {
//     //         redirect("/dashboard");
//     //     }
//     // })

//     redirect('/dashboard');

// }

export async function getCategoryTopic(slug) {
  const categoryTopic = await prisma.categoryTopic.findFirst({
    where: {
      slug
    }
  });

  return categoryTopic;
}

export async function getListCategoryTopic() {
  const categories = await prisma.categoryTopic.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      status: true
    }
  });

  return categories;
}

export async function getTopic(slug) {
  const topic = await prisma.topic.findFirst({
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      categoryTopicId: true,
    },
    where: {
      slug
    }
  });

  return topic;
}

export async function getListTopics() {
  const topics = await prisma.topic.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      status: true
    }
  });

  return topics;
}
