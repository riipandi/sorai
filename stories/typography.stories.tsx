import type { Meta, StoryObj } from '@storybook/react-vite'
import { Code, Heading, Strong, Text, TextLink } from '#/components/typography'

const meta = {
  title: 'Components/Typography',
  component: undefined,
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
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const PageHeading: Story = {
  args: {},
  render: () => (
    <div className='flex flex-col gap-4'>
      <Heading level={1} size='xl'>
        The Da Vinci Code
      </Heading>
      <Heading level={2} size='lg'>
        Harry Potter and the Sorcerer's Stone
      </Heading>
      <Heading level={3} size='md'>
        Angels & Demons
      </Heading>
      <Heading level={4} size='sm'>
        The Chamber of Secrets
      </Heading>
      <Heading level={5} size='xs'>
        Inferno
      </Heading>
    </div>
  )
}

export const Paragraph: Story = {
  args: {},
  render: () => (
    <div className='flex flex-col gap-2'>
      <Text>
        Professor Robert Langdon awakens in a hospital bed in Florence, Italy, with no recollection
        of how he got there.
      </Text>

      <Text>
        Harry Potter discovers he is a wizard on his eleventh birthday when{' '}
        <TextLink href='https://www.wizardingworld.com' target='_blank'>
          Hagrid
        </TextLink>{' '}
        arrives to take him to Hogwarts School of Witchcraft and Wizardry.
      </Text>

      <Text>
        The <Strong>Philosopher's Stone</Strong> grants immortality and unlimited wealth.
      </Text>

      <Text>
        You can also add <Code>Expelliarmus!</Code> to your spells.
      </Text>
    </div>
  )
}
