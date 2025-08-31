import { Checkbox, Form, Input } from '@heroui/react'
import Link from 'next/link'
import React from 'react'

export default function StudySessionCreateForm() {
  return (
    <div>
        <Form>
            <Input
                label="Email"
                placeholder="Enter your email"
                variant="bordered"
            />
            <Input
                label="Password"
                placeholder="Enter your password"
                type="password"
                variant="bordered"
            />
            <div className="flex py-2 px-1 justify-between">
                <Checkbox
                    classNames={{
                    label: "text-small",
                    }}
                >
                    Remember me
                </Checkbox>
                <Link color="primary" href="#" size="sm">
                    Forgot password?
                </Link>
            </div>
        </Form>
    </div>
  )
}
