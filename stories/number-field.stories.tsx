import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Field, FieldLabel } from '#/components/field'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea
} from '#/components/number-field'

const meta = {
  title: 'Components/NumberField',
  component: NumberField,
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
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex flex-col gap-6'>
      <Field>
        <NumberField defaultValue={999} min={1} max={10000}>
          <NumberFieldScrubArea>
            <FieldLabel>Default variant</FieldLabel>
          </NumberFieldScrubArea>
          <NumberFieldGroup variant='default'>
            <NumberFieldDecrement>
              <Lucide.MinusIcon />
            </NumberFieldDecrement>
            <NumberFieldInput />
            <NumberFieldIncrement>
              <Lucide.PlusIcon />
            </NumberFieldIncrement>
          </NumberFieldGroup>
        </NumberField>
      </Field>

      <Field>
        <NumberField defaultValue={999} min={1} max={10000}>
          <NumberFieldScrubArea>
            <FieldLabel>Plain variant</FieldLabel>
          </NumberFieldScrubArea>
          <NumberFieldGroup variant='plain'>
            <NumberFieldDecrement>
              <Lucide.MinusIcon />
            </NumberFieldDecrement>
            <NumberFieldInput />
            <NumberFieldIncrement>
              <Lucide.PlusIcon />
            </NumberFieldIncrement>
          </NumberFieldGroup>
        </NumberField>
      </Field>
    </div>
  )
}
