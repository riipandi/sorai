/**
 * A collapsible navigation sidebar for application menus and content.
 *
 * Anatomy:
 * <Sidebar>
 *   <SidebarHeader>
 *     <SidebarLogo />
 *   </SidebarHeader>
 *   <SidebarContent>
 *     <SidebarMenu>
 *       <SidebarList>
 *         <SidebarItem>
 *           <SidebarItemButton />
 *           <SidebarItemAction />
 *         </SidebarItem>
 *       </SidebarList>
 *     </SidebarMenu>
 *   </SidebarContent>
 *   <SidebarFooter />
 * </Sidebar>
 */

import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible'
import { useRender } from '@base-ui/react/use-render'
import { createContext, useContext } from 'react'
import { clx, tv, type VariantProps } from '#/utils/variant'

const SidebarContext = createContext<{ size: 'default' | 'compact' | 'loose' }>({ size: 'default' })

export function useSidebar() {
  return useContext(SidebarContext)
}

const sidebarVariants = tv({
  base: 'flex flex-col gap-2',
  slots: {
    header: '',
    content: 'flex h-full flex-col gap-2 overflow-y-auto dark:scheme-dark',
    logo: 'text-foreground flex items-center gap-2 text-lg select-none',
    footer: 'mt-auto',
    menu: 'flex flex-col gap-3.5',
    list: 'flex w-full flex-col gap-0.5',
    item: 'group/sidebar-item relative flex text-sm **:data-[slot=sidebar-submenu]:w-auto',
    itemButton: [
      'relative z-10 flex w-full items-center gap-2.5',
      'text-foreground cursor-pointer text-left',
      'hover:not-[[disabled],[data-disabled]]:bg-accent transition-colors duration-75',
      '**:[svg]:text-muted **:[svg]:size-4',
      'outline-primary focus-visible:outline-2 focus-visible:outline-offset-2',
      'data-popup-open:bg-accent data-active:bg-accent',
      'disabled:cursor-not-allowed disabled:opacity-70'
    ],
    itemAction: [
      'absolute right-0 z-10 shrink-0 transition-all duration-100',
      '**:[svg]:size-4',
      '*:[button]:cursor-pointer'
    ],
    group: 'flex flex-wrap gap-0.5 *:data-[slot=sidebar-list]:p-0',
    groupTitle: 'text-dimmed mb-1 inline-flex items-center text-sm font-medium **:[svg]:size-3.5',
    groupAction: 'ml-auto flex items-center gap-1 **:[svg]:size-3',
    submenu: 'border-border w-full border-l py-0.5',
    collapsibleRoot: 'w-full',
    collapsibleTrigger: [
      '**:data-[slot=expandable-indicator]:transition-all',
      '**:data-[slot=expandable-indicator]:duration-100'
    ],
    collapsiblePanel: [
      'transition-all duration-100',
      'h-(--collapsible-panel-height) overflow-hidden',
      'data-ending-style:h-0 data-starting-style:h-0'
    ]
  },
  variants: {
    expandableIndicator: {
      true: {
        itemButton: [
          'data-expandable:after:bg-chevron-down-dark dark:data-expandable:after:bg-chevron-down data-expandable:after:ml-auto data-expandable:after:size-4',
          'data-expandable:after:transition-transform data-expandable:after:duration-100',
          'data-expandable:data-panel-open:after:rotate-180'
        ]
      },
      false: {}
    },
    size: {
      default: {
        base: [
          '**:data-[slot=sidebar-item-button]:min-h-8',
          '**:data-[slot=sidebar-item-button]:px-2',
          '**:data-[slot=sidebar-item-button]:py-1.5',
          '**:data-[slot=sidebar-item-button]:rounded',
          '**:data-[slot=sidebar-item-action]:size-8',
          '[&_[data-slot=sidebar-item-button]:has(+[data-slot=sidebar-item-action])]:pr-6.5',
          '**:data-[slot=sidebar-header]:px-3.5',
          '**:data-[slot=sidebar-header]:pt-3.5',
          '**:data-[slot=sidebar-content]:px-3.5',
          '**:data-[slot=sidebar-content]:pb-3.5',
          'has-[>[data-slot=sidebar-header]]:**:data-[slot=sidebar-content]:pt-3.5',
          '**:data-[slot=sidebar-group-title]:px-2',
          '**:data-[slot=sidebar-group-action]:px-2',
          '**:data-[slot=sidebar-footer]:px-3.5',
          '**:data-[slot=sidebar-footer]:pb-3.5',
          '**:data-[slot=sidebar-submenu]:pl-1.5',
          '**:data-[slot=sidebar-submenu]:ml-4'
        ],
        itemAction: 'size-8.5'
      },
      compact: {
        base: [
          '**:data-[slot=sidebar-item-button]:min-h-7.5',
          '**:data-[slot=sidebar-item-button]:px-2',
          '**:data-[slot=sidebar-item-button]:py-1',
          '**:data-[slot=sidebar-item-button]:rounded',
          '**:data-[slot=sidebar-item-action]:size-7.5',
          '[&_[data-slot=sidebar-item-button]:has(+[data-slot=sidebar-item-action])]:pr-6.5',
          '**:data-[slot=sidebar-header]:px-3',
          '**:data-[slot=sidebar-header]:pt-3',
          '**:data-[slot=sidebar-content]:px-3',
          '**:data-[slot=sidebar-content]:pb-3',
          'has-[>[data-slot=sidebar-header]]:**:data-[slot=sidebar-content]:pt-3',
          '**:data-[slot=sidebar-group-title]:px-2',
          '**:data-[slot=sidebar-group-action]:px-2',
          '**:data-[slot=sidebar-footer]:px-3',
          '**:data-[slot=sidebar-footer]:pb-3',
          '**:data-[slot=sidebar-submenu]:pl-1',
          '**:data-[slot=sidebar-submenu]:ml-4'
        ],
        itemAction: 'size-8'
      },
      loose: {
        base: [
          '**:data-[slot=sidebar-item-button]:min-h-9.5',
          '**:data-[slot=sidebar-item-button]:px-2.5',
          '**:data-[slot=sidebar-item-button]:py-1.5',
          '**:data-[slot=sidebar-item-button]:rounded',
          '**:data-[slot=sidebar-item-action]:size-9.5',
          '[&_[data-slot=sidebar-item-button]:has(+[data-slot=sidebar-item-action])]:pr-7',
          '**:data-[slot=sidebar-header]:px-4',
          '**:data-[slot=sidebar-header]:pt-4',
          '**:data-[slot=sidebar-content]:px-4',
          '**:data-[slot=sidebar-content]:pb-4',
          'has-[>[data-slot=sidebar-header]]:**:data-[slot=sidebar-content]:pt-4',
          '**:data-[slot=sidebar-group-title]:px-2.5',
          '**:data-[slot=sidebar-group-action]:px-2.5',
          '**:data-[slot=sidebar-footer]:px-4',
          '**:data-[slot=sidebar-footer]:pb-4',
          '**:data-[slot=sidebar-submenu]:pl-1.5',
          '**:data-[slot=sidebar-submenu]:ml-4.5'
        ],
        itemAction: 'size-10'
      }
    }
  },
  defaultVariants: {
    size: 'default',
    expandableIndicator: true
  }
})

