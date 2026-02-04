import type { Meta, StoryObj } from '@storybook/react-vite'
import { PreviewCard, PreviewCardPopup, PreviewCardTrigger } from '#/components/preview-card'
import { Text } from '#/components/typography'

const meta = {
  title: 'Components/PreviewCard',
  component: PreviewCard,
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
} satisfies Meta<typeof PreviewCard>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <PreviewCard>
      <Text className='w-full xl:w-8/12'>
        The Philosopher's Stone is a legendary{' '}
        <PreviewCardTrigger className='text-primary border-primary cursor-help border-b'>
          alchemical substance
        </PreviewCardTrigger>{' '}
        capable of turning base metals into gold and granting immortality.
      </Text>
      <PreviewCardPopup className='max-w-72'>
        <img
          src='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500'
          className='mb-2 h-auto w-full rounded-sm'
        />
        <Text className='text-base/relaxed'>
          In Harry Potter and the Philosopher's Stone, this legendary stone is guarded by Dumbledore
          at Hogwarts. It was created by Nicolas Flampel and is the only known stone to exist. The
          stone plays a crucial role in the first book's plot.
        </Text>
      </PreviewCardPopup>
    </PreviewCard>
  )
}
