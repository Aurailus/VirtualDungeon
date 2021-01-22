export default interface ActionEvent {
	event: 'prev' | 'next' | 'push';
	head: number;
	length: number;
}
