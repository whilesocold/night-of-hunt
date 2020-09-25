import { NavMenu } from '../common/NavMenu'

export class SearchOpponentNavMenu extends NavMenu {
  constructor() {
    super([
      { texture: 'map_b_2.png', title: 'Главная' },
      { texture: 'map_b_3.png', title: 'Герой' },
      { texture: 'map_b_4.png', title: 'Клан' },
      { texture: 'map_b_6.png', title: 'Магазин' },
    ])
  }
}