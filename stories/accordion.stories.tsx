import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem, AccordionHeader } from '#/components/accordion'
import { AccordionTrigger, AccordionPanel } from '#/components/accordion'
import { Text } from '#/components/typography'

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: { layout: 'centered' },
  argTypes: {},
  tags: [], // ['autodocs']
  args: {},
  decorators: [
    (Story) => (
      <div className='flex w-full min-w-md items-center justify-center'>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  render: () => (
    <Accordion className='w-md'>
      <AccordionItem>
        <AccordionHeader>
          <AccordionTrigger>What is the Philosopher's Stone?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <Text className='text-muted'>
            The Philosopher's Stone is a legendary alchemical substance capable of turning base
            metals into gold and granting immortality.
          </Text>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>
          <AccordionTrigger>Who is Robert Langdon?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <Text className='text-muted'>
            Robert Langdon is a professor of Religious Symbology at Harvard University.
          </Text>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionHeader>
          <AccordionTrigger>What are the Unforgivable Curses?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          <Text className='text-muted'>
            The Unforgivable Curses are three dark charms that cause torture, mind control, and
            death.
          </Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}
