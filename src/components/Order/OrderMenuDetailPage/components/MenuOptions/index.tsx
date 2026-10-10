import type { MenuOptionGroup } from 'api/order/entity';
import CheckboxFalse from 'assets/svg/Store/checkbox-false.svg';
import CheckboxTrue from 'assets/svg/Store/checkbox-true.svg';
import RadioFalse from 'assets/svg/Store/radio-false.svg';
import RadioTrue from 'assets/svg/Store/radio-true.svg';
import type { SelectedOption } from 'components/Order/OrderMenuDetailPage/hooks/useMenuSelection';
import Badge from 'components/ui/Badge';

import styles from './MenuOptions.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/MenuOptions 이전.
// 최소·최대 선택이 모두 1이면 라디오, 아니면 체크박스. 필수 그룹은 '필수' 또는 'N가지 선택' 뱃지를 단다
interface MenuOptionsProps {
  optionGroups: MenuOptionGroup[];
  selectedOptions: SelectedOption[];
  selectOption: (optionGroupId: number, optionId: number, isSingle: boolean, maxSelect: number) => void;
}

function TypeIcon({ isSingle, checked }: { isSingle: boolean; checked: boolean }) {
  if (isSingle) return checked ? <RadioTrue /> : <RadioFalse />;

  return checked ? <CheckboxTrue /> : <CheckboxFalse />;
}

export default function MenuOptions({ optionGroups, selectedOptions, selectOption }: MenuOptionsProps) {
  return (
    <div className={styles.options}>
      {optionGroups.map((group) => {
        const isSingle = group.min_select === 1 && group.max_select === 1;
        const groupSelected = selectedOptions
          .filter((option) => option.optionGroupId === group.id)
          .map((option) => option.optionId);

        return (
          <div key={group.id} className={styles.group}>
            <div className={styles.group__inner}>
              <div className={styles.group__header}>
                <div className={styles.group__title}>
                  <span className={styles.group__name}>{group.name}</span>
                  {group.description && <span className={styles.group__description}>{group.description}</span>}
                </div>
                {group.is_required && (
                  <Badge
                    label={group.min_select === 1 ? '필수' : `${group.max_select}가지 선택`}
                    color="primaryLight"
                    variant="outlined"
                    font="xs"
                    className={styles.group__badge}
                  />
                )}
              </div>
              <div className={styles.group__list}>
                {group.options.map((option) => {
                  const checked = groupSelected.includes(option.id);

                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={styles.group__item}
                      onClick={() => selectOption(group.id, option.id, isSingle, group.max_select)}
                      role={isSingle ? 'radio' : 'checkbox'}
                      aria-checked={checked}
                    >
                      <TypeIcon isSingle={isSingle} checked={checked} />
                      <span className={styles.group__option}>{option.name}</span>
                      <span className={styles.group__price}>
                        +{option.price.toLocaleString()}원
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