export type SidebarProps = React.ComponentProps<'aside'> & VariantProps<typeof sidebarVariants>

export function Sidebar({ size, className, ...props }: SidebarProps) {
  const styles = sidebarVariants({ size })
  return (
    <SidebarContext.Provider value={{ size: size || 'default' }}>
      <aside data-slot='sidebar' className={clx(styles.base(), className)} {...props} />
    </SidebarContext.Provider>
  )
}

export function SidebarHeader({ className, children, ...props }: React.ComponentProps<'header'>) {
  const styles = sidebarVariants()
  return (
    <header data-slot='sidebar-header' {...props} className={clx(styles.header(), className)}>
      {children}
    </header>
  )
}

export function SidebarContent({ className, render, ...props }: useRender.ComponentProps<'div'>) {
  const styles = sidebarVariants()
  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      'data-slot': 'sidebar-content',
      className: clx(styles.content(), className),
      ...props
    }
  })
}

export function SidebarLogo({ className, children, ...props }: React.ComponentProps<'div'>) {
  const styles = sidebarVariants()
  return (
    <div data-slot='sidebar-logo' className={clx(styles.logo(), className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarFooter({ className, children, ...props }: React.ComponentProps<'footer'>) {
  const styles = sidebarVariants()
  return (
    <footer data-slot='sidebar-footer' className={clx(styles.footer(), className)} {...props}>
      {children}
    </footer>
  )
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<'nav'>) {
  const styles = sidebarVariants()
  return <nav data-slot='sidebar-menu' className={clx(styles.menu(), className)} {...props} />
}

export function SidebarList({ className, children, ...props }: React.ComponentProps<'ul'>) {
  const styles = sidebarVariants()
  return (
    <ul data-slot='sidebar-list' className={clx(styles.list(), className)} {...props}>
      {children}
    </ul>
  )
}

export function SidebarItem({ className, children }: React.ComponentProps<'li'>) {
  const styles = sidebarVariants()
  return (
    <li data-slot='sidebar-item' className={clx(styles.item(), className)}>
      {children}
    </li>
  )
}

export type SidebarItemActionProps = React.ComponentProps<'div'> & {
  showOnHover?: boolean
}

export function SidebarItemAction({
  className,
  children,
  showOnHover,
  ...props
}: SidebarItemActionProps) {
  const { size } = useSidebar()
  const styles = sidebarVariants({ size })
  return (
    <div
      data-slot='sidebar-item-action'
      className={clx(
        styles.itemAction(),
        showOnHover && 'opacity-0 group-hover/sidebar-item:opacity-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export type SidebarItemButtonProps = useRender.ComponentProps<'button'> & {
  active?: boolean
  expandableIndicator?: boolean
}

export function SidebarItemButton({
  className,
  render,
  active,
  expandableIndicator = true,
  ...props
}: SidebarItemButtonProps) {
  const { size } = useSidebar()
  const styles = sidebarVariants({ size, expandableIndicator })
  return useRender({
    defaultTagName: 'button',
    render,
    props: {
      'data-slot': 'sidebar-item-button',
      'data-active': active ? true : undefined,
      className: clx(styles.itemButton(), className),
      ...props
    }
  })
}

export function SidebarGroup({ className, children, ...props }: React.ComponentProps<'section'>) {
  const styles = sidebarVariants()
  return (
    <section
      role='group'
      data-slot='sidebar-group'
      className={clx(styles.group(), className)}
      {...props}
    >
      {children}
    </section>
  )
}

export function SidebarGroupTitle({ className, children, ...props }: React.ComponentProps<'span'>) {
  const styles = sidebarVariants()
  return (
    <span
      data-slot='sidebar-group-title'
      className={clx(styles.groupTitle(), className)}
      {...props}
    >
      {children}
    </span>
  )
}

export function SidebarGroupAction({ className, children, ...props }: React.ComponentProps<'div'>) {
  const styles = sidebarVariants()
  return (
    <div
      data-slot='sidebar-group-action'
      className={clx(styles.groupAction(), className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarSubmenu({ className, ...props }: React.ComponentProps<'div'>) {
  const styles = sidebarVariants()
  return <div data-slot='sidebar-submenu' {...props} className={clx(styles.submenu(), className)} />
}

export function SidebarCollapsible({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Root>) {
  const styles = sidebarVariants()
  return (
    <BaseCollapsible.Root
      data-slot='sidebar-collapsible'
      className={clx(styles.collapsibleRoot(), className)}
      {...props}
    />
  )
}

export function SidebarCollapsibleTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Trigger>) {
  const styles = sidebarVariants()
  return (
    <BaseCollapsible.Trigger
      data-expandable
      className={clx(styles.collapsibleTrigger(), className)}
      {...props}
    />
  )
}

export function SidebarCollapsiblePanel({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  const styles = sidebarVariants()
  return (
    <BaseCollapsible.Panel
      data-slot='sidebar-collapsible-panel'
      className={clx(styles.collapsiblePanel(), className)}
      {...props}
    />
  )
}
