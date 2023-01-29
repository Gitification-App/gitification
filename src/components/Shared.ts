import { markRaw } from 'vue'

import MoreIcon from 'virtual:icons/ph/dots-three-duotone'
import GearIcon from 'virtual:icons/ph/gear-light'
import HomeIcon from 'virtual:icons/ph/house-simple'

export const Icons = {
  More: markRaw(MoreIcon),
  Gear: markRaw(GearIcon),
  Home: markRaw(HomeIcon),
}
