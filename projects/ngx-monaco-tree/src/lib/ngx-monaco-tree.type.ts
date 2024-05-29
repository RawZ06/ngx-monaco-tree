export type MonacoTreeElement = {
	name: string;
  color?: 'red'|'yellow'|'green'|'gray'|string;
	content?: MonacoTreeElement[]
}
