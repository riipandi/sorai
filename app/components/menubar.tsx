/**
 * A menu bar component.
 *
 * @see: https://base-ui.com/react/components/menubar
 *
 * Anatomy:
 * <Menubar>
 *   <Menu.Root>
 *     <Menu.Trigger />
 *     <Menu.Portal>
 *       <Menu.Backdrop />
 *       <Menu.Positioner>
 *         <Menu.Popup>
 *           <Menu.Arrow />
 *           <Menu.Item />
 *           <Menu.Separator />
 *           <Menu.Group>
 *             <Menu.GroupLabel />
 *           </Menu.Group>
 *           <Menu.RadioGroup>
 *             <Menu.RadioItem />
 *           </Menu.RadioGroup>
 *           <Menu.CheckboxItem />
 *         </Menu.Popup>
 *       </Menu.Positioner>
 *     </Menu.Portal>
 *   </Menu.Root>
 * </Menubar>
 */

import { Menubar as BaseMenubar } from '@base-ui/react/menubar'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const menubarVariants = tv({
  base: 'bg-background ring-card-border flex items-center rounded ring',
  variants: {
    size: {
      default: 'p-1',
      compact: 'p-0.5'
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

export type MenubarProps = React.ComponentProps<typeof BaseMenubar> &
  VariantProps<typeof menubarVariants>

export function Menubar({ className, size, ...props }: MenubarProps) {
  const styles = menubarVariants({ size })
  return <BaseMenubar className={clx(styles, className)} {...props} />
}
