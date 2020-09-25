import { NavMenu } from '../common/NavMenu'

export class MapNavMenu extends NavMenu {
  constructor() {
    super([
      { texture: 'map_b_2.png', title: 'Главная' },
      { texture: 'map_b_3.png', title: 'Профиль' },
      { texture: 'map_b_4.png', title: 'Клан' },
      { texture: 'map_b_5.png', title: 'Задания' },
      { texture: 'map_b_6.png', title: 'Магазин' },
    ])
  }
}