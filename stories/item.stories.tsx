import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/avatar'
import { Button } from '#/components/button'
import { IconBox } from '#/components/icon-box'
import {
  Item,
  ItemAction,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemMeta,
  ItemTitle
} from '#/components/item'
import { Separator } from '#/components/separator'
import { Stack } from '#/components/stack'

const meta = {
  title: 'Components/Item',
  component: Item,
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
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex w-full min-w-md flex-col gap-4'>
      <Item>
        <ItemMedia>
          <img
            src='https://api.dicebear.com/9.x/avataaars/svg?radius=50&seed=Harry+Potter'
            alt='Avatar'
            className='size-11 rounded'
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Harry Potter</ItemTitle>
          <ItemDescription>The Boy Who Lived</ItemDescription>
        </ItemContent>
        <ItemAction>
          <Button size='sm'>Add Friend</Button>
        </ItemAction>
      </Item>
      <Item variant='plain'>
        <ItemMedia>
          <IconBox>
            <Lucide.BookIcon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>The Da Vinci Code</ItemTitle>
          <ItemDescription>Dan Brown's bestseller novel</ItemDescription>
        </ItemContent>
        <ItemAction>
          <Button size='sm' variant='secondary'>
            Read
          </Button>
        </ItemAction>
      </Item>
    </div>
  )
}

export const VariantShowcase: Story = {
  args: {},
  render: () => (
    <div className='flex w-full flex-col gap-4'>
      <Item>
        <ItemMedia>
          <IconBox>
            <Lucide.Code2Icon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Regular</ItemTitle>
          <ItemDescription>Just a simple item with an icon.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant='primary'>
        <ItemMedia>
          <IconBox variant='primary'>
            <Lucide.SettingsIcon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Setting</ItemTitle>
          <ItemDescription>You can change the settings of the app.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant='info'>
        <ItemMedia>
          <IconBox variant='info'>
            <Lucide.InfoIcon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Information</ItemTitle>
          <ItemDescription>This item is good.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant='success'>
        <ItemMedia>
          <IconBox variant='success'>
            <Lucide.CheckCircle2Icon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Success</ItemTitle>
          <ItemDescription>This item is working as expected.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant='warning'>
        <ItemMedia>
          <IconBox variant='warning'>
            <Lucide.TriangleAlertIcon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Warning</ItemTitle>
          <ItemDescription>This item is not working as expected.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant='danger'>
        <ItemMedia>
          <IconBox variant='danger'>
            <Lucide.Trash2Icon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Danger</ItemTitle>
          <ItemDescription>This item is dangerous.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}

export const OutlineVariants: Story = {
  args: {},
  render: () => (
    <div className='flex w-full flex-col gap-4'>
      <Item variant='outline'>
        <ItemMedia>
          <IconBox>
            <Lucide.SettingsIcon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Regular</ItemTitle>
          <ItemDescription>Just a simple item with an icon.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant='primary-outline'>
        <ItemMedia>
          <IconBox variant='primary'>
            <Lucide.SettingsIcon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Setting</ItemTitle>
          <ItemDescription>You can change the settings of the app.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant='info-outline'>
        <ItemMedia>
          <IconBox variant='info'>
            <Lucide.InfoIcon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Information</ItemTitle>
          <ItemDescription>This item is good.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant='success-outline'>
        <ItemMedia>
          <IconBox variant='success'>
            <Lucide.CheckCircle2Icon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Success</ItemTitle>
          <ItemDescription>This item is working as expected.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant='warning-outline'>
        <ItemMedia>
          <IconBox variant='warning'>
            <Lucide.TriangleAlertIcon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Warning</ItemTitle>
          <ItemDescription>This item is not working as expected.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant='danger-outline'>
        <ItemMedia>
          <IconBox variant='danger'>
            <Lucide.Trash2Icon />
          </IconBox>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Danger</ItemTitle>
          <ItemDescription>This item is dangerous.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}

export const WithItemMeta: Story = {
  args: {},
  render: () => (
    <div className='flex w-full flex-col gap-4'>
      <Item>
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src='https://api.dicebear.com/9.x/avataaars/svg?radius=50&seed=Robert+Langdon'
              alt='Avatar'
            />
            <AvatarFallback>RL</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Robert Langdon</ItemTitle>
          <ItemMeta className='mb-2.5'>5 minutes ago</ItemMeta>
          <ItemDescription>The ancient symbol has been deciphered!</ItemDescription>
          <div className='-mx-2 mt-2.5'>
            <Button size='xs' variant='plain' pill>
              Reply
            </Button>
          </div>
        </ItemContent>
        <ItemAction>
          <Button size='icon-xs' variant='plain' pill>
            <Lucide.HeartIcon />
          </Button>
        </ItemAction>
      </Item>
    </div>
  )
}

export const ItemStack: Story = {
  args: {},
  render: () => (
    <Stack className='w-full'>
      <Item variant='plain'>
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src='https://api.dicebear.com/9.x/avataaars/svg?radius=50&seed=Harry+Potter'
              alt='Avatar'
            />
            <AvatarFallback>HP</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Harry Potter</ItemTitle>
          <ItemDescription>harry@hogwarts.edu</ItemDescription>
        </ItemContent>
        <ItemAction>
          <Button variant='tertiary' size='xs'>
            Follow
          </Button>
        </ItemAction>
      </Item>
      <Separator />
      <Item variant='plain'>
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src='https://api.dicebear.com/9.x/avataaars/svg?radius=50&seed=Robert+Langdon'
              alt='Avatar'
            />
            <AvatarFallback>RL</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Robert Langdon</ItemTitle>
          <ItemDescription>langdon@example.edu</ItemDescription>
        </ItemContent>
        <ItemAction>
          <Button variant='tertiary' size='xs'>
            Follow
          </Button>
        </ItemAction>
      </Item>
      <Separator />
      <Item variant='plain'>
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src='https://api.dicebear.com/9.x/avataaars/svg?radius=50&seed=Hermione+Granger'
              alt='Avatar'
            />
            <AvatarFallback>HG</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Hermione Granger</ItemTitle>
          <ItemDescription>hermione@hogwarts.edu</ItemDescription>
        </ItemContent>
        <ItemAction>
          <Button variant='tertiary' size='xs'>
            Follow
          </Button>
        </ItemAction>
      </Item>
      <Separator />
      <Item variant='plain'>
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src='https://api.dicebear.com/9.x/avataaars/svg?radius=50&seed=Sophie+Neveu'
              alt='Avatar'
            />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Sophie Neveu</ItemTitle>
          <ItemDescription>sophie@dgpj.fr</ItemDescription>
        </ItemContent>
        <ItemAction>
          <Button variant='tertiary' size='xs'>
            Follow
          </Button>
        </ItemAction>
      </Item>
      <Separator />
      <Item variant='plain'>
        <ItemMedia>
          <Avatar>
            <AvatarImage
              src='https://api.dicebear.com/9.x/avataaars/svg?radius=50&seed=Ron+Weasley'
              alt='Avatar'
            />
            <AvatarFallback>RW</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Ron Weasley</ItemTitle>
          <ItemDescription>ron@hogwarts.edu</ItemDescription>
        </ItemContent>
        <ItemAction>
          <Button variant='tertiary' size='xs'>
            Follow
          </Button>
        </ItemAction>
      </Item>
    </Stack>
  )
}
