export interface Category {
  id: string;
  name: string;
  iconName: string;
  count?: number;
}

export type QuickCategoryAction = 'filter' | 'random' | 'tag';

export interface QuickCategory {
  id: string;
  label: string;
  iconName: string;
  color: string;
  bgGlow: string;
  actionType: QuickCategoryAction;
  filterValue?: string;
}

export interface PromoBannerData {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonColor: string;
  buttonBg: string;
  image: string;
  iconName: string;
  iconColor: string;
  link: string;
}
