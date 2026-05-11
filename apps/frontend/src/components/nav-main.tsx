import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { AppView, CreateVideoMode } from "@/components/app-sidebar"

export function NavMain({
  items,
  activeItem,
  activeCreateMode,
  onSelect,
  onCreateModeChange,
}: {
  items: {
    label: string
    items: {
      title: string
      key: AppView
      icon?: React.ReactNode
      createMode?: CreateVideoMode
    }[]
  }[]
  activeItem: AppView
  activeCreateMode: CreateVideoMode
  onSelect: (key: AppView) => void
  onCreateModeChange: (mode: CreateVideoMode) => void
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {items.map((section) => (
          <div key={section.label} className="space-y-1">
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={
                      item.key === "generate" && item.createMode
                        ? activeItem === "generate" && activeCreateMode === item.createMode
                        : activeItem === item.key
                    }
                    onClick={() => {
                      if (item.key === "generate" && item.createMode) {
                        onCreateModeChange(item.createMode)
                        return
                      }

                      onSelect(item.key)
                    }}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
