import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  UsersIcon,
  ClapperboardIcon,
  ImagesIcon,
  Music2Icon,
  CircleHelpIcon,
  CommandIcon,
} from "lucide-react"

export type AppView =
  | "overview"
  | "generate"
  | "jobs"
  | "providers"
  | "costs"
  | "health"

export type CreateVideoMode = "standard" | "content-images" | "music-story"

type MainMenuSection = {
  label: string
  items: {
    key: AppView
    title: string
    icon: React.ReactNode
    createMode?: CreateVideoMode
  }[]
}

const mainMenu: MainMenuSection[] = [
  {
    label: "Create Video",
    items: [
      {
        key: "generate",
        title: "Standard",
        icon: (
          <ClapperboardIcon
          />
        ),
        createMode: "standard",
      },
      {
        key: "generate",
        title: "Content + Images",
        icon: (
          <ImagesIcon
          />
        ),
        createMode: "content-images",
      },
      {
        key: "generate",
        title: "Music Story",
        icon: (
          <Music2Icon
          />
        ),
        createMode: "music-story",
      },
    ],
  },
  {
    label: "Create & Track",
    items: [
      {
        key: "jobs",
        title: "Job Status",
        icon: (
          <ListIcon
          />
        ),
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        key: "overview",
        title: "Overview",
        icon: (
          <LayoutDashboardIcon
          />
        ),
      },
      {
        key: "costs",
        title: "Cost Summary",
        icon: (
          <ChartBarIcon
          />
        ),
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        key: "providers",
        title: "Providers",
        icon: (
          <UsersIcon
          />
        ),
      },
      {
        key: "health",
        title: "Health",
        icon: (
          <CircleHelpIcon
          />
        ),
      },
    ],
  },
]

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: mainMenu,
}

export function AppSidebar({
  currentView,
  onViewChange,
  activeCreateMode,
  onCreateModeChange,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  currentView: AppView
  onViewChange: (view: AppView) => void
  activeCreateMode: CreateVideoMode
  onCreateModeChange: (mode: CreateVideoMode) => void
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Video Builder</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          activeItem={currentView}
          activeCreateMode={activeCreateMode}
          onSelect={onViewChange}
          onCreateModeChange={onCreateModeChange}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
