import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem, AccordionHeader } from '#/components/selia/accordion'
import { AccordionTrigger, AccordionPanel } from '#/components/selia/accordion'
import { Text } from '#/components/selia/text'

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
    <div className='flex w-full items-center justify-center'>
      <Accordion className='w-96'>
        <AccordionItem>
          <AccordionHeader>
            <AccordionTrigger>What is Liverpool Football Club?</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <Text className='text-muted'>
              Liverpool Football Club is the biggest football club in the world.
            </Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <AccordionTrigger>How many titles has Liverpool Football Club won?</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <Text className='text-muted'>Liverpool Football Club has won 20 titles.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>
            <AccordionTrigger>Will Jurgen Klopp manage Liverpool again?</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <Text className='text-muted'>We will be there.</Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
