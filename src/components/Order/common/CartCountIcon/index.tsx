import type { SVGProps } from 'react';

import EightIcon from 'assets/svg/Store/CartCount/eight-icon.svg';
import FiveIcon from 'assets/svg/Store/CartCount/five-icon.svg';
import FourIcon from 'assets/svg/Store/CartCount/four-icon.svg';
import NineIcon from 'assets/svg/Store/CartCount/nine-icon.svg';
import NinePlusIcon from 'assets/svg/Store/CartCount/nine-plus-icon.svg';
import OneIcon from 'assets/svg/Store/CartCount/one-icon.svg';
import SevenIcon from 'assets/svg/Store/CartCount/seven-icon.svg';
import SixIcon from 'assets/svg/Store/CartCount/six-icon.svg';
import ThreeIcon from 'assets/svg/Store/CartCount/three-icon.svg';
import TwoIcon from 'assets/svg/Store/CartCount/two-icon.svg';
import ZeroIcon from 'assets/svg/Store/CartCount/zero-icon.svg';

const COUNT_ICONS = [
  ZeroIcon,
  OneIcon,
  TwoIcon,
  ThreeIcon,
  FourIcon,
  FiveIcon,
  SixIcon,
  SevenIcon,
  EightIcon,
  NineIcon,
];

interface CartCountIconProps extends SVGProps<SVGSVGElement> {
  count: number;
}

/** 장바구니 담은 수량을 숫자 원 아이콘으로 그린다. 10개 이상은 `9+` 아이콘이다. */
export default function CartCountIcon({ count, ...props }: CartCountIconProps) {
  const Icon = count > 9 ? NinePlusIcon : COUNT_ICONS[count];

  return <Icon {...props} />;
}
