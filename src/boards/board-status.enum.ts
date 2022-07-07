//원래는 model에 정의했으나 데이터베이스를 사용하면 entity로 저장하므로 필요가 없어진다.
//파일 이름 board.model.ts -> board-status.enum.ts로 변경
/*8export interface Board {
	id: string,
	title: string,
	description: string,
	status: BoardStatus
}
*/

export enum BoardStatus {
	PUBLIC = 'PUBLIC',
	PRIVATE = 'PRIVATE'
}