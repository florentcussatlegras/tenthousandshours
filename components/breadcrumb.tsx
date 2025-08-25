import { BreadcrumbItem, Breadcrumbs } from '@heroui/react'
import React from 'react'

export const Breadcrumb = ({ steps }: { steps: String[] } ) => {
  return (
    <div>
        <Breadcrumbs>
            <BreadcrumbItem>Accueil</BreadcrumbItem>
            {steps.map(step => <BreadcrumbItem>{step}</BreadcrumbItem>)}
        </Breadcrumbs>
    </div>
  )
}
