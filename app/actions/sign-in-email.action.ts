"use server";

import { auth } from "@/app/lib/auth";


async function signInEmailAction(formData: FormData) {

    const email = String(formData.get("email"));
    if (!email) {
        return { error: "Please enter your email" };
    }

    const password = String(formData.get("password"));
    if (!password) {
        return { error: "Please enter your password" };
    }

    try {
        await auth.api.signInEmail({
            body: {
                email,
                password
            }
        });

        return { error: null }
    }catch (err) {
        if (err instanceof Error) {
            return { error: err.message };
        } 
    }

}

export default signInEmailAction;



// async function signUpAction(formState, formData) {

    // const result = SignUpFormSchema.safeParse(formData);

    
    // if(!result.success) {
    //     console.log(console.log(z.flattenError(result.error).fieldErrors));
    //     return { errors: z.flattenError(result.error).fieldErrors };
    // }

    // try {
    //   console.log("result data", result.data);
    // } catch (err) {
    //   if (err instanceof Error) {
    //     return {
    //       errors: {
    //         _form: [err.message],
    //       },
    //     };
    //   } else {
    //     return {
    //       errors: {
    //         _form: ["Something went wrong"],
    //       },
    //     };
    //   }
    // }

    // await signUp.email({
    //     email: formData.email,
    //     name: formData.name,
    //     password: formData.password
    // }, {
    //     onSuccess: () => {
    //         redirect("/dashboard");
    //     }
    // })