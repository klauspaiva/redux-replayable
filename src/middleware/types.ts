export interface Action {
  type: string;
  meta?: any;
  // anything else really, we don't look at individual properties
}
