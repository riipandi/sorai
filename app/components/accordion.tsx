/**
 * A set of collapsible panels with headings.
 *
 * @see: https://base-ui.com/react/components/accordion
 *
 * Anatomy:
 * <Accordion.Root>
 *   <Accordion.Item>
 *     <Accordion.Header>
 *       <Accordion.Trigger />
 *     </Accordion.Header>
 *     <Accordion.Panel />
 *   </Accordion.Item>
 * </Accordion.Root>
 */

import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { clx, tv, type VariantProps } from '#/utils/variant'

export const accordionStyles = tv({
  base: 'flex flex-col',
  slots: {
    item: 'border-card-border border-b last:border-b-0',
    header: '',
    trigger: [
      'flex cursor-pointer items-center gap-1.5 select-none',
      'py-3 transition-colors duration-100',
      'focus-visible:outline-primary focus:outline-0 focus-visible:outline-2 focus-visible:outline-offset-2',
      'w-full text-left leading-relaxed font-medium',
      '[&>svg:not([class*=size-])]:size-4 [&>svg:not([class*=text-])]:text-current',
      '**:data-[slot=expandable-indicator]:transition-all',
      '**:data-[slot=expandable-indicator]:duration-100',
      'disabled:cursor-not-allowed disabled:opacity-70'
    ],
    panel: [
      'flex flex-col gap-1.5',
      'overflow-hidden transition-all ease-out',
      'h-(--accordion-panel-height) [&[hidden]:not([hidden=until-found])]:hidden',
      'data-ending-style:h-0 data-starting-style:h-0'
    ],
    panelContent: 'pb-1.5'
  },
  variants: {
    expandableIndicator: {
      true: {
        trigger: [
          'data-expandable:after:bg-chevron-down-dark dark:data-expandable:after:bg-chevron-down data-expandable:after:ml-auto data-expandable:after:size-4',
          'data-expandable:after:shrink-0 data-expandable:after:transition-transform data-expandable:after:duration-100',
          'data-expandable:data-panel-open:after:rotate-180'
        ]
      },
      false: {}
    }
  },
  defaultVariants: {
    expandableIndicator: true
  }
})

export type AccordionRootProps = React.ComponentProps<typeof BaseAccordion.Root>
export type AccordionItemProps = React.ComponentProps<typeof BaseAccordion.Item>
export type AccordionHeaderProps = React.ComponentProps<typeof BaseAccordion.Header>
export type AccordionTriggerProps = React.ComponentProps<typeof BaseAccordion.Trigger> &
  VariantProps<typeof accordionStyles>
export type AccordionPanelProps = React.ComponentProps<typeof BaseAccordion.Panel>

export function Accordion({ className, ...props }: AccordionRootProps) {
  const styles = accordionStyles()
  return (
    <BaseAccordion.Root
      data-slot='accordion'
      className={clx(styles.base(), className)}
      {...props}
    />
  )
}

export function AccordionItem({ className, children, ...props }: AccordionItemProps) {
  const styles = accordionStyles()
  return (
    <BaseAccordion.Item
      data-slot='accordion-item'
      className={clx(styles.item(), className)}
      {...props}
    >
      {children}
    </BaseAccordion.Item>
  )
}

export function AccordionHeader({ className, children, ...props }: AccordionHeaderProps) {
  const styles = accordionStyles()
  return (
    <BaseAccordion.Header
      data-slot='accordion-header'
      className={clx(styles.header(), className)}
      {...props}
    >
      {children}
    </BaseAccordion.Header>
  )
}

export function AccordionTrigger({
  className,
  expandableIndicator = true,
  ...props
}: AccordionTriggerProps) {
  const styles = accordionStyles({ expandableIndicator })
  return (
    <BaseAccordion.Trigger
      data-slot='accordion-trigger'
      data-expandable={expandableIndicator ? true : undefined}
      className={clx(styles.trigger(), className)}
      {...props}
    />
  )
}

export function AccordionPanel({ className, children, ...props }: AccordionPanelProps) {
  const styles = accordionStyles()
  return (
    <BaseAccordion.Panel
      data-slot='accordion-panel'
      className={clx(styles.panel(), className)}
      {...props}
    >
      <div data-slot='accordion-panel-content' className={styles.panelContent()}>
        {children}
      </div>
    </BaseAccordion.Panel>
  )
}
